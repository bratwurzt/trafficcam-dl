//    This code is a java version of the wqrs beat detector 
//    Copyright (C) 2013, University of Oxford
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 2 of the License, or
//    any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

//Authors: 	Gari D Clifford -
//			Julien Oster	- 

package si.bleedy.detectors;

import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;

import java.io.Serializable;
import java.util.*;

import si.bleedy.data.ObservationData;

public class wQRS implements Serializable
{
  //for writng and reading files (most of them are for debugging purpose)
  private boolean DEBUG = false;

  private BufferedWriter ltransf_out_log = null;

  //Create an output file to store QRS locations, RR interval
  private File log_file = null;
  //private BufferedWriter QrsOutput = null;

  private long BUFLN = 16384;  // must be a power of 2, see ltsamp()
  private double EYE_CLS = 0.25;   // eye-closing period is set to 0.25 sec (250 ms) */
  private double MaxQRSw = 0.13;    // maximum QRS width (130ms) */
  private double NDP = 2.5;    // adjust threshold if no QRS found in NDP seconds */
  private double PWFreqDEF = 50;    /* power line (mains) frequency, in Hz (default) */
  private double TmDEF = 100;	/* minimum threshold value (default) */

  //char *pname;		/* the name by which this program was invoked */
  private double lfsc = 0;		/* length function scale constant */
  //int *ebuf;
  //int nsig;		/* number of input signals */
  private int LPn, LP2n;          /* filter parameters (dependent on sampling rate) */
  private int LTwindow;           /* LT window size */
  private int PWFreq = (int)PWFreqDEF;	/* power line (mains) frequency, in Hz */
  private int sig = -1;	        /* signal number of signal to be analyzed */
  private int Tm = (int)TmDEF;		/* minimum threshold value */

  private double lbuf[];
  private long ebuf[];

  private double sps = 250;			     /* sampling frequency, in Hz (SR) */
  private double samplingInterval = 1 / sps, max, min, onset;          /* sampling interval, in milliseconds */
  private int i, minutes = 0, timer, vflag = 0;

  private int EyeClosing;                  /* eye-closing period, related to SR */
  private int ExpectPeriod;                /* if no QRS is detected over this period,
      the threshold is automatically reduced
			to a minimum value;  the threshold is
			restored upon a detection */
  private double Ta, T0, T1;		     /* high and low detection thresholds */
  //WFDB_Anninfo a;
  //WFDB_Annotation annot;
  private double gain = 200;
  //WFDB_Siginfo *s;
  private long from = 0L, next_minute, spm, t, tj, tpq, to = 0L, tt, t1;

  private long sampleNo, lastQRSSampleNo;
  private int lastObsIndex;
  private double time;
  private double Yn, Yn1, Yn2;

  private int SAMBUFLN = (int)sps / 2;
  private double sampletab[];
  private double dytab[];
  private double ltransf[];
  private boolean NoRefractoryPeriod = true;
  private long timerRefactory = 0;
  private long lastTimestamp = 0;
  private boolean NoFlagLTransf = true;
  private List<Long> m_lastTimestamps = new ArrayList<>();

  public void init()
  {
    sps = 250;
    sampleNo = 0;
    time = 0;
    samplingInterval = 1000.0 / sps;
    lfsc = 1.25 * gain * gain / sps;	/* length function scale constant */
    spm = (long)Math.round(60 * sps);
    next_minute = from + spm;
    LPn = (int)sps / PWFreq; 		/* The LP filter will have a notch at the
          power line (mains) frequency */
    if (LPn > 8)
    {
      LPn = 8;	/* avoid filtering too agressively */
    }
    LP2n = 2 * LPn;
    EyeClosing = (int)Math.round(sps * EYE_CLS); /* set eye-closing period */
    ExpectPeriod = (int)Math.round(sps * NDP);	/* maximum expected RR interval */
    LTwindow = (int)(sps * MaxQRSw);   /* length transform window size */

    Yn = 0;
    Yn1 = 0;
    Yn2 = 0;

    T0 = 100.0;
    T1 = 2 * T0;
    Ta = 3 * T0;

    sampletab = new double[SAMBUFLN];
    dytab = new double[SAMBUFLN];
    ltransf = new double[SAMBUFLN];

    int indexInitialise = 0;

    for (indexInitialise = 0; indexInitialise < SAMBUFLN; indexInitialise++)
    {
      sampletab[indexInitialise] = 0;
      dytab[indexInitialise] = (int)Math.sqrt(lfsc);
      ltransf[indexInitialise] = 0;
    }
    //String file_name = "QRS_Ouput_" + fileName + "Wqrs.txt";
    //log_file = new File(root_dir, file_name);
    //try
    //{
    //  QrsOutput = new BufferedWriter(new FileWriter(log_file));
    //}
    //catch (IOException e)
    //{
    //  // TODO Auto-generated catch block
    //  e.printStackTrace();
    //  System.err.print("Could not generate QRS output file:" + log_file);
    //}
    //
    //if (DEBUG)
    //{
    //
    //  ltransf_output_file = new File(root_dir, ltransf_filename);
    //
    //  try
    //  {
    //    ltransf_out_log = new BufferedWriter(new FileWriter(ltransf_output_file));
    //  }
    //  catch (IOException e)
    //  {
    //    System.err.print("Could not open band-pass debug file.");
    //  }
    //}
  }
  // ltsamp() returns a sample of the length transform of the input at time t.
  //Since this program analyzes only one signal, ltsamp() does not have an
  //input argument for specifying a signal number; rather, it always filters
  //and returns samples from the signal designated by the global variable
  //'sig'.  The caller must never "rewind" by more than BUFLN samples (the
  //length of ltsamp()'s buffers). */

