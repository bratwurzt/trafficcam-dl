package si.bleedy

import java.text.SimpleDateFormat

import com.datastax.spark.connector.streaming._
import org.apache.spark.SparkConf
import org.apache.spark.streaming.{Seconds, StreamingContext}

/**
  * @author DusanM
  */
class TestSparkFromCassandraStreaming {

  def
  main(args: Array[String]): Unit = {
    val conf = new SparkConf(true)
      .set("spark.cassandra.connection.host", "cassandra.marand.si")
      .set("spark.cassandra.connection.port", "9042")
    val ssc = new StreamingContext(conf, Seconds(1))
    val dateFormat: SimpleDateFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm")
    val startTime: Long = dateFormat.parse("15.12.2015 20:28").getTime
    val rdd = ssc.cassandraTable("obskeyspace", "observations").where("timestamp > ?", startTime)

  }


}
