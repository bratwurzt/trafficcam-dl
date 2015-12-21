package si.bleedy;

import java.awt.*;
import java.io.Serializable;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.function.Consumer;
import javax.swing.*;

import eu.fistar.sdcs.runnable.IOTTCPReceiver;
import org.apache.commons.math3.complex.Complex;
import org.apache.commons.math3.transform.DftNormalization;
import org.apache.commons.math3.transform.FastFourierTransformer;
import org.apache.commons.math3.transform.TransformType;
import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.function.FlatMapFunction;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.api.java.function.Function2;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.Time;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.apache.spark.streaming.mqtt.MQTTUtils;
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

/**
 * @author bratwurzt
 */
public class TestSparkStreaming extends ApplicationFrame implements Serializable
{
  private static final long serialVersionUID = -4289949126909167376L;
  private static final Logger LOG = Logger.getLogger(TestSparkStreaming.class);
  //private float m_vcc = 3.3f;
  //private float m_vcc = 5.0f, ganancia = 5.0f, RefTension = 2.98f, Ra = 2985.0f, Rc = 2995.0f, Rb = 698.0f;
  private float m_vcc = 5.0f, ganancia = 5.0f, RefTension = 2.98f, Ra = 4640.0f, Rc = 4719.0f, Rb = 698.0f;

  static
  {
    URL url = Thread.currentThread().getContextClassLoader().getResource("config/log4j.properties");
    PropertyConfigurator.configure(url);
  }

  /**
   * The number of subplots.
   */
  public static final int SUBPLOT_COUNT = 5;

  /**
   * The datasets.
   */
  public final TimeSeriesCollection[] datasets;

  /**
   * The most recent value added to series 1.
   */
  private final double[] lastValue;

