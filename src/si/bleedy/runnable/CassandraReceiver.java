package si.bleedy.runnable;

import java.io.Serializable;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import com.datastax.spark.connector.japi.CassandraJavaUtil;
import com.datastax.spark.connector.japi.CassandraRow;
import com.datastax.spark.connector.japi.rdd.CassandraTableScanJavaRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.mllib.linalg.Vector;
import org.apache.spark.mllib.linalg.Vectors;
import org.apache.spark.mllib.stat.MultivariateStatisticalSummary;
import org.apache.spark.mllib.stat.Statistics;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.receiver.Receiver;
import si.bleedy.data.CounterData;

/**
 * @author bratwurzt
 */
public class CassandraReceiver extends Receiver<Iterable<CounterData>> implements Serializable
{
  private static final long serialVersionUID = 1840376582814772051L;
  private JavaSparkContext m_javaSparkContext;

  public CassandraReceiver(StorageLevel storageLevel, JavaSparkContext javaSparkContext)
  {
    super(storageLevel);
    m_javaSparkContext = javaSparkContext;
  }

  @Override
  public void onStart()
  {
    new Thread()
    {
      @Override
      public void run()
      {
        receive();
      }
    }.start();
  }

  private void receive()
  {
    CassandraTableScanJavaRDD<CassandraRow> cassandraRowsRDD = CassandraJavaUtil.javaFunctions(m_javaSparkContext)
        .cassandraTable("counterkeyspace", "counter_timeline");

    Map<String, Iterable<CounterData>> map = cassandraRowsRDD
        //.where("timestamp > ?", ((System.currentTimeMillis() - 86400000) / 1000))
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
    //store()
    //for (Map.Entry<String, Iterable<CounterData>> entry : map.entrySet())
    //{
    //  List<Vector> collect = StreamSupport.stream(entry.getValue().spliterator(), false)
    //      .map(CounterData::toDoubleArray)
    //      .map(Vectors::dense)
    //      .collect(Collectors.toList());
    //  MultivariateStatisticalSummary statisticalSummary = Statistics.colStats(m_javaSparkContext.parallelize(collect).rdd());
    //  double[] mean = statisticalSummary.mean().toArray();
    //  double[] variance = statisticalSummary.variance().toArray();
    //}
    //    JavaRDD<Long> cache = cassandraRowsRDD.map(CassandraRow::toMap)
    //        .groupBy()
    //        .cache();

    //JavaRDD<CounterData> cache1 = cassandraRowsRDD
    //    .map(CassandraRow::toMap)
    //    .map(entry -> new CounterData(
    //        (String)entry.get("counter_id"),
    //        (long)entry.get("timestamp"),
    //        (float)entry.get("avg_sec_gap"),
    //        (int)entry.get("speed"),
    //        (int)entry.get("cars_per_sec"),
    //        (float)entry.get("utilization")))
    //    .cache();
    System.out.println();
  }

  @Override
  public void onStop()
  {

  }
}
