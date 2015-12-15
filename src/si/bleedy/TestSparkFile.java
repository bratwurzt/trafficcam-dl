package si.bleedy;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.function.Function;

import com.google.common.collect.Lists;

import si.bleedy.data.polis.KriminalnoDejanje;

/**
 * @author DusanM
 */
public class TestSparkFile implements Serializable
{
  private static final long serialVersionUID = -7190128924717321110L;

  public TestSparkFile()
  {
    SparkConf conf = new SparkConf()
        .setAppName("police")
        .set("spark.cassandra.connection.host", "10.99.11.148")
        .set("spark.cassandra.connection.port", "9042")
//        .setMaster("spark://10.99.11.148:7077")
        .setMaster("local[3]")
        ;

    final JavaSparkContext sc = new JavaSparkContext(conf);
    JavaRDD<String> dogodki = sc.textFile("H:\\Temp\\polis statistika\\kd2014\\DOGODKI.TXT");
    JavaRDD<String> osebe = sc.textFile("H:\\Temp\\polis statistika\\kd2014\\OSEBE.TXT");
    JavaRDD<String> sifranti = sc.textFile("H:\\Temp\\polis statistika\\kd2014\\SIFRANTI.TXT");

    JavaRDD<KriminalnoDejanje> map = dogodki
        .map((Function<String, Iterable<String>>)string -> Arrays.stream(string.split("\\$")).map(String::trim).collect(Collectors.toList()))
        .map(e -> new KriminalnoDejanje(Lists.newArrayList(e)));
    List<KriminalnoDejanje> collect = map.collect();
    System.out.println();
  }

  public static void main(String[] args)
  {
    new TestSparkFile();
  }
}
