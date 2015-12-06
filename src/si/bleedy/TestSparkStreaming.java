package si.bleedy;

import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.StreamSupport;

import com.datastax.spark.connector.japi.CassandraJavaUtil;
import com.datastax.spark.connector.japi.CassandraRow;
import com.datastax.spark.connector.japi.rdd.CassandraTableScanJavaRDD;
import si.bleedy.data.CounterData;
import si.bleedy.data.GpsPoint;
import eu.fistar.sdcs.runnable.CassandraReceiver;
import org.apache.log4j.Logger;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaReceiverInputDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.jfree.data.time.Minute;
import org.jfree.data.time.TimeSeries;
import org.jfree.data.time.TimeSeriesCollection;
import org.jfree.ui.ApplicationFrame;

/**
 * @author bratwurzt
 */
public class TestSparkStreaming extends ApplicationFrame
{
  private static final Logger LOG = Logger.getLogger(TestSparkStreaming.class);

  public TestSparkStreaming(String name)
  {
    super(name);
    SparkConf conf = new SparkConf()
        .setAppName("activityRecognition")
        .set("spark.cassandra.connection.host", "127.0.0.1")
        .set("spark.cassandra.connection.port", "9042")
        .setMaster("local");
    final JavaSparkContext sc = new JavaSparkContext(conf);
    //CassandraTableScanJavaRDD<CassandraRow> cassandraRowsRDD = CassandraJavaUtil.javaFunctions(sc)
    //    .cassandraTable("counterkeyspace", "counter_timeline");
    //Map<String, Iterable<CounterData>> map = cassandraRowsRDD
    //    .where("timestamp > ?", ((System.currentTimeMillis() - 48 * 60 * 60 * 1000) / 1000))
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
    //GpsPoint ljPoint = new GpsPoint(46.05223f, 14.50567f);
    //TimeSeriesCollection dataset = new TimeSeriesCollection();
    //final Map<String, List<double[]>> featureMap = new HashMap<>();
    //for (Map.Entry<String, Iterable<CounterData>> entry : map.entrySet())
    //{
    //  final List<TimeSeries> timeseries = new LinkedList<>();
    //  StreamSupport.stream(entry.getValue().spliterator(), false)
    //      .filter(p -> ljPoint.isInRadius(p.getGps(), 7f))
    //      .filter(p -> p.isHighway())
    //      .forEach(counterData -> {
    //        double[] doubles = counterData.toDoubleArray();
    //        for (int i = 0; i < doubles.length; i++)
    //        {
    //          if (i >= timeseries.size())
    //          {
    //            timeseries.add(new TimeSeries(entry.getKey() + "-" + (i + 1)));
    //          }
    //          timeseries.get(i).add(new Minute(new Date(counterData.getTimestamp())), doubles[i]);
    //        }
    //      });
    //}

    // streaming
    JavaStreamingContext ssc = new JavaStreamingContext(sc, Durations.seconds(2));
    JavaReceiverInputDStream<Iterable<CounterData>> cr = ssc.receiverStream(
        new CassandraReceiver(StorageLevel.MEMORY_ONLY())
    );
    cr.print();
    ssc.start();
    ssc.awaitTermination();
  }

  public static void main(String[] args)
  {
    TestSparkStreaming demo = new TestSparkStreaming("test");
    demo.pack();
    demo.setVisible(true);
  }
}
