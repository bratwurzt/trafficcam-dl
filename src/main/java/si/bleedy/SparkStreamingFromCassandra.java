package si.bleedy;

import java.io.Serializable;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import si.bleedy.data.StreamContextWrapper;
import si.bleedy.runnable.CassandraReceiver;
import org.apache.log4j.PropertyConfigurator;
import org.apache.spark.SparkConf;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.Duration;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;

import si.bleedy.data.ObservationData;

/**
 * @author bratwurzt
 */
public class SparkStreamingFromCassandra implements Serializable
{
  private static final long serialVersionUID = -4289949126909167376L;
  private SimpleDateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm");

  static
  {
    URL url = Thread.currentThread().getContextClassLoader().getResource("config/log4j.properties");
    PropertyConfigurator.configure(url);
  }

  public SparkStreamingFromCassandra() throws ParseException
  {
    SparkConf conf = new SparkConf()
        .setAppName("heart")
        .set("spark.cassandra.connection.host", "cassandra.marand.si")
        .set("spark.cassandra.connection.port", "9042")
        .setMaster("local[2]");

    // streaming
    Duration batchDuration = Durations.seconds(1);
    JavaStreamingContext ssc = new JavaStreamingContext(conf, batchDuration);

    CassandraReceiver receiver = new CassandraReceiver(
        StorageLevel.MEMORY_ONLY(),
        "17.12.2015 20:28",
        "16.12.2015 04:01",
        batchDuration,
        30000
    );
    JavaDStream<ObservationData> cassStream = ssc.receiverStream(receiver);

    ssc.start();
    ssc.awaitTermination();
  }

  public static void main(String[] args)
  {
    try
    {
      SparkStreamingFromCassandra demo = new SparkStreamingFromCassandra();
    }
    catch (ParseException e)
    {
      e.printStackTrace();
    }
  }
}
