package si.bleedy;

import java.io.Serializable;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.swing.*;

import org.apache.log4j.PropertyConfigurator;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.api.java.function.VoidFunction;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartPanel;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.DateAxis;
import org.jfree.chart.plot.XYPlot;
import org.jfree.data.time.DynamicTimeSeriesCollection;
import org.jfree.data.time.Second;
import com.datastax.spark.connector.japi.CassandraJavaUtil;
import com.datastax.spark.connector.japi.CassandraRow;
import com.datastax.spark.connector.japi.CassandraStreamingJavaUtil;

import eu.fistar.sdcs.runnable.IOTReceiver;
import si.bleedy.data.ObservationData;

/**
 * @author bratwurzt
 */
public class SparkZephyrStreaming extends JPanel implements Serializable
{
  private static final long serialVersionUID = -4289949126909167376L;

  static
  {
    URL url = Thread.currentThread().getContextClassLoader().getResource("config/log4j.properties");
    PropertyConfigurator.configure(url);
  }

//  private final DynamicTimeSeriesCollection dataset;
//  private final JFreeChart chart;

  public SparkZephyrStreaming(String name)
  {
//    dataset = new DynamicTimeSeriesCollection(4, 60, new Second());
//    dataset.setTimeBase(new Second(new Date()));
//    dataset.addSeries(new float[1], 0, "ecg");
//    chart = ChartFactory.createTimeSeriesChart(name, "Time", name, dataset, true, true, false);
//    XYPlot plot = chart.getXYPlot();
//    DateAxis axis = (DateAxis)plot.getDomainAxis();
//    axis.setFixedAutoRange(10000);
//    axis.setDateFormatOverride(new SimpleDateFormat("ss.SS"));
//    final ChartPanel chartPanel = new ChartPanel(chart);
//    add(chartPanel);
//
//    JFrame frame = new JFrame("testing");
//    frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
//    frame.add(this);
//    frame.pack();
//    frame.setVisible(true);

    SparkConf conf = new SparkConf()
        .setAppName("heart")
        .set("spark.cassandra.connection.host", "cassandra.marand.si")
        .set("spark.cassandra.connection.port", "9042")
        .setMaster("local[3]");

    // streaming
    JavaStreamingContext ssc = new JavaStreamingContext(conf, Durations.seconds(1));

    JavaDStream<ObservationData> zephyrStream = ssc.receiverStream(
        new IOTReceiver(StorageLevel.MEMORY_ONLY(), 8099)
    );

    // filter Zephyr ecg
    JavaDStream<ObservationData> filteredZephyrStream = zephyrStream
        .filter((Function<ObservationData, Boolean>)ObservationData::filterZephyr);

//    zephyrStream.filter(e -> "ecg".equals(e.getName()))
//        .foreachRDD((Function2<JavaRDD<ObservationData>, Time, Void>)(rdd, time) -> {
//          if (rdd.count() > 0)
//          {
//            long count = rdd.count();
//            // Calculate statistics based on the content size.
//            long usable = rdd.filter(e -> e.getValue() < 1000).count();
//            long unusable = count - usable;
//            System.out.println(String.format("Number of ecg samples in 1 second: All: %s Usable: %s, Unusable: %s", count, usable, unusable));
//          }
//          return null;
//        });

    // Onion of everything!
    JavaDStream<ObservationData> union = filteredZephyrStream;
    CassandraStreamingJavaUtil.javaFunctions(union)
        .writerBuilder("obskeyspace", "observations", CassandraJavaUtil.mapToRow(ObservationData.class))
        .saveToCassandra();

    ssc.start();
    ssc.awaitTermination();
  }

  private int getIndex(String s)
  {
    switch (s)
    {
      case "ALPHA_ABSOLUTE_FP1":
        return 0;
      case "ALPHA_ABSOLUTE_FP2":
        return 1;
      case "BETA_ABSOLUTE_FP1":
        return 2;
      case "BETA_ABSOLUTE_FP2":
        return 3;
      default:
        break;
    }

    return 0;
  }

  public static void main(String[] args)
  {
    SparkZephyrStreaming demo = new SparkZephyrStreaming("test");

  }
}
