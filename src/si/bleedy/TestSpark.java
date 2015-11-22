package si.bleedy;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import com.datastax.spark.connector.japi.CassandraJavaUtil;
import com.datastax.spark.connector.japi.CassandraRow;
import com.datastax.spark.connector.japi.rdd.CassandraTableScanJavaRDD;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.mllib.linalg.Vector;
import org.apache.spark.mllib.linalg.Vectors;
import org.apache.spark.mllib.stat.MultivariateStatisticalSummary;
import org.apache.spark.mllib.stat.Statistics;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaReceiverInputDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.jfree.data.time.Minute;
import org.jfree.data.time.Month;
import org.jfree.data.time.Second;
import org.jfree.data.time.TimeSeries;
import org.jfree.data.time.TimeSeriesCollection;
import org.jfree.data.time.TimeSeriesDataItem;
import org.jfree.data.xy.XYDataset;
import si.bleedy.data.CounterData;
import si.bleedy.runnable.CassandraReceiver;

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
        .where("timestamp > ?", ((System.currentTimeMillis() - 86400000 * 2) / 1000))
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

    TimeSeriesCollection timeseriescollection = new TimeSeriesCollection();
    final Map<String, List<double[]>> featureMap = new HashMap<>();
    for (Map.Entry<String, Iterable<CounterData>> entry : map.entrySet())
    {
      final List<TimeSeries> timeseries = new LinkedList<>();
      StreamSupport.stream(entry.getValue().spliterator(), false)
          .forEach(counterData -> {
            double[] doubles = counterData.toDoubleArray();
            for (int i = 0; i < doubles.length; i++)
            {
              if (i >= timeseries.size())
              {
                timeseries.add(new TimeSeries(entry.getKey() + "-" + (i + 1)));
              }
              timeseries.get(i).add(new Minute(new Date(counterData.getTimestamp())), doubles[i]);
            }
          });

      for (TimeSeries s : timeseries)
      {
        timeseriescollection.addSeries(s);
      }

      List<Vector> collect = StreamSupport.stream(entry.getValue().spliterator(), false)
          .map(CounterData::toDoubleArray)
          .map(Vectors::dense)
          .collect(Collectors.toList());

      MultivariateStatisticalSummary statisticalSummary = Statistics.colStats(sc.parallelize(collect).rdd());
      List<double[]> stats = new ArrayList<>();
      stats.add(statisticalSummary.mean().toArray());
      stats.add(statisticalSummary.variance().toArray());
      stats.add(statisticalSummary.min().toArray());
      stats.add(statisticalSummary.max().toArray());
      stats.add(statisticalSummary.normL1().toArray());
      featureMap.put(entry.getKey(), stats);
    }
    //System.out.println();

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
    //JavaStreamingContext ssc = new JavaStreamingContext(sc, Durations.minutes(30));
    //JavaReceiverInputDStream<Iterable<CounterData>> cr = ssc.receiverStream(
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
