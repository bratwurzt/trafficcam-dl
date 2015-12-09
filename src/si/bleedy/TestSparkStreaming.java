package si.bleedy;

import java.io.Serializable;
import java.net.URL;
import java.util.Comparator;

import org.apache.log4j.PropertyConfigurator;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.function.Function2;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.Durations;
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
  static
  {
    URL url = Thread.currentThread().getContextClassLoader().getResource("config/log4j.properties");
    PropertyConfigurator.configure(url);
  }

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
        .setMaster("local[2]");

    // streaming
    JavaStreamingContext ssc = new JavaStreamingContext(conf, Durations.seconds(2));

    JavaDStream<ObservationData> cr = ssc.receiverStream(
        new IOTReceiver(StorageLevel.MEMORY_ONLY(), 8099)
    );

    CassandraStreamingJavaUtil.javaFunctions(cr)
        .writerBuilder("obskeyspace", "observations", CassandraJavaUtil.mapToRow(ObservationData.class))
        .saveToCassandra();

//    JavaDStream<ObservationData> windowDStream = cr.window(Durations.seconds(10), Durations.seconds(5));
//    cr.foreachRDD(obs -> {
//
//      if (obs.count() > 0)
//      {
//
////          LOG.warn("Not working?");
////          // Calculate statistics based on the content size.
////          JavaRDD<Long> contentSizes = obs.map(ObservationData::getContentSize).cache();
////          LOG.warn(String.format("Content Size Avg: %s, Min: %s, Max: %s",
////              contentSizes.reduce(SUM_REDUCER) / contentSizes.count(),
////              contentSizes.min(Comparator.naturalOrder()),
////              contentSizes.max(Comparator.naturalOrder())));
////          // Any IPAddress that has accessed the server more than 10 times.
////          List<String> ipAddresses =
////              obs.mapToPair(log -> new Tuple2<>(log.getGrouping(), 1L))
////                  .reduceByKey(SUM_REDUCER)
////                  .filter(tuple -> tuple._2() > 10)
////                  .map(Tuple2::_1)
////                  .take(100);
////          LOG.warn(String.format("groups > 10 times: %s", ipAddresses));
//
//        // Top Endpoints.
////          List<Tuple2<String, Long>> topEndpoints = obs
////              .mapToPair(log -> new Tuple2<>(log.getGrouping(), 1L))
////              .reduceByKey(SUM_REDUCER)
////              .top(10, new ValueComparator<>(Comparator.<Long>naturalOrder()));
////          LOG.warn(String.format("Top groups: %s", topEndpoints));
//
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
