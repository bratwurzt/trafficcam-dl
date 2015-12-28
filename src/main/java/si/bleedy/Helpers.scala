package si.bleedy

import com.datastax.spark.connector.japi.rdd.CassandraTableScanJavaRDD
import org.apache.spark.api.java.JavaRDD
import org.apache.spark.streaming.api.java.{JavaDStream, JavaStreamingContext}
import org.apache.spark.streaming.dstream.ConstantInputDStream
import com.datastax.spark.connector.streaming._
import si.bleedy.data.ObservationData

object Helpers {

  def createJavaDStream(jssc: JavaStreamingContext, pair: JavaRDD[ObservationData]) = {
    new JavaDStream(new ConstantInputDStream(jssc.ssc, pair.rdd))
  }
}