  private void ltsamp(long t)
  {
    double aet = 0;

    double v0, v1, v2, dy = 0;

    Yn2 = Yn1;
    Yn1 = Yn;

    //TODO create sample buffer storing BUFLN smaples..(maybe too long)

    v0 = sampletab[(int)(t % SAMBUFLN)];
    if (t >= LPn)
    {
      v1 = sampletab[(int)((t - LPn) % SAMBUFLN)];
    }
    else
    {
      v1 = 0;
    }
    if (t >= LP2n)
    {
      v2 = sampletab[(int)((t - LP2n) % SAMBUFLN)];
    }
    else
    {
      v2 = 0;
    }
    Yn = (2 * Yn1 - Yn2 + v0 - 2 * v1 + v2);

    dy = (double)((Yn - Yn1) / (double)LP2n);
    dytab[(int)(t % SAMBUFLN)] = (Math.sqrt(lfsc + dy * dy));	/* lowpass derivative of input */

    ltransf[(int)(t % SAMBUFLN)] = 0;
    if (t > LTwindow)
    {
      aet = ltransf[(int)((t - 1) % SAMBUFLN)];
      aet += dytab[(int)(t % SAMBUFLN)] - dytab[(int)((t - LTwindow) % SAMBUFLN)];
      ltransf[(int)(t % SAMBUFLN)] = aet;
    }
    else if (t > 0)
    {
      aet = ltransf[(int)((t - 1) % SAMBUFLN)];
      aet += dytab[(int)((t) % SAMBUFLN)] - Math.sqrt(lfsc);
      ltransf[(int)(t % SAMBUFLN)] = aet;
    }

    //subtract the value of sqrt(c)*LTwindow....JOs
    //ltransf[(int)(t%SAMBUFLN)]-=Math.sqrt(lfsc)*LTwindow;

    if (DEBUG)
    {
      String strLtransfOutput = sampleNo + " " + sampletab[(int)(t % SAMBUFLN)] + " " + dy + " " + ltransf[(int)(t % SAMBUFLN)];
      try
      {
        ltransf_out_log.write(strLtransfOutput);
        ltransf_out_log.newLine();
        ltransf_out_log.flush();
      }
      catch (IOException e3)
      {
        System.err.print("Could not write band pass debug output file.");
      }
    }
  }

