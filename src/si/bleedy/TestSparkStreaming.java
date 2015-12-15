package si.bleedy;

import java.io.Serializable;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JPanel;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.api.java.function.Function2;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.Time;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import com.datastax.spark.connector.japi.CassandraJavaUtil;
import com.datastax.spark.connector.japi.CassandraStreamingJavaUtil;
import com.google.common.collect.Iterables;

import eu.fistar.sdcs.runnable.IOTTCPReceiver;
import si.bleedy.data.ObservationData;

/**
 * @author bratwurzt
 */
public class TestSparkStreaming extends JPanel implements Serializable
{
  private static final long serialVersionUID = -4289949126909167376L;
  private static final Logger LOG = Logger.getLogger(TestSparkStreaming.class);

  static
  {
    URL url = Thread.currentThread().getContextClassLoader().getResource("config/log4j.properties");
    PropertyConfigurator.configure(url);
  }

  //private final DynamicTimeSeriesCollection dataset;
  //private final JFreeChart chart;

  public TestSparkStreaming(String name)
  {
    //dataset = new DynamicTimeSeriesCollection(4, 60, new Second());
    //dataset.setTimeBase(new Second(new Date()));
    //dataset.addSeries(new float[1], 0, "FP1_ALPHA");
    //dataset.addSeries(new float[1], 1, "FP2_ALPHA");
    //dataset.addSeries(new float[1], 2, "FP1_BETA");
    //dataset.addSeries(new float[1], 3, "FP2_BETA");
    //chart = ChartFactory.createTimeSeriesChart(name, "Time", name, dataset, true, true, false);
    //XYPlot plot = chart.getXYPlot();
    //DateAxis axis = (DateAxis)plot.getDomainAxis();
    //axis.setFixedAutoRange(10000);
    //axis.setDateFormatOverride(new SimpleDateFormat("ss.SS"));
    //final ChartPanel chartPanel = new ChartPanel(chart);
    //add(chartPanel);
    //
    //JFrame frame = new JFrame("testing");
    //frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
    //frame.add(this);
    //frame.pack();
    //frame.setVisible(true);

    SparkConf conf = new SparkConf()
        .setAppName("heart")
        .set("spark.cassandra.connection.host", "cassandra.marand.si")
        .set("spark.cassandra.connection.port", "9042")
        .setMaster("local[3]");
    // streaming
    JavaStreamingContext ssc = new JavaStreamingContext(conf, Durations.seconds(1));

    JavaDStream<ObservationData> zephyrStream = ssc.receiverStream(
        new IOTTCPReceiver(StorageLevel.MEMORY_ONLY(), 8099)
    );

    //JavaDStream<ObservationData> museStream = ssc.receiverStream(
    //    new IOTTCPReceiver(StorageLevel.MEMORY_ONLY(), 8100)
    //);
    //// compute Muse FP arousal and valence
    //JavaDStream<ObservationData> eegArousalAndValenceStream = getMuseArousalValenceDStream(museStream);

    // filter Zephyr ecg
    JavaDStream<ObservationData> filteredZephyrStream = zephyrStream
        .filter((Function<ObservationData, Boolean>)ObservationData::filterZephyr);

    //zephyrStream.foreachRDD(new Function<JavaRDD<ObservationData>, Void>()
    //    {
    //      @Override
    //      public Void call(JavaRDD<ObservationData> rdd) throws Exception
    //      {
    //        if (rdd.count() > 0)
    //        {
    //          List<Tuple2<String, Iterable<ObservationData>>> collect = rdd
    //              .groupBy(ObservationData::getGrouping)
    //              .collect();
    //
    //          for (Tuple2<String, Iterable<ObservationData>> t : collect)
    //          {
    //            t._2().forEach(new Consumer<ObservationData>()
    //            {
    //              int i = 0;
    //              @Override
    //              public void accept(ObservationData o)
    //              {
    //                dataset.addValue(getSeriesNumber(t._1()), i++, (float)o.getValue());
    //              }
    //            });
    //          }
    //          dataset.advanceTime();
    //        }
    //        return null;
    //      }
    //    });

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
    JavaDStream<ObservationData> union = filteredZephyrStream
        //.union(museStream)
        //.union(eegArousalAndValenceStream)
        //.union(zephyrStats)
        ;
    CassandraStreamingJavaUtil.javaFunctions(union)
        .writerBuilder("obskeyspace", "observations", CassandraJavaUtil.mapToRow(ObservationData.class))
        .saveToCassandra();

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

  private int getIndex(String s)
  {
    switch (s)
    {
      case "ALPHA_ABSOLUTE_FP1":
        return 0;
      case "ALPHA_ABSOLUTE_FP2":
        return 1;
      case "BETA_ABSOLUTE_FP1":
        return 2;
      case "BETA_ABSOLUTE_FP2":
        return 3;
      default:
        break;
    }

    return 0;
  }

  public static void main(String[] args)
  {
    TestSparkStreaming demo = new TestSparkStreaming("test");
  }
}
