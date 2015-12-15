package si.bleedy;

import java.io.Serializable;
import java.net.URL;
import java.util.concurrent.ConcurrentLinkedDeque;

import org.apache.log4j.PropertyConfigurator;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.function.VoidFunction;
import org.apache.spark.rdd.RDD;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.StreamingContext;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.apache.spark.streaming.dstream.ConstantInputDStream;
import com.datastax.spark.connector.japi.CassandraRow;
import com.datastax.spark.connector.japi.CassandraStreamingJavaUtil;

import scala.runtime.AbstractFunction1;
import scala.runtime.BoxedUnit;
import si.bleedy.data.ObservationData;

/**
 * @author bratwurzt
 */
public class SparkStreamingFromCassandra implements Serializable
{
  private static final long serialVersionUID = -4289949126909167376L;

  static
  {
    URL url = Thread.currentThread().getContextClassLoader().getResource("config/log4j.properties");
    PropertyConfigurator.configure(url);
  }


  public SparkStreamingFromCassandra(String name)
  {
    SparkConf conf = new SparkConf()
        .setAppName("heart")
        .set("spark.cassandra.connection.host", "cassandra.marand.si")
        .set("spark.cassandra.connection.port", "9042")
        .setMaster("local[3]");

    // streaming
    JavaStreamingContext ssc = new JavaStreamingContext(conf, Durations.seconds(5));

    JavaRDD<ObservationData> javaRDD = CassandraStreamingJavaUtil.javaFunctions(ssc)
        .cassandraTable("obskeyspace", "observations")
        .select("value")
        .where("name in (?,?,?)", "ecg", "r to r", "respiration rate")
//        .where("name = ?", "ecg")
        .map(CassandraRow::toMap)
        .map(entry -> new ObservationData(
            (String)entry.get("name"),
            (String)entry.get("unit"),
            (long)entry.get("timestamp"),
            (String)entry.get("value")))
        ;
//    ConcurrentLinkedDeque<JavaRDD<ObservationData>> queue = new ConcurrentLinkedDeque<>();
//    JavaDStream<ObservationData> dStream = ssc.queueStream(queue);

//    StreamingContext ssc1 = ssc.ssc();
//    RDD<ObservationData> rdd = javaRDD.rdd();
//    ConstantInputDStream<ObservationData> inputDStream = new ConstantInputDStream(ssc1, rdd,  new scala.reflect.ClassTag<ObservationData>());
//    inputDStream.window(Durations.seconds(5), Durations.seconds(1))
//        .foreachRDD(new AbstractFunction1<RDD<ObservationData>, BoxedUnit>()
//        {
//          @Override
//          public BoxedUnit apply(RDD<ObservationData> v1)
//          {
//            return null;
//          }
//        });

    ssc.start();
    ssc.awaitTermination();
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
    SparkStreamingFromCassandra demo = new SparkStreamingFromCassandra("test");
  }
}
