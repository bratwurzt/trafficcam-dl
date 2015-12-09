package si.bleedy;

import java.io.Serializable;
import java.util.Comparator;
import java.util.List;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.api.java.function.Function2;
import org.apache.spark.api.java.function.PairFunction;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.Time;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.jfree.ui.ApplicationFrame;

import com.datastax.spark.connector.japi.CassandraJavaUtil;
import com.datastax.spark.connector.japi.CassandraStreamingJavaUtil;

import eu.fistar.sdcs.runnable.IOTReceiver;
import scala.Tuple2;
import si.bleedy.data.ObservationData;


/**
 * @author bratwurzt
 */
public class TestSparkStreaming extends ApplicationFrame
{
//  static
//  {
//    URL url = Thread.currentThread().getContextClassLoader().getResource("config/log4j.properties");
//    PropertyConfigurator.configure(url);
//  }

  private static Function2<Long, Long, Long> SUM_REDUCER = (a, b) -> a + b;

  private static class ValueComparator<K, V> implements Comparator<Tuple2<K, V>>, Serializable
  {
    private Comparator<V> comparator;

    public ValueComparator(Comparator<V> comparator)
    {
      this.comparator = comparator;
    }

    @Override
    public int compare(Tuple2<K, V> o1, Tuple2<K, V> o2)
    {
      return comparator.compare(o1._2(), o2._2());
    }
  }

  public TestSparkStreaming(String name)
  {
    super(name);
    SparkConf conf = new SparkConf()
        .setAppName("heart")
        .set("spark.cassandra.connection.host", "cassandra.marand.si")
        .set("spark.cassandra.connection.port", "9042")
        .setMaster("local[3]");

    // streaming
    JavaStreamingContext ssc = new JavaStreamingContext(conf, Durations.seconds(2));

    JavaDStream<ObservationData> zephyrStream = ssc.receiverStream(
        new IOTReceiver(StorageLevel.MEMORY_ONLY(), 8099)
    );
    JavaDStream<ObservationData> museStream = ssc.receiverStream(
        new IOTReceiver(StorageLevel.MEMORY_ONLY(), 8100)
    );

    JavaDStream<ObservationData> filter = zephyrStream.filter((Function<ObservationData, Boolean>)ObservationData::filter);
    filter.foreachRDD(new Function2<JavaRDD<ObservationData>, Time, Void>()
    {
      @Override
      public Void call(JavaRDD<ObservationData> observationDataJavaRDD, Time time) throws Exception
      {
        System.out.println("LALALALALALALALALALALA " + observationDataJavaRDD.count());
        return null;
      }
    });
    JavaDStream<ObservationData> union = filter.union(museStream);
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
//                    .filter(tuple -> tuple._2() > 10)
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
//                .filter(tuple -> tuple._2() > 10)
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

  public static void main(String[] args)
  {
    TestSparkStreaming demo = new TestSparkStreaming("test");
    demo.pack();
    demo.setVisible(true);
  }
}
