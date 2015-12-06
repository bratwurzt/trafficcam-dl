package eu.fistar.sdcs.runnable;

import java.io.Serializable;

import si.bleedy.data.CounterData;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.receiver.Receiver;

/**
 * @author bratwurzt
 */
public class CassandraReceiver extends Receiver<Iterable<CounterData>> implements Serializable
{
  private static final long serialVersionUID = 1840376582814772051L;

  public CassandraReceiver(StorageLevel storageLevel)
  {
    super(storageLevel);
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
    //CassandraTableScanJavaRDD<CassandraRow> cassandraRowsRDD = CassandraJavaUtil.javaFunctions(m_javaSparkContext)
    //    .cassandraTable("counterkeyspace", "counter_timeline");
    //
    //Map<String, Iterable<CounterData>> map = cassandraRowsRDD
    //    //.where("timestamp > ?", ((System.currentTimeMillis() - 86400000) / 1000))
    //    .map(CassandraRow::toMap)
    //    .map(entry -> new CounterData(
    //        (String)entry.get("counter_id"),
    //        (long)entry.get("timestamp"),
    //        (float)entry.get("avg_sec_gap"),
    //        (int)entry.get("speed"),
    //        (int)entry.get("cars_per_sec"),
    //        (float)entry.get("utilization")))
    //    .groupBy(CounterData::getId)
    //    .collectAsMap();
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
