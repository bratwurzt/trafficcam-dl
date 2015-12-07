package si.bleedy;

import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.StreamSupport;

import com.datastax.spark.connector.japi.CassandraJavaUtil;
import com.datastax.spark.connector.japi.CassandraRow;
import com.datastax.spark.connector.japi.rdd.CassandraTableScanJavaRDD;
import org.apache.spark.api.java.function.Function;
import si.bleedy.data.CounterData;
import si.bleedy.data.GpsPoint;
import eu.fistar.sdcs.runnable.CassandraReceiver;
import org.apache.log4j.Logger;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaReceiverInputDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.jfree.data.time.Minute;
import org.jfree.data.time.TimeSeries;
import org.jfree.data.time.TimeSeriesCollection;
import org.jfree.ui.ApplicationFrame;
import si.bleedy.data.ObservationData;

/**
 * @author bratwurzt
 */
public class TestSparkStreaming extends ApplicationFrame
{
  private static final Logger LOG = Logger.getLogger(TestSparkStreaming.class);

  public TestSparkStreaming(String name)
  {
    super(name);
    SparkConf conf = new SparkConf()
        .setAppName("heart")
        .set("spark.cassandra.connection.host", "192.168.1.2")
        .set("spark.cassandra.connection.port", "9042")
        .setMaster("local");

    // streaming
    JavaStreamingContext ssc = new JavaStreamingContext(conf, Durations.seconds(2));

    JavaReceiverInputDStream<Iterable<ObservationData>> cr = ssc.receiverStream(
        new CassandraReceiver(StorageLevel.MEMORY_ONLY(), ssc.sparkContext())
    );
    //cr.map(new Function<Iterable<ObservationData>, Iterable<ObservationData>>()
    //{
    //  @Override
    //  public Iterable<ObservationData> call(Iterable<ObservationData> v1) throws Exception
    //  {
    //    return null;
    //  }
    //}).print();
    cr.print();
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
