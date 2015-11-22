package si.bleedy;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import com.datastax.spark.connector.japi.CassandraJavaUtil;
import com.datastax.spark.connector.japi.CassandraRow;
import com.datastax.spark.connector.japi.rdd.CassandraTableScanJavaRDD;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.api.java.function.PairFunction;
import org.apache.spark.mllib.linalg.Vector;
import org.apache.spark.mllib.linalg.Vectors;
import org.apache.spark.mllib.regression.LabeledPoint;
import org.apache.spark.mllib.stat.MultivariateStatisticalSummary;
import org.apache.spark.mllib.stat.Statistics;
import scala.Tuple2;
import si.bleedy.data.CounterData;

/**
 * @author bratwurzt
 */
public class TestSpark
{
  public TestSpark()
  {
    SparkConf conf = new SparkConf()
        .setAppName("activityRecognition")
        .set("spark.cassandra.connection.host", "127.0.0.1")
        .set("spark.cassandra.connection.port", "9042")
        .setMaster("local");
    final JavaSparkContext sc = new JavaSparkContext(conf);
    CassandraTableScanJavaRDD<CassandraRow> cassandraRowsRDD = CassandraJavaUtil.javaFunctions(sc)
        .cassandraTable("counterkeyspace", "counter_timeline");
    Map<String, Iterable<CounterData>> map = cassandraRowsRDD
        .where("timestamp > ?", ((System.currentTimeMillis() - 86400000) / 1000))
        .map(CassandraRow::toMap)
        .map(entry -> new CounterData(
            (String)entry.get("counter_id"),
            (long)entry.get("timestamp"),
            (float)entry.get("avg_sec_gap"),
            (int)entry.get("speed"),
            (int)entry.get("cars_per_sec"),
            (float)entry.get("utilization")))
        .groupBy(CounterData::getId)
        .collectAsMap();

    for (Map.Entry<String, Iterable<CounterData>> entry : map.entrySet())
    {
      List<Vector> collect = StreamSupport.stream(entry.getValue().spliterator(), false)
          .map(CounterData::toDoubleArray)
          .map(Vectors::dense)
          .collect(Collectors.toList());
      MultivariateStatisticalSummary statisticalSummary = Statistics.colStats(sc.parallelize(collect).rdd());
      double[] mean = statisticalSummary.mean().toArray();
      double[] variance = statisticalSummary.variance().toArray();
    }

    // cassandraRowsRDD.sortByKey().collectAsMap();

    //JavaRDD<Vector> map = cassandraRowsRDD
    //    .where("timestamp > ?", ((System.currentTimeMillis() - 86400000) / 1000))
    //    .map(CassandraRow::toMap)
    //    .map(entry -> new double[]{
    //        (float)entry.get("avg_sec_gap"),
    //        (int)entry.get("speed"),
    //        (int)entry.get("cars_per_sec"),
    //        (float)entry.get("utilization")})
    //    .map(Vectors::dense);
    //
    //MultivariateStatisticalSummary statisticalSummary = Statistics.colStats(map.rdd());
    //double[] mean = statisticalSummary.mean().toArray();
    //double[] variance = statisticalSummary.variance().toArray();
    //LabeledPoint labeledPoint = new LabeledPoint("1day", Vectors.dense());

    // streaming
    //JavaStreamingContext ssc = new JavaStreamingContext(sc, Durations.minutes(60));
    //JavaReceiverInputDStream<String> cr = ssc.receiverStream(
    //    new CassandraReceiver(StorageLevel.MEMORY_ONLY(), ssc.sparkContext())
    //);
    //cr.print();
    //ssc.start();
    //ssc.awaitTermination();
    System.out.println();
  }

  public static void main(String[] args)
  {
    new TestSpark();
  }
}