  synchronized public List<ObservationData> getResult(List<ObservationData> collect)
  {
    List<ObservationData> qrsTimes = new ArrayList<>();
    //Read the txt file as a stream
    for (int i = 0; i < collect.size(); i++)
    {
      ObservationData sample = collect.get(i);
      sampletab[(int)(sampleNo % SAMBUFLN)] = gain * sample.getValue();
      ltsamp(sampleNo);

		/* Average the first 8 seconds of the length-transformed samples
		to determine the initial thresholds Ta and T0. The number of samples
		in the average is limited to half of the ltsamp buffer if the sampling
		frequency exceeds about 2 KHz. */
      if (time < 8.0)
      {
        T0 += ltransf[(int)(sampleNo % SAMBUFLN)];
      }
      else if (time == 8.0)
      {
        T0 += ltransf[(int)(sampleNo % SAMBUFLN)];
        T0 /= (8 * sps);
        Ta = 3 * T0;

        T1 = 2 * T0; //JOs not sure this is right...was 2*T0
      }

      //		/* Main loop */
      //		for (t = from; t < to || (to == 0L && sample_valid()); t++) {
      //		static int learning = 1, T1;
      //
      //		if (learning) {
      //		if (t > t1) {
      //		learning = 0;
      //		T1 = T0;
      //		t = from;	/* start over */
      //		}
      //		else
      //		T1 = 2*T0;
      //		}

		/* Compare a length-transformed sample against T1. */
      if (NoFlagLTransf && NoRefractoryPeriod)
      {

        if (ltransf[(int)(sampleNo % SAMBUFLN)] > T1)
        {	/* found a possible QRS near t */
          timer = 0; /* used for counting the time after previous QRS */
          lastQRSSampleNo = sampleNo;
          lastObsIndex = i;
          NoFlagLTransf = false;
          max = ltransf[(int)(sampleNo % SAMBUFLN)];
          min = ltransf[(int)(sampleNo % SAMBUFLN)];

          for (tt = sampleNo - 1; (tt > lastQRSSampleNo - EyeClosing / 2) && (tt >= 0); tt--)
          {
            if (ltransf[(int)(tt % SAMBUFLN)] < min)
            {
              min = ltransf[(int)(tt % SAMBUFLN)];
            }
          }
        }
      }
      else if (NoRefractoryPeriod)
      {
        timer++;
        if (ltransf[(int)(sampleNo % SAMBUFLN)] > max)
        {
          max = ltransf[(int)(sampleNo % SAMBUFLN)];
        }
        if (timer >= (EyeClosing / 2))
        {
          if (max > min + 10)
          {
            onset = max / 100 + 2;
            tpq = lastQRSSampleNo - 5;
            //for (tt = lastQRStime; (tt > lastQRStime - EyeClosing/2)&&(tt>3); tt--) {
            tt = lastQRSSampleNo;
            while ((tt > lastQRSSampleNo - EyeClosing / 2) && (tt > 3) && (NoRefractoryPeriod))
            {
              if (ltransf[(int)(tt % SAMBUFLN)] - ltransf[(int)((tt - 1) % SAMBUFLN)] < onset &&
                  ltransf[(int)((tt - 1) % SAMBUFLN)] - ltransf[(int)((tt - 2) % SAMBUFLN)] < onset &&
                  ltransf[(int)((tt - 2) % SAMBUFLN)] - ltransf[(int)((tt - 3) % SAMBUFLN)] < onset &&
                  ltransf[(int)((tt - 3) % SAMBUFLN)] - ltransf[(int)((tt - 4) % SAMBUFLN)] < onset)
              {
                tpq = tt - LP2n;  // account for phase shift
                NoRefractoryPeriod = false;
                timerRefactory = (long)(0.25 * sps);
                if (lastQRSSampleNo != tpq)
                {
                  if (lastQRSSampleNo > tpq)
                  {
                    lastObsIndex = lastObsIndex - (int)(lastQRSSampleNo - tpq);
                  }
                  //else
                  //{
                  //  lastObsIndex = lastObsIndex + (int)(tpq - lastQRSSampleNo);
                  //}
                  lastQRSSampleNo = tpq;
                }
                // Adjust thresholds */
                Ta += (max - Ta) / 10;
                T1 = Ta / 3;

                //save QRS in text file
                if (lastObsIndex > 0)
                {
                  try
                  {
                    qrsTimes.add(new ObservationData("qrs", "bool", collect.get(lastObsIndex - 1).getTimestamp(), 0));
                    qrsTimes.add(new ObservationData("qrs", "bool", collect.get(lastObsIndex).getTimestamp(), 1));
                    qrsTimes.add(new ObservationData("qrs", "bool", collect.get(lastObsIndex + 1).getTimestamp(), 0));
                  }
                  catch (Exception e)
                  {
                    e.printStackTrace();
                  }
                }
                //else if (lastObsIndex < 0)
                //{
                //  int normIndex = -1 * lastObsIndex;
                //  if (m_lastTimestamps.size() > normIndex + 1)
                //  {
                //    try
                //    {
                //      qrsTimes.add(new ObservationData("qrs", "bool", m_lastTimestamps.get(normIndex + 1), 0));
                //      qrsTimes.add(new ObservationData("qrs", "bool", m_lastTimestamps.get(normIndex), 1));
                //      qrsTimes.add(new ObservationData("qrs", "bool", m_lastTimestamps.get(normIndex - 1), 0));
                //    }
                //    catch (Exception e)
                //    {
                //      e.printStackTrace();
                //    }
                //  }
                //}
                else
                {
                  System.out.println();
                }
                //try
                //{
                //  QrsOutput.write(strQrsOutput);
                //  QrsOutput.newLine();
                //  QrsOutput.flush();
                //}
                //catch (IOException e3)
                //{
                //  System.err.print("Could not write QRS output file.");
                //}
              }
              tt--;
            }
          }
          NoFlagLTransf = true;
        }
      }
      else
      {
        timerRefactory--;
        if (timerRefactory == 0)
        {
          NoRefractoryPeriod = true;
        }
      }

      //JOS to start form her next time....

      // Once past the learning period, decrease threshold if no QRS
      // was detected recently
      if ((sampleNo - lastQRSSampleNo) > ExpectPeriod && Ta > Tm)
      {
        Ta--;
        T1 = Ta / 3;
      }

      //increment sampleIndex and time
      time += lastTimestamp == 0 ? 1 / (sps) : sample.getTimestamp() - lastTimestamp;
      sampleNo++;
      lastTimestamp = sample.getTimestamp();
    }
    m_lastTimestamps.clear();
    for (int i = collect.size() - 1; i > collect.size() - 11; i--)
    {
      m_lastTimestamps.add(collect.get(i).getTimestamp());
    }
    return qrsTimes;
  }
}