  public TestSparkStreaming(String name)
  {
    super(name);
    lastValue = new double[SUBPLOT_COUNT];

    final CombinedDomainXYPlot plot = new CombinedDomainXYPlot(new DateAxis("Time"));
    this.datasets = new TimeSeriesCollection[SUBPLOT_COUNT];

    for (int i = 0; i < SUBPLOT_COUNT; i++)
    {
      this.lastValue[i] = 100.0;
      final TimeSeries series = new TimeSeries("rpi " + i/*, Millisecond.class*/);
      this.datasets[i] = new TimeSeriesCollection(series);
      final NumberAxis rangeAxis = new NumberAxis("Y" + i);
      rangeAxis.setAutoRangeIncludesZero(false);
      final XYPlot subplot = new XYPlot(
          this.datasets[i], null, rangeAxis, new StandardXYItemRenderer()
      );
      subplot.setBackgroundPaint(Color.lightGray);
      subplot.setDomainGridlinePaint(Color.white);
      subplot.setRangeGridlinePaint(Color.white);
      plot.add(subplot);
    }

    final JFreeChart chart = new JFreeChart("Spark stream demo", plot);
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

  private void runSpark()
  {
    SparkConf conf = new SparkConf()
        .setAppName("heart")
        .set("spark.cassandra.connection.host", "cassandra.marand.si")
        .set("spark.cassandra.connection.port", "9042")
        .setMaster("local[3]");
    // streaming
    JavaStreamingContext ssc = new JavaStreamingContext(conf, Durations.milliseconds(1000));

    JavaDStream<ObservationData> zephyrStream = ssc.receiverStream(
        new IOTTCPReceiver(StorageLevel.MEMORY_ONLY(), 8099)
    );

    final JavaDStream<ObservationData> mqttStream = MQTTUtils.createStream(ssc, "tcp://192.168.1.33:1883", "temp/gsr")
        .map(entry -> entry.split("\\|"))
        .flatMap((FlatMapFunction<String[], ObservationData>)strings -> {
          int tempAnalog = Integer.parseInt(strings[0]);
          int gsrAnalog = Integer.parseInt(strings[1]);
          long timestamp = Long.parseLong(strings[2]);
          return Arrays.asList(
              //computeConductance(gsrAnalog, timestamp),
              //computeTemperature(tempAnalog, timestamp)
              new ObservationData("temp", "mV", timestamp, getVoltage(tempAnalog)),
              new ObservationData("gsr", "mV", timestamp, getVoltage(gsrAnalog))
          );
        });
    //final FastFourierTransformer transformer = new FastFourierTransformer(DftNormalization.STANDARD);
    //JavaDStream<ObservationData> museStream = ssc.receiverStream(
    //    new IOTTCPReceiver(StorageLevel.MEMORY_ONLY(), 8100)
    //);
    //// compute Muse FP arousal and valence
    //JavaDStream<ObservationData> eegArousalAndValenceStream = getMuseArousalValenceDStream(museStream);

    mqttStream
        //.window(Durations.milliseconds(200), Durations.milliseconds(100))
        .transform(new Function2<JavaRDD<ObservationData>, Time, JavaRDD<ObservationData>>()  // mean over last 5 seconds
        {
          private static final long serialVersionUID = 5455964470681463716L;

          @Override
          public JavaRDD<ObservationData> call(JavaRDD<ObservationData> rdd, Time time) throws Exception
          {
            if (rdd != null && rdd.count() > 0)
            {
              return getRollingMeanJavaRDD(rdd);
            }
            return rdd;
          }
        })
        ;

    //filter Zephyr
    JavaDStream<ObservationData> union = zephyrStream
        .filter((Function<ObservationData, Boolean>)ObservationData::filterZephyr)
        .union(mqttStream)
        ;
    union.foreachRDD(new Function<JavaRDD<ObservationData>, Void>()
    {
      @Override
      public Void call(JavaRDD<ObservationData> rdd) throws Exception
      {
        if (rdd != null && rdd.count() > 0)
        {
          List<Tuple2<String, Iterable<ObservationData>>> collect = rdd
              .groupBy(ObservationData::getGrouping)
              .collect();

          for (Tuple2<String, Iterable<ObservationData>> t : collect)
          {
            t._2().forEach(new Consumer<ObservationData>()
            {
              @Override
              public void accept(ObservationData o)
              {
                int index = getIndex(t._1());
                if (index >= 0)
                {
                  try
                  {
                    lastValue[index] = o.getValue();
                    datasets[index].getSeries(0).add(new Millisecond(new Date(o.getTimestamp())), lastValue[index]);
                  }
                  catch (Exception e)
                  {
                    e.printStackTrace();
                  }
                }
              }
            });
          }
        }
        return null;
      }
    });
    //JavaDStream<ObservationData> zephyrStats = zephyrStream.filter(e -> "ecg".equals(e.getName()))
    //    .transform(rdd -> {
    //      try
    //      {
    //        if (rdd != null && rdd.count() > 0)
    //        {
    //          long count = rdd.count();
    //          long usable = rdd.filter(e -> e.getValue() < 1000).count();
    //          JavaRDD<Long> timestamps = rdd.map(ObservationData::getTimestamp).cache();
    //          long maxTimestamp = timestamps.max(Comparator.naturalOrder());
    //          return sc.parallelize(Arrays.asList(new ObservationData(
    //                  "ecg_samples",
    //                  "usable",
    //                  maxTimestamp,
    //                  usable
    //              ),
    //              new ObservationData(
    //                  "ecg_samples",
    //                  "count",
    //                  maxTimestamp,
    //                  count
    //              )));
    //        }
    //      }
    //      catch (Exception e)
    //      {
    //        e.printStackTrace();
    //      }
    //      return null;
    //    });

    // Onion of everything!
    //    JavaDStream<ObservationData> union = filteredZephyrStream
    //.union(museStream)
    //.union(eegArousalAndValenceStream)
    //.union(zephyrStats)
    ;
    //    CassandraStreamingJavaUtil.javaFunctions(union)
    //        .writerBuilder("obskeyspace", "observations", CassandraJavaUtil.mapToRow(ObservationData.class))
    //        .saveToCassandra();

    //    JavaDStream<ObservationData> windowDStream = cr.window(Durations.seconds(10), Durations.seconds(2));
    //    zephyrStream.mapToPair((PairFunction<ObservationData, String, ObservationData>)observationData -> new Tuple2<>(observationData.getGrouping(), observationData))
    //        .foreachRDD(obs -> {
    //          if (obs.count() > 0)
    //          {

    //            // Calculate statistics based on the content size.
    //            JavaRDD<Long> contentSizes = obs.map(ObservationData::getContentSize).cache();
    //            System.out.println(String.format("Content Size Avg: %s, Min: %s, Max: %s",
    //                contentSizes.reduce(SUM_REDUCER) / contentSizes.count(),
    //                contentSizes.min(Comparator.naturalOrder()),
    //                contentSizes.max(Comparator.naturalOrder())));
    //            // Any IPAddress that has accessed the server more than 10 times.
    //            List<String> ipAddresses =
    //                obs.mapToPair(log -> new Tuple2<>(log.getGrouping(), 1L))
    //                    .reduceByKey(SUM_REDUCER)
    //                    .filteredZephyrStream(tuple -> tuple._2() > 10)
    //                    .map(Tuple2::_1)
    //                    .take(100);
    //            System.out.println(String.format("groups > 10 times: %s", ipAddresses));
    //
    //            List<Tuple2<String, Long>> topEndpoints = obs
    //                .mapToPair(log -> new Tuple2<>(log.getGrouping(), 1L))
    //                .reduceByKey(SUM_REDUCER)
    //                .top(10, new ValueComparator<>(Comparator.<Long>naturalOrder()));
    //            System.out.println(String.format("Top groups: %s", topEndpoints));
    //          }
    //
    //          return null;
    //        });
    //    cr.foreachRDD(obs -> {
    //      if (obs.count() > 0)
    //      {
    //        obs.map(new Function<ObservationData, ObservationData>()
    //        {
    //          @Override
    //          public ObservationData call(ObservationData observationData) throws Exception
    //          {
    //            return null;
    //          }
    //        });
    //
    //
    //        // Calculate statistics based on the content size.
    //        JavaRDD<Long> contentSizes = obs.map(ObservationData::getContentSize).cache();
    //        System.out.println(String.format("Content Size Avg: %s, Min: %s, Max: %s",
    //            contentSizes.reduce(SUM_REDUCER) / contentSizes.count(),
    //            contentSizes.min(Comparator.naturalOrder()),
    //            contentSizes.max(Comparator.naturalOrder())));
    //        // Any IPAddress that has accessed the server more than 10 times.
    //        List<String> ipAddresses =
    //            obs.mapToPair(log -> new Tuple2<>(log.getGrouping(), 1L))
    //                .reduceByKey(SUM_REDUCER)
    //                .filteredZephyrStream(tuple -> tuple._2() > 10)
    //                .map(Tuple2::_1)
    //                .take(100);
    //        System.out.println(String.format("groups > 10 times: %s", ipAddresses));
    //
    //        List<Tuple2<String, Long>> topEndpoints = obs
    //            .mapToPair(log -> new Tuple2<>(log.getGrouping(), 1L))
    //            .reduceByKey(SUM_REDUCER)
    //            .top(10, new ValueComparator<>(Comparator.<Long>naturalOrder()));
    //        System.out.println(String.format("Top groups: %s", topEndpoints));
    //      }
    //
    //      return null;
    //    });
    ssc.start();
    ssc.awaitTermination();
  }

  private int getIndex(String name)
  {
    switch (name)
    {
      case "temp_mV":
        return 0;
      case "gsr_mV":
        return 1;
      case "acc_x":
        return 2;
      case "acc_y":
        return 3;
      case "acc_z":
        return 4;
      //case "ecg_mV":
      //  return 5;
      default:
        return -1;
    }
  }

  private JavaRDD<ObservationData> getRollingMeanJavaRDD(JavaRDD<ObservationData> rdd)
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
              Long maxTimestamp = 0L, minTimestamp = Long.MAX_VALUE;
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
                if (d.getTimestamp() < minTimestamp)
                {
                  minTimestamp = d.getTimestamp();
                }
              }
              avgValue /= size;
              return new ObservationData(
                  name1,
                  "",
                  (maxTimestamp + minTimestamp) / 2,
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
    double conductance = 2*((voltage - 0.497) / 100000);
    return new ObservationData("gsr", "resistance", timestamp, conductance);
  }

  private float getVoltage(int analogValue)
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
                fp1fp2AlphaBeta[getIndex(obs.getGrouping())] = obs.getValue();
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

  public static void main(String[] args)
  {
    TestSparkStreaming demo = new TestSparkStreaming("test");
    demo.pack();
    RefineryUtilities.centerFrameOnScreen(demo);
    demo.setVisible(true);
    demo.runSpark();
  }
}
