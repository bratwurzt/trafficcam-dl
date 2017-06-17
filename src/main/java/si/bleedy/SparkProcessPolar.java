package si.bleedy;

import org.apache.spark.SparkConf;

/**
 * @author bratwurzt
 */
public class SparkProcessPolar
{
  public SparkProcessPolar()
  {
    final SparkConf conf = new SparkConf()
        .setAppName("polar")
        .set("spark.cassandra.connection.host", "192.168.1.2")
        .set("spark.cassandra.connection.port", "9042")
        .set("spark.cassandra.connection.keep_alive_ms", "20000")
        .setMaster("local[6]");

    

  }
}
