package si.bleedy;

import java.awt.*;
import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import javax.swing.*;

import org.apache.commons.math3.complex.Complex;
import org.apache.commons.math3.transform.DftNormalization;
import org.apache.commons.math3.transform.FastFourierTransformer;
import org.apache.commons.math3.transform.TransformType;
import org.apache.log4j.Logger;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.api.java.function.Function2;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.Duration;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.Time;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.jfree.chart.ChartPanel;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.DateAxis;
import org.jfree.chart.axis.NumberAxis;
import org.jfree.chart.axis.ValueAxis;
import org.jfree.chart.plot.CombinedDomainXYPlot;
import org.jfree.chart.plot.XYPlot;
import org.jfree.chart.renderer.xy.StandardXYItemRenderer;
import org.jfree.data.time.Millisecond;
import org.jfree.data.time.TimeSeries;
import org.jfree.data.time.TimeSeriesCollection;
import org.jfree.ui.ApplicationFrame;
import org.jfree.ui.RefineryUtilities;
import com.google.common.collect.Iterables;

import scala.Tuple2;
import si.bleedy.data.ObservationData;
import si.bleedy.runnable.IOTTCPReceiver;

/**
 * @author bratwurzt
 */
public class TestIOTStreaming extends ApplicationFrame implements Serializable
{
  private static final long serialVersionUID = -4289949126909167376L;
  private static final Logger LOG = Logger.getLogger(TestIOTStreaming.class);
  //private float m_vcc = 3.3f;
  //private float m_vcc = 5.0f, ganancia = 5.0f, RefTension = 2.98f, Ra = 2985.0f, Rc = 2995.0f, Rb = 698.0f;
  private static float m_vcc = 5.0f, ganancia = 5.0f, RefTension = 2.98f, Ra = 4640.0f, Rc = 4719.0f, Rb = 698.0f;
  private SimpleDateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm");
  protected final ExecutorService m_threadPool = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());

//  static
//  {
//    URL url = Thread.currentThread().getContextClassLoader().getResource("config/log4j.properties");
//    PropertyConfigurator.configure(url);
//  }

  /**
   * The number of subplots.
   */
  public static final String[] PLOT_NAMES = new String[]{"r to r_s", "heart rate_bpm", "vmu_g", "respiration rate_bpm", "breathing wave amplitude_ml"};
//  public static final String[] PLOT_NAMES = new String[]{
//      "r to r_s", "heart rate_bpm", "vmu_g", "respiration rate_bpm", "breathing wave amplitude_ml", "rpi-gsr_mV", "rpi-temp_mV"/*, "rpi-ecg_mV"*/
//  };
//  public static final String[] PLOT_NAMES = new String[]{"rpi-gsr_mV", "rpi-temp_mV"};

  /**
   * The datasets.
   */
  public final TimeSeriesCollection[] datasets;

  /**
   * The most recent value added to series 1.
   */
