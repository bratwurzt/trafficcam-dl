package si.bleedy;

import org.apache.log4j.PropertyConfigurator;
import org.apache.spark.SparkConf;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaReceiverInputDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.apache.spark.streaming.flume.FlumeUtils;
import org.apache.spark.streaming.flume.SparkFlumeEvent;

import java.net.URL;

/**
 * @author bratwurzt
 */
public class TestSparkFlume
{
  static
  {
    URL url = Thread.currentThread().getContextClassLoader().getResource("log4j.properties");
    PropertyConfigurator.configure(url);
  }

  public static void main(String[] args)
  {
    SparkConf conf = new SparkConf()
        .setAppName("zephyr")
//        .set("spark.cassandra.connection.host", "cassandra.marand.si")
//        .set("spark.cassandra.connection.port", "9042")
        .setMaster("local[4]");

    // streaming
    JavaStreamingContext ssc = new JavaStreamingContext(conf, Durations.seconds(10));

    JavaReceiverInputDStream<SparkFlumeEvent> flumeStream = FlumeUtils.createStream(ssc, "localhost", 32123);

    flumeStream
        .map(e -> "Event:header:" + e.event().get(0).toString()
            + "body: " + new String(e.event().getBody().array()))
        .print();
    ssc.start();
    ssc.awaitTermination();

  }
}
