package si.bleedy;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
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
import org.apache.spark.api.java.function.FlatMapFunction;
import org.apache.spark.api.java.function.Function;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartMouseEvent;
import org.jfree.chart.ChartMouseListener;
import org.jfree.chart.ChartPanel;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.entity.XYItemEntity;
import org.jfree.data.time.Millisecond;
import org.jfree.data.time.Minute;
import org.jfree.data.time.TimeSeries;
import org.jfree.data.time.TimeSeriesCollection;
import org.jfree.ui.ApplicationFrame;
import scala.Tuple2;
import si.bleedy.data.CounterData;
import si.bleedy.data.GpsPoint;
import si.bleedy.data.ObservationData;

/**
 * @author bratwurzt
 */
public class TestSparkZephyr extends ApplicationFrame
{
  public TestSparkZephyr(String name) throws ParseException
  {
    super(name);
    long start = System.currentTimeMillis();
    SparkConf conf = new SparkConf()
        .setAppName("heart")
        .set("spark.cassandra.connection.host", "cassandra.marand.si")
        .set("spark.cassandra.connection.port", "9042")
        .setMaster("local[3]")
        ;

    final JavaSparkContext sc = new JavaSparkContext(conf);
    CassandraTableScanJavaRDD<CassandraRow> cassandraRowsRDD = CassandraJavaUtil.javaFunctions(sc)
        .cassandraTable("obskeyspace", "observations");
    SimpleDateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm");

    long startTime = dateFormat.parse("16.01.2016 14:30").getTime();
    long endTime = dateFormat.parse("15.01.2016 01:30").getTime();
    Map<String, Iterable<ObservationData>> map = cassandraRowsRDD
        .where("timestamp > ?", startTime)
        //.where("timestamp < ?", endTime)
        .where("name in (?,?)", "breathing", "ecg")
        //.where("name = ?", "breathing")
        .map(CassandraRow::toMap)
        .map(entry -> new ObservationData(
            (String)entry.get("name"),
            (String)entry.get("unit"),
            (long)entry.get("timestamp"),
            (String)entry.get("value")))
            //.filter(ObservationData::filter)
        .groupBy(ObservationData::getGrouping)
        .collectAsMap();

    System.out.println("Time taken for collection from remote cassandra server (ms): " + (System.currentTimeMillis() - start));
    TimeSeriesCollection dataset = new TimeSeriesCollection();
    final List<TimeSeries> timeseries = new LinkedList<>();
    for (Map.Entry<String, Iterable<ObservationData>> entry : map.entrySet())
    {
      final TimeSeries series = new TimeSeries(entry.getKey());
      try
      {
        StreamSupport.stream(entry.getValue().spliterator(), false)
            .forEach(data -> series.add(new Millisecond(new Date(data.getTimestamp())), data.getValue()));
      }
      catch (Exception e)
      {
        e.printStackTrace();
      }

      timeseries.add(series);
    }
    timeseries.forEach(dataset::addSeries);

    JFreeChart chart = ChartFactory.createTimeSeriesChart(
        "Zephyr", // title
        "Date", // x-axis label
        "blabla", // y-axis label
        dataset, // data
        false, // create legend?
        true, // generate tooltips?
        false // generate URLs?
    );
    //chart.getXYPlot().setRenderer(new XYSplineRenderer());
    ChartPanel chartPanel = new ChartPanel(chart);
//    chartPanel.addChartMouseListener(new ChartMouseListener()
//    {
//      @Override
//      public void chartMouseClicked(ChartMouseEvent chartMouseEvent)
//      {
//        //XYItemEntity entity = (XYItemEntity)chartMouseEvent.getEntity();
//        //int seriesIndex = entity.getSeriesIndex();
//        //int itemIndex = entity.getItem();
//        //String[] split = entity.getToolTipText().split("-");
//        //if (split.length == 3)
//        ////map.entrySet().toArray()[seriesIndex];
//        //{
//        //  System.out.println();
//        //}
//      }
//
//      @Override
//      public void chartMouseMoved(ChartMouseEvent chartMouseEvent)
//      {
//      }
//    });
    chartPanel.setPreferredSize(new java.awt.Dimension(1200, 960));
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
    try
    {
      TestSparkZephyr demo = new TestSparkZephyr("test");
      demo.pack();
      demo.setVisible(true);
    }
    catch (ParseException e)
    {
      e.printStackTrace();
    }
  }
}
