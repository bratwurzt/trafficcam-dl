package si.bleedy;

import java.io.Serializable;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

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
import com.datastax.spark.connector.japi.CassandraRow;
import com.datastax.spark.connector.japi.CassandraStreamingJavaUtil;

import si.bleedy.data.ObservationData;
import si.bleedy.runnable.IOTTCPReceiver;

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
    JavaStreamingContext ssc = new JavaStreamingContext(conf, Durations.seconds(1));

    JavaDStream<ObservationData> zephyrStream = ssc.receiverStream(
        new IOTTCPReceiver(StorageLevel.MEMORY_ONLY(), 8099)
    )
        .filter((Function<ObservationData, Boolean>)ObservationData::filterZephyr);

    CassandraStreamingJavaUtil.javaFunctions(zephyrStream)
        .writerBuilder("obskeyspace", "observations", CassandraJavaUtil.mapToRow(ObservationData.class))
        .saveToCassandra();

//    JavaDStream<ObservationData> cassStream = ssc.receiverStream(
//        new IOTTCPReceiver(StorageLevel.MEMORY_ONLY(), 8111)
//    );

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
