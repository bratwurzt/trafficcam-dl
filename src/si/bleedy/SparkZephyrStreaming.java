package si.bleedy;

import java.io.Serializable;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import javax.swing.*;

import org.apache.log4j.PropertyConfigurator;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.function.FlatMapFunction;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaReceiverInputDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.apache.spark.streaming.mqtt.MQTTUtils;
import com.datastax.spark.connector.japi.CassandraJavaUtil;
import com.datastax.spark.connector.japi.CassandraStreamingJavaUtil;

import eu.fistar.sdcs.runnable.IOTTCPReceiver;
import si.bleedy.data.ObservationData;

/**
 * @author bratwurzt
 */
public class SparkZephyrStreaming extends JPanel implements Serializable
{
  private static final long serialVersionUID = -4289949126909167376L;

  static
  {
    URL url = Thread.currentThread().getContextClassLoader().getResource("config/log4j.properties");
    PropertyConfigurator.configure(url);
  }

  public SparkZephyrStreaming()
  {
    SparkConf conf = new SparkConf()
        .setAppName("heart")
        .set("spark.cassandra.connection.host", "cassandra.marand.si")
        .set("spark.cassandra.connection.port", "9042")
        .setMaster("local[3]");

    // streaming
    JavaStreamingContext ssc = new JavaStreamingContext(conf, Durations.seconds(1));

    JavaReceiverInputDStream<String> stream = MQTTUtils.createStream(ssc, "tcp://10.99.9.25:1883", "temp/gsr");
    JavaDStream<ObservationData> mqttStream = stream.map(entry -> entry.split("\\|"))
        .flatMap((FlatMapFunction<String[], ObservationData>)strings -> {
          int tempAnalog = Integer.parseInt(strings[0]);
          int gsrAnalog = Integer.parseInt(strings[1]);
          long timestamp = Long.parseLong(strings[2]);
          return Arrays.asList(
              new ObservationData("gsr", "analog", timestamp, gsrAnalog),
              new ObservationData("temp", "analog", timestamp, tempAnalog)
          );
        });

//    mqttStream.foreachRDD(new Function<JavaRDD<ObservationData>, Void>()
//    {
//      @Override
//      public Void call(JavaRDD<ObservationData> rdd) throws Exception
//      {
//        List<ObservationData> collect = rdd.collect();
//        return null;
//      }
//    });
    JavaDStream<ObservationData> zephyrStream = ssc.receiverStream(
        new IOTTCPReceiver(StorageLevel.MEMORY_ONLY(), 8099)
    );
    // filter Zephyr ecg
    JavaDStream<ObservationData> filteredZephyrStream = zephyrStream
        .filter((Function<ObservationData, Boolean>)ObservationData::filterZephyr);

//    zephyrStream.filter(e -> "ecg".equals(e.getName()))
//        .foreachRDD((Function2<JavaRDD<ObservationData>, Time, Void>)(rdd, time) -> {
//          if (rdd.count() > 0)
//          {
//            long count = rdd.count();
//            // Calculate statistics based on the content size.
//            long usable = rdd.filter(e -> e.getValue() < 1000).count();
//            long unusable = count - usable;
//            System.out.println(String.format("Number of ecg samples in 1 second: All: %s Usable: %s, Unusable: %s", count, usable, unusable));
//          }
//          return null;
//        });

    // Onion of everything!
    JavaDStream<ObservationData> union = filteredZephyrStream
        .union(mqttStream)
        ;
    CassandraStreamingJavaUtil.javaFunctions(union)
        .writerBuilder("obskeyspace", "observations", CassandraJavaUtil.mapToRow(ObservationData.class))
        .saveToCassandra();

    ssc.start();
    ssc.awaitTermination();
  }

  public static void main(String[] args)
  {
    SparkZephyrStreaming demo = new SparkZephyrStreaming();
  }
}
