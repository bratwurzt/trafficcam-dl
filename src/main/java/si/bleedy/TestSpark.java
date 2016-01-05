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
import org.apache.log4j.Logger;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaSparkContext;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartMouseEvent;
import org.jfree.chart.ChartMouseListener;
import org.jfree.chart.ChartPanel;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.entity.XYItemEntity;
import org.jfree.data.time.Minute;
import org.jfree.data.time.TimeSeries;
import org.jfree.data.time.TimeSeriesCollection;
import org.jfree.ui.ApplicationFrame;
import si.bleedy.data.CounterData;
import si.bleedy.data.GpsPoint;

/**
 * @author bratwurzt
 */
public class TestSpark extends ApplicationFrame
{
  public TestSpark(String name)
  {
    super(name);
    SparkConf conf = new SparkConf()
        .setAppName("activityRecognition")
        .set("spark.cassandra.connection.host", "cassandra.marand.si")
        .set("spark.cassandra.connection.port", "9042")
        .setMaster("local");
    final JavaSparkContext sc = new JavaSparkContext(conf);
    CassandraTableScanJavaRDD<CassandraRow> cassandraRowsRDD = CassandraJavaUtil.javaFunctions(sc)
        .cassandraTable("counterkeyspace", "counter_timeline");
    GpsPoint ljPoint = new GpsPoint(46.05223f, 14.50567f);
    final Map<String, Iterable<CounterData>> map = cassandraRowsRDD
        .where("timestamp > ?", (System.currentTimeMillis() - 20* 24 * 60 * 60 * 1000) / 1000)
        .map(CassandraRow::toMap)
        .map(entry -> new CounterData(
            (String)entry.get("counter_id"),
            (long)entry.get("timestamp"),
            (float)entry.get("avg_sec_gap"),
            (int)entry.get("speed"),
            (int)entry.get("cars_per_sec"),
            (float)entry.get("utilization")))
        .filter(p -> ljPoint.isInRadius(p.getGps(), 10f))
        .filter(p -> p.isHighway())
        .groupBy(CounterData::getId)
        .collectAsMap();
    TimeSeriesCollection dataset = new TimeSeriesCollection();
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
                timeseries.add(new TimeSeries(entry.getKey() + "_" + (i + 1)));
              }
              timeseries.get(i).add(new Minute(new Date(counterData.getTimestamp())), doubles[i]);
            }
          });

      timeseries.forEach(dataset::addSeries);

      //List<Vector> collect = StreamSupport.stream(entry.getValue().spliterator(), false)
      //    .filter(p -> ljPoint.isInRadius(p.getGps(), 5f))
      //    .filter(p -> !p.isHighway())
      //    .map(CounterData::toDoubleArray)
      //    .map(Vectors::dense)
      //    .collect(Collectors.toList());
      //
      //MultivariateStatisticalSummary statisticalSummary = Statistics.colStats(sc.parallelize(collect).rdd());
      //List<double[]> stats = new ArrayList<>();
      //stats.add(statisticalSummary.mean().toArray());
      //stats.add(statisticalSummary.variance().toArray());
      //stats.add(statisticalSummary.min().toArray());
      //stats.add(statisticalSummary.max().toArray());
      //stats.add(statisticalSummary.normL1().toArray());
      //featureMap.put(entry.getKey(), stats);
    }

    //JavaRDD<List<Integer>> transactions = cassandraRowsRDD
    //    .where("timestamp > ?", ((System.currentTimeMillis() - 9 * 60 * 60 * 1000) / 1000))
    //    .map(CassandraRow::toMap)
    //    .map(entry -> new CounterData(
    //        (String)entry.get("counter_id"),
    //        (long)entry.get("timestamp"),
    //        (float)entry.get("avg_sec_gap"),
    //        (int)entry.get("speed"),
    //        (int)entry.get("cars_per_sec"),
    //        (float)entry.get("utilization")))
    //    .groupBy(CounterData::getId)
    //    .map(tuple -> {
    //      List<Integer> returnList = new ArrayList<>();
    //      tuple._2().forEach(entry -> returnList.add(entry.getCarsPerHour()));
    //      return returnList;
    //    });

    //FPGrowth fpg = new FPGrowth()
    //    .setMinSupport(0.2)
    //    .setNumPartitions(10);
    //FPGrowthModel<Integer> model = fpg.run(transactions);
    //for (FPGrowth.FreqItemset<Integer> itemset : model.freqItemsets().toJavaRDD().collect())
    //{
    //  System.out.println("[" + itemset.javaItems() + "], " + itemset.freq());
    //}
    //
    //double minConfidence = 0.8;
    //for (AssociationRules.Rule<Integer> rule : model.generateAssociationRules(minConfidence).toJavaRDD().collect())
    //{
    //  System.out.println(
    //      rule.javaAntecedent() + " => " + rule.javaConsequent() + ", " + rule.confidence());
    //}

    JFreeChart chart = ChartFactory.createTimeSeriesChart(
        "Števci prometa", // title
        "Date", // x-axis label
        "Cars Per Hour", // y-axis label
        dataset, // data
        false, // create legend?
        true, // generate tooltips?
        false // generate URLs?
    );
    //chart.getXYPlot().setRenderer(new XYSplineRenderer());
    ChartPanel chartPanel = new ChartPanel(chart);
    chartPanel.addChartMouseListener(new ChartMouseListener()
    {
      @Override
      public void chartMouseClicked(ChartMouseEvent chartMouseEvent)
      {
        XYItemEntity entity = (XYItemEntity)chartMouseEvent.getEntity();
        int seriesIndex = entity.getSeriesIndex();
        int itemIndex = entity.getItem();
        String[] split = entity.getToolTipText().split("-");
        if (split.length == 3)
        //map.entrySet().toArray()[seriesIndex];
        System.out.println();
      }

      @Override
      public void chartMouseMoved(ChartMouseEvent chartMouseEvent)
      {
      }
    });
    chartPanel.setPreferredSize(new java.awt.Dimension(800, 600));
    chartPanel.setMouseZoomable(true, false);
    setContentPane(chartPanel);

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
    //    new IOTTCPReceiver(StorageLevel.MEMORY_ONLY(), ssc.sparkContext())
    //);
    //cr.print();
    //ssc.start();
    //ssc.awaitTermination();
    System.out.println();
  }

  public static void main(String[] args)
  {
    TestSpark demo = new TestSpark("test");
    demo.pack();
    demo.setVisible(true);
  }
}