//  private final double[] lastValue;
  public TestIOTStreaming(String name)
  {
    super(name);
//    lastValue = new double[PLOT_NAMES.length];

    final CombinedDomainXYPlot plot = new CombinedDomainXYPlot(new DateAxis("Time"));
    this.datasets = new TimeSeriesCollection[PLOT_NAMES.length];

    for (int i = 0; i < PLOT_NAMES.length; i++)
    {
//      this.lastValue[i] = 100.0;
      String[] split = PLOT_NAMES[i].split("_");
      final TimeSeries series = new TimeSeries(split[0]);
      this.datasets[i] = new TimeSeriesCollection(series);
      final NumberAxis rangeAxis = new NumberAxis(split[1]);
      rangeAxis.setAutoRangeIncludesZero(false);
      final XYPlot subplot = new XYPlot(
          this.datasets[i], null, rangeAxis, new StandardXYItemRenderer()
      );
      subplot.setBackgroundPaint(Color.lightGray);
      subplot.setDomainGridlinePaint(Color.white);
      subplot.setRangeGridlinePaint(Color.white);
      plot.add(subplot);
    }

    final JFreeChart chart = new JFreeChart("Spark save and read (triggers)", plot);
    //        chart.getLegend().setAnchor(Legend.EAST);
    chart.setBorderPaint(Color.black);
    chart.setBorderVisible(true);
    chart.setBackgroundPaint(Color.white);

    plot.setBackgroundPaint(Color.lightGray);
    plot.setDomainGridlinePaint(Color.white);
    plot.setRangeGridlinePaint(Color.white);
    //      plot.setAxisOffset(new Spacer(Spacer.ABSOLUTE, 4, 4, 4, 4));
    final ValueAxis axis = plot.getDomainAxis();
    axis.setAutoRange(true);
    axis.setFixedAutoRange(240000.0);  // 60 seconds

    final JPanel content = new JPanel(new BorderLayout());
    final ChartPanel chartPanel = new ChartPanel(chart);
    content.add(chartPanel);
    setContentPane(content);
  }

  private void runSpark() throws ParseException, InterruptedException
  {
    SparkConf conf = new SparkConf()
        .setAppName("heart")
        .set("spark.cassandra.connection.host", "cassandra.marand.si")
        .set("spark.cassandra.connection.port", "9042")
        .setMaster("local[3]");

    // streaming
    Duration batchDuration = Durations.milliseconds(500);
    final JavaStreamingContext ssc = new JavaStreamingContext(conf, batchDuration);

    JavaDStream<ObservationData> zephyrStream = ssc.receiverStream(
        new IOTTCPReceiver(StorageLevel.MEMORY_ONLY(), 8099)
    )
        .filter((Function<ObservationData, Boolean>)ObservationData::filterNonEcgZephyr);

    //final JavaDStream<ObservationData> mqttStream = MQTTUtils.createStream(ssc, "tcp://10.99.9.25:1883", "temp/gsr/ecg/time")
    //    .map(entry -> entry.split("\\|"))
    //    .flatMap((FlatMapFunction<String[], ObservationData>)strings -> {
    //      int tempAnalog = Integer.parseInt(strings[0]);
    //      int gsrAnalog = Integer.parseInt(strings[1]);
    //      int ecgAnalog = Integer.parseInt(strings[2]);
    //      long timestamp = Long.parseLong(strings[3]);
    //      return Arrays.asList(
    //          new ObservationData("rpi-temp", "mV", timestamp, TestIOTStreaming.getVoltage(tempAnalog)),
    //          new ObservationData("rpi-gsr", "mV", timestamp, TestIOTStreaming.getVoltage(gsrAnalog)),
    //          new ObservationData("rpi-ecg", "mV", timestamp, TestIOTStreaming.getVoltage(ecgAnalog))
    //      );
    //    })
    //    .transform((Function2<JavaRDD<ObservationData>, Time, JavaRDD<ObservationData>>)(rdd, time) -> getRollingMeanJavaRDD(rdd));

//    JavaDStream<ObservationData> union = zephyrStream.union(mqttStream);

//    CassandraStreamingJavaUtil.javaFunctions(union)
//        .writerBuilder("obskeyspace", "observations", CassandraJavaUtil.mapToRow(ObservationData.class))
//        .saveToCassandra();

//    zephyrStream.foreachRDD((Function<JavaRDD<ObservationData>, Void>)rdd -> {
//          if (rdd.count() > 0)
//          {
//            final List<Tuple2<String, Iterable<ObservationData>>> collect = rdd
//                .groupBy(ObservationData::getGrouping)
//                .collect();
//
//            m_threadPool.execute(new PlotGraphAsync(collect));
//          }
//          return null;
//        });

//        JavaDStream<ObservationData> cassStream = ssc.receiverStream(
//            new CassandraTCPReceiver(StorageLevel.MEMORY_ONLY(), 8111)
//        );

    ssc.start();
    ssc.awaitTermination();
  }

  private class PlotGraphAsync implements Runnable
  {
    private final List<Tuple2<String, Iterable<ObservationData>>> m_collect;

    public PlotGraphAsync(List<Tuple2<String, Iterable<ObservationData>>> collect)
    {
      m_collect = collect;
    }

    @Override
    public void run()
    {
      for (Tuple2<String, Iterable<ObservationData>> t : m_collect)
      {
        t._2().forEach(o -> {
          int index = ObservationData.getIndex(PLOT_NAMES, t._1());
          if (index >= 0)
          {
            synchronized (datasets)
            {
              datasets[index].getSeries(0).add(new Millisecond(new Date(o.getTimestamp())), o.getValue());
            }
          }
        });
      }
    }
  }

  private JavaRDD<ObservationData> getRollingMeanJavaRDD(JavaRDD<ObservationData> rdd)
  {
    return rdd
//        .sortBy((Function<ObservationData, Long>)ObservationData::getTimestamp, false, 2)
        .groupBy(ObservationData::getGrouping)
        .mapValues(o -> {
          if (o != null)
          {
            int size = Iterables.size(o);
            if (size > 0)
            {
              Iterator<ObservationData> iterator = o.iterator();
              ObservationData d = iterator.next();
              String name = d.getName();
              String unit = d.getUnit();
              double avgValue = d.getValue();
              while (iterator.hasNext())
              {
                d = iterator.next();
                avgValue += d.getValue();
              }
              avgValue /= size;
              return new ObservationData(
                  name,
                  unit,
                  d.getTimestamp(),
                  avgValue
              );
            }
          }
          return null;
        })
        .values();
  }

  private ObservationData computeConductance(int gsrAnalog, long timestamp)
  {
    float voltage = getVoltage(gsrAnalog);
    double conductance = 2 * ((voltage - 0.497) / 100000);
    return new ObservationData("gsr", "resistance", timestamp, conductance);
  }

  public static float getVoltage(int analogValue)
  {
    return (analogValue * m_vcc) / 1023;
  }

  private ObservationData computeTemperature(int tempAnalog, long timestamp)
  {
    float Temperature = 0f; //Corporal Temperature
    float Resistance;  //Resistance of sensor.
    float voltage = getVoltage(tempAnalog);
    voltage = voltage / ganancia;
    // Resistance sensor calculate
    float aux = (voltage / RefTension) + Rb / (Rb + Ra);
    Resistance = Rc * aux / (1 - aux);
    if (Resistance >= 1822.8)
    {
      // if temperature between 25ºC and 29.9ºC. R(tª)=6638.20457*(0.95768)^t
      Temperature = (float)(Math.log(Resistance / 6638.20457) / Math.log(0.95768));
    }
    else
    {
      if (Resistance >= 1477.1)
      {
        // if temperature between 30ºC and 34.9ºC. R(tª)=6403.49306*(0.95883)^t
        Temperature = (float)(Math.log(Resistance / 6403.49306) / Math.log(0.95883));
      }
      else
      {
        if (Resistance >= 1204.8)
        {
          // if temperature between 35ºC and 39.9ºC. R(tª)=6118.01620*(0.96008)^t
          Temperature = (float)(Math.log(Resistance / 6118.01620) / Math.log(0.96008));
        }
        else
        {
          if (Resistance >= 988.1)
          {
            // if temperature between 40ºC and 44.9ºC. R(tª)=5859.06368*(0.96112)^t
            Temperature = (float)(Math.log(Resistance / 5859.06368) / Math.log(0.96112));
          }
          else
          {
            if (Resistance >= 811.7)
            {
              // if temperature between 45ºC and 50ºC. R(tª)=5575.94572*(0.96218)^t
              Temperature = (float)(Math.log(Resistance / 5575.94572) / Math.log(0.96218));
            }
          }
        }
      }
    }
    return new ObservationData("temp", "celsius", timestamp, Temperature);
  }

  private double[] applyBandStopFFT(double input[])
  {
    //fft works on data length = some power of two
    int fftLength;
    int length = input.length;  //initialized with input's length
    int power = 0;
    while (true)
    {
      int powOfTwo = (int)Math.pow(2, power);  //maximum no. of values to be applied fft on

      if (powOfTwo == length)
      {
        fftLength = powOfTwo;
        break;
      }
      if (powOfTwo > length)
      {
        fftLength = (int)Math.pow(2, (power - 1));
        break;
      }
      power++;
    }

    double[] tempInput = Arrays.copyOf(input, fftLength);

    //hanning window
    for (int i = 0; i < tempInput.length; i++)
    {
      tempInput[i] *= 0.5 * (1 - Math.cos((2 * Math.PI * i) / (tempInput.length - 1)));
    }

    FastFourierTransformer fft = new FastFourierTransformer(DftNormalization.STANDARD);
    //apply fft on input
    Complex[] complexTransInput = fft.transform(tempInput, TransformType.FORWARD);

    float bandstop = 50f;
    float sampleRate = 100f;
    float fftSize = tempInput.length;

    for (int i = 0; i < complexTransInput.length; i++)
    {
      double real = (complexTransInput[i].getReal());
      double img = (complexTransInput[i].getImaginary());

      float frequency = i * sampleRate / fftSize;
      if (frequency > bandstop - 1 && frequency < bandstop + 1)
      {
        tempInput[i] = 0;
      }
      else
      {
        tempInput[i] = Math.sqrt((real * real) + (img * img));
      }
    }
    Complex[] inverseTransform = fft.transform(tempInput, TransformType.INVERSE);
    for (int i = 0; i < inverseTransform.length; i++)
    {
      double real = (inverseTransform[i].getReal());
      double img = (inverseTransform[i].getImaginary());
      tempInput[i] = Math.sqrt((real * real) + (img * img));
    }
    return tempInput;
  }


  private JavaDStream<ObservationData> getMuseArousalValenceDStream(JavaDStream<ObservationData> museStream)
  {
    JavaDStream<ObservationData> eegFPAlphaBetaStream = museStream
        .filter(e -> ("ALPHA_ABSOLUTE".equals(e.getName()) || "BETA_ABSOLUTE".equals(e.getName()))
            && ("FP1".equals(e.getUnit()) || "FP2".equals(e.getUnit())));

    return eegFPAlphaBetaStream
        .transform(new Function<JavaRDD<ObservationData>, JavaRDD<ObservationData>>()
        {
          private static final long serialVersionUID = -6490438026689680564L;

          @Override
          public JavaRDD<ObservationData> call(JavaRDD<ObservationData> rdd) throws Exception
          {
            if (rdd != null && rdd.count() > 0)
            {
              return rdd.groupBy(observationData -> observationData.getTimestamp() / 2)
                  .flatMapValues((Function<Iterable<ObservationData>, Iterable<ObservationData>>)this::computeArousalAndValence)
                  .values();
            }
            return null;
          }

          private Iterable<ObservationData> computeArousalAndValence(Iterable<ObservationData> o)
          {
            List<ObservationData> returnList = new ArrayList<>();
            if (o != null && Iterables.size(o) == 4)
            {
              double[] fp1fp2AlphaBeta = new double[4]; // fp1-A, fp2-A, fp1-B, fp2-B
              Long avgTimestamp = null;
              for (ObservationData obs : o)
              {
                avgTimestamp = avgTimestamp == null ? obs.getTimestamp() : avgTimestamp + obs.getTimestamp();
                fp1fp2AlphaBeta[ObservationData.getIndex(PLOT_NAMES, obs.getGrouping())] = obs.getValue();
              }
              avgTimestamp /= 4;

              // arousal
              double arousalEmil = ((fp1fp2AlphaBeta[0] - fp1fp2AlphaBeta[2]) + (fp1fp2AlphaBeta[1] - fp1fp2AlphaBeta[3])) / 2;
              returnList.add(new ObservationData(
                  "AROUSAL_EMIL",
                  "",
                  avgTimestamp,
                  String.valueOf(arousalEmil)
              ));

              // Sergio Giraldo, Rafael Ramirez:2013:Brain-Activity-Driven Real-Time Music Emotive Control:4
              double arousal = (fp1fp2AlphaBeta[2] + fp1fp2AlphaBeta[3]) / (fp1fp2AlphaBeta[0] + fp1fp2AlphaBeta[1]);
              returnList.add(new ObservationData(
                  "AROUSAL_GIRALDO_RAMIREZ",
                  "",
                  avgTimestamp,
                  String.valueOf(arousal)
              ));

              // valence
              // Kenneth Hugdahl, Richard J. Davidson:2003:The asymmetrical brain:568
              double valenceEmil = fp1fp2AlphaBeta[1] - fp1fp2AlphaBeta[0];
              returnList.add(new ObservationData(
                  "VALENCE_EMIL",
                  "",
                  avgTimestamp,
                  String.valueOf(valenceEmil)
              ));
              // Sergio Giraldo, Rafael Ramirez:2013:Brain-Activity-Driven Real-Time Music Emotive Control:4
              double valence = fp1fp2AlphaBeta[1] / fp1fp2AlphaBeta[3] - fp1fp2AlphaBeta[0] / fp1fp2AlphaBeta[2];
              returnList.add(new ObservationData(
                  "VALENCE_GIRALDO_RAMIREZ",
                  "",
                  avgTimestamp,
                  String.valueOf(valence)
              ));
            }
            return returnList;
          }
        })
        .window(Durations.seconds(5), Durations.seconds(1))
        .transform(new Function2<JavaRDD<ObservationData>, Time, JavaRDD<ObservationData>>()  // mean over last 5 seconds
        {
          private static final long serialVersionUID = 5455964470681463716L;

          @Override
          public JavaRDD<ObservationData> call(JavaRDD<ObservationData> rdd, Time time) throws Exception
          {
            if (rdd != null && rdd.count() > 0)
            {
              return rdd.sortBy((Function<ObservationData, Long>)ObservationData::getTimestamp, false, 2)
                  .groupBy(ObservationData::getName)
                  .mapValues(o -> {
                    if (o != null)
                    {
                      int size = Iterables.size(o);
                      if (size > 0)
                      {
                        double avgValue = 0;
                        String name1 = null;
                        Long maxTimestamp = 0L;
                        for (ObservationData d : o)
                        {
                          avgValue += d.getValue();
                          if (name1 == null)
                          {
                            name1 = d.getName();
                          }
                          if (d.getTimestamp() > maxTimestamp)
                          {
                            maxTimestamp = d.getTimestamp();
                          }
                        }
                        avgValue /= size;
                        return new ObservationData(
                            name1,
                            "",
                            maxTimestamp,
                            avgValue
                        );
                      }
                    }
                    return null;
                  })
                  .values();
            }
            return rdd;
          }
        })
        .window(Durations.seconds(20), Durations.seconds(1))
        .transform(new Function2<JavaRDD<ObservationData>, Time, JavaRDD<ObservationData>>()  // normalization over last 20 seconds
        {
          private static final long serialVersionUID = 5455964470681463716L;

          @Override
          public JavaRDD<ObservationData> call(JavaRDD<ObservationData> rdd, Time time) throws Exception
          {
            if (rdd != null && rdd.count() > 0)
            {
              return rdd.sortBy((Function<ObservationData, Long>)ObservationData::getTimestamp, false, 2)
                  .groupBy(ObservationData::getName)
                  .mapValues((Function<Iterable<ObservationData>, ObservationData>)o -> {
                    int size = Iterables.size(o);
                    if (size > 0)
                    {
                      double max = 0, min = Double.MAX_VALUE;
                      String name1 = null;
                      Long maxTimestamp = 0L;
                      double lastValue = 0;
                      for (ObservationData d : o)
                      {
                        if (d.getValue() > max)
                        {
                          max = d.getValue();
                        }
                        if (d.getValue() < min)
                        {
                          min = d.getValue();
                        }
                        if (name1 == null)
                        {
                          name1 = d.getName();
                        }
                        if (d.getTimestamp() > maxTimestamp)
                        {
                          maxTimestamp = d.getTimestamp();
                          lastValue = d.getValue();
                        }
                      }
                      return new ObservationData(
                          name1,
                          "",
                          maxTimestamp,
                          (lastValue - min) / (max - min)
                      );
                    }
                    return null;
                  })
                  .values();
            }
            return null;
          }
        });
  }

  //private int getIndex(String s)
  //{
  //  switch (s)
  //  {
  //    case "ALPHA_ABSOLUTE_FP1":
  //      return 0;
  //    case "ALPHA_ABSOLUTE_FP2":
  //      return 1;
  //    case "BETA_ABSOLUTE_FP1":
  //      return 2;
  //    case "BETA_ABSOLUTE_FP2":
  //      return 3;
  //    default:
  //      break;
  //  }
  //
  //  return 0;
  //}

  public static void main(String[] args) throws ParseException
  {
    try
    {
      TestIOTStreaming demo = new TestIOTStreaming("test");
      demo.pack();
      RefineryUtilities.centerFrameOnScreen(demo);
      demo.setVisible(true);
      demo.runSpark();
    }
    catch (InterruptedException e)
    {
      e.printStackTrace();
    }
  }
}
