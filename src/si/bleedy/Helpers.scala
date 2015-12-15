package si.bleedy

import org.apache.spark.api.java.JavaRDD
import org.apache.spark.streaming.api.java.{JavaDStream, JavaStreamingContext}
import org.apache.spark.streaming.dstream.ConstantInputDStream
import si.bleedy.data.ObservationData

object Helpers {

  def createJavaDStream(jssc: JavaStreamingContext, pair: JavaRDD[ObservationData]) = {
    new JavaDStream(new ConstantInputDStream(jssc.ssc, pair.rdd))
  }
}