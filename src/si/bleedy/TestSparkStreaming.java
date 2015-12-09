package si.bleedy;

import com.datastax.spark.connector.japi.CassandraStreamingJavaUtil;
import eu.fistar.sdcs.runnable.IOTReceiver;
import org.apache.log4j.Logger;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaReceiverInputDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
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
        new IOTReceiver(StorageLevel.MEMORY_ONLY(), 8100)
    );
    CassandraStreamingJavaUtil.javaFunctions(ssc)
        .cassandraTable("zephyrkeyspace", "observations");
    ;

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
