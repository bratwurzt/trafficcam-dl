package eu.fistar.sdcs.runnable;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import com.datastax.spark.connector.japi.CassandraJavaUtil;
import com.datastax.spark.connector.japi.CassandraRow;
import com.datastax.spark.connector.japi.rdd.CassandraTableScanJavaRDD;
import org.apache.spark.api.java.JavaSparkContext;
import scala.Tuple2;
import si.bleedy.data.CounterData;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.receiver.Receiver;
import si.bleedy.data.ObservationData;

/**
 * @author bratwurzt
 */
public class CassandraReceiver extends Receiver<Iterable<ObservationData>> implements Serializable
{
  private static final long serialVersionUID = 1840376582814772051L;
  final JavaSparkContext m_sparkContext;

  public CassandraReceiver(StorageLevel storageLevel, JavaSparkContext sc)
  {
    super(storageLevel);
    m_sparkContext = sc;
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
    CassandraTableScanJavaRDD<CassandraRow> cassandraRowsRDD = CassandraJavaUtil.javaFunctions(m_sparkContext)
        .cassandraTable("zephyrkeyspace", "observations");
    List<ObservationData> list = cassandraRowsRDD
        .where("timestamp > ?", System.currentTimeMillis() - 2000)
        .map(CassandraRow::toMap)
        .map(entry -> new ObservationData(
            (String)entry.get("name"),
            (String)entry.get("unit"),
            (long)entry.get("timestamp"),
            (String)entry.get("value")))
        .filter(ObservationData::filter)
        .collect();

    store(list);
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
