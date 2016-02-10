package si.bleedy;

import java.awt.BorderLayout;
import java.awt.Color;
import java.io.Serializable;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.LinkedBlockingQueue;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

import com.google.common.collect.Iterables;
import org.apache.log4j.Logger;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.Duration;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.jfree.chart.ChartPanel;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.DateAxis;
import org.jfree.chart.axis.NumberAxis;
import org.jfree.chart.axis.ValueAxis;
import org.jfree.chart.plot.CombinedDomainXYPlot;
import org.jfree.chart.plot.XYPlot;
import org.jfree.chart.renderer.xy.StandardXYItemRenderer;
import org.jfree.data.time.Millisecond;
import org.jfree.data.time.TimeSeries;
import org.jfree.data.time.TimeSeriesCollection;
import org.jfree.ui.ApplicationFrame;
import org.jfree.ui.RefineryUtilities;
import scala.Tuple2;
import si.bleedy.data.ObservationData;
import si.bleedy.detectors.wQRS;
import si.bleedy.runnable.CassandraReceiver;

/**
 * @author bratwurzt
 */
public class TestCassStreaming extends ApplicationFrame implements Serializable
{
  private static final long serialVersionUID = -4289949126909167376L;
  private static final Logger LOG = Logger.getLogger(TestCassStreaming.class);
  public static SparkConf conf = new SparkConf()
      .setAppName("heart")
      .set("spark.cassandra.connection.host", "192.168.1.2")
      .set("spark.cassandra.connection.port", "9042")
      .setMaster("local[4]");

  // streaming
  public static Duration batchDuration = Durations.seconds(2);
  public static final JavaStreamingContext ssc = new JavaStreamingContext(conf, batchDuration);
  public final LinkedBlockingQueue<List<Tuple2<String, Iterable<ObservationData>>>> m_plotDataQueue;
  private long m_rangeMillis = 60000;
  private wQRS m_qrsDetector;

  //static
  //{
  //  URL url = Thread.currentThread().getContextClassLoader().getResource("config/log4j.properties");
  //  PropertyConfigurator.configure(url);
  //}

  /**
   * The number of subplots.
   */
  //public static final String[] PLOT_NAMES = new String[]{"r to r_s", "heart rate_bpm", "vmu_g", "respiration rate_bpm", "breathing wave amplitude_ml", "ecg_mV"};
  //  public static final String[] PLOT_NAMES = new String[]{
  //      "r to r_s", "heart rate_bpm", "vmu_g", "respiration rate_bpm", "breathing wave amplitude_ml", "rpi-gsr_mV", "rpi-temp_mV"/*, "rpi-ecg_mV"*/
  //  };
  public static final String[] PLOT_NAMES = new String[]{"breathing_unknown unit", "ecg_mV", "qrs_bool", "r to r_s"};

  /**
   * The datasets.
   */
  public final TimeSeriesCollection[] datasets;

  private void runSpark() throws ParseException, InterruptedException
  {
    CassandraReceiver receiver = new CassandraReceiver(
        StorageLevel.MEMORY_ONLY(),
        "03.02.2016 00:50",
        "03.02.2016 01:50",
        batchDuration,
        500000
    );

    JavaDStream<ObservationData> cassStream = ssc.receiverStream(receiver);

    //ssc.checkpoint("C:\\Projects\\trafficcam-dl\\test");

    // ecg
    JavaDStream<ObservationData> ecgStream = cassStream
        .filter(o -> "ecg".equals(o.getName()))
        //.transform(rdd -> {
        //  return ssc.sparkContext().parallelize(fillMissingSamplesWithAvg(rdd.collect()));
        //})
        ;

    //JavaDStream<ObservationData> countStream = ecgStream
    //    .countByWindow(Durations.milliseconds(50), Durations.milliseconds(10))
    //    .map(o -> new ObservationData("sample", "sum", 0L, (double)o));
    //
    //JavaDStream<ObservationData> sumStream = ecgStream
    //    .reduceByWindow((o1, o2) -> {
    //      o1.setValue(o1.getValue() + o2.getValue());
    //      return o1;
    //    }, Durations.milliseconds(50), Durations.milliseconds(10));
    //
    //JavaDStream<ObservationData> movingAvg = countStream.union(sumStream)
    //    .transform(rdd -> {
    //      if (rdd.count() == 2)
    //      {
    //        ObservationData data = rdd.reduce((o1, o2) -> {
    //          if ("sample_sum".equals(o1.getGrouping()))
    //          {
    //            o2.setValue(o2.getValue() / o1.getValue());
    //            o2.setName(o2.getName() + "-avg");
    //            return o2;
    //          }
    //          else
    //          {
    //            o1.setValue(o1.getValue() / o2.getValue());
    //            o1.setName(o1.getName() + "-avg");
    //            return o1;
    //          }
    //        });
    //
    //        return ssc.sparkContext().parallelize(Collections.singletonList(data));
    //      }
    //      return null;
    //    });

    JavaDStream<ObservationData> qrsStream = ecgStream
        .transform(rdd -> {
          if (rdd.count() > 0)
          {
            List<ObservationData> collect = rdd.collect();
            List<ObservationData> result = m_qrsDetector.getResult(collect);
            return ssc.sparkContext().parallelize(result);
          }
          return rdd;
        });

    // plot
    ecgStream
        .union(cassStream.filter(o -> "breathing".equals(o.getName())))
        .union(cassStream.filter(o -> "r to r".equals(o.getName())))
        .union(qrsStream)
        .foreachRDD((Function<JavaRDD<ObservationData>, Void>)rdd -> {
          if (rdd.count() > 0)
          {
            final List<Tuple2<String, Iterable<ObservationData>>> collect = rdd
                .groupBy(ObservationData::getGrouping)
                .collect();

            m_plotDataQueue.add(collect);
          }
          return null;
        });

    ssc.start();
    ssc.awaitTermination();
  }

  public TestCassStreaming(String name)
  {
    super(name);

    m_plotDataQueue = new LinkedBlockingQueue<>();
    final CombinedDomainXYPlot plot = new CombinedDomainXYPlot(new DateAxis("Time"));
    this.datasets = new TimeSeriesCollection[PLOT_NAMES.length];
    m_qrsDetector = new wQRS();
    m_qrsDetector.init();

    for (int i = 0; i < PLOT_NAMES.length; i++)
    {
      String[] split = PLOT_NAMES[i].split("_");
      final TimeSeries series = new TimeSeries(split[0]);
      this.datasets[i] = new TimeSeriesCollection(series);
      series.setMaximumItemAge(m_rangeMillis + 1000);
      final NumberAxis rangeAxis = new NumberAxis(split[1]);
      rangeAxis.setAutoRangeIncludesZero(false);
      final XYPlot subplot = new XYPlot(
          this.datasets[i], null, rangeAxis, new StandardXYItemRenderer()
      );
      subplot.setBackgroundPaint(Color.lightGray);
      subplot.setDomainGridlinePaint(Color.white);
      subplot.setRangeGridlinePaint(Color.white);
      plot.add(subplot);
    }

    final JFreeChart chart = new JFreeChart("Spark save and read", plot);
    chart.setBorderPaint(Color.black);
    chart.setBorderVisible(true);
    chart.setBackgroundPaint(Color.white);

    plot.setBackgroundPaint(Color.lightGray);
    plot.setDomainGridlinePaint(Color.white);
    plot.setRangeGridlinePaint(Color.white);
    final ValueAxis axis = plot.getDomainAxis();
    axis.setAutoRange(true);

    axis.setFixedAutoRange((double)m_rangeMillis);  // 60 seconds

    final JPanel content = new JPanel(new BorderLayout());
    final ChartPanel chartPanel = new ChartPanel(chart);
    content.add(chartPanel);
    setContentPane(content);

    new Thread(new PlotGraphAsync(m_plotDataQueue)).start();
  }

  private List<ObservationData> fillMissingSamplesWithAvg(List<ObservationData> collect)
  {
    List<ObservationData> returnList = new ArrayList<>();

    for (int i = 0; i < collect.size(); i++)
    {
      ObservationData data = collect.get(i);
      if (i > 0 && i < collect.size() - 1)
      {
        ObservationData previousData = collect.get(i - 1);
        ObservationData nextData = collect.get(i + 1);

        if (data.getValue() > 1000 && previousData.getValue() < 1000 && nextData.getValue() < 1000)
        {
          data.setValue((previousData.getValue() + nextData.getValue()) / 2);
        }

        int timeDiff = (int)(data.getTimestamp() - previousData.getTimestamp()) - 4;
        if (timeDiff > 0 && previousData.getValue() < 1000 && data.getValue() < 1000)
        {
          for (int j = 4; j <= timeDiff; j += 4)
          {
            returnList
                .add(new ObservationData(data.getName(), data.getUnit(), previousData.getTimestamp() + j, (previousData.getValue() + data.getValue()) / 2));
          }
        }
        returnList.add(data);
      }
      else if (i == 0)
      {
        ObservationData nextData = collect.get(i + 1);
        if (data.getValue() > 1000 && nextData.getValue() < 1000)
        {
          data.setValue(nextData.getValue());
        }
        returnList.add(data);
      }
      else
      {
        ObservationData previousData = collect.get(i - 1);
        if (data.getValue() > 1000 && previousData.getValue() < 1000)
        {
          data.setValue(previousData.getValue());
        }
        int timeDiff = (int)(data.getTimestamp() - previousData.getTimestamp()) - 4;
        if (timeDiff > 0 && previousData.getValue() < 1000 && data.getValue() < 1000)
        {
          for (int j = 4; j <= timeDiff; j += 4)
          {
            returnList.add(new ObservationData(data.getName(), data.getUnit(), data.getTimestamp() + j, (previousData.getValue() + data.getValue()) / 2));
          }
        }
        returnList.add(data);
      }
    }
    return returnList;
  }

  private class PlotGraphAsync implements Runnable
  {
    private final LinkedBlockingQueue<List<Tuple2<String, Iterable<ObservationData>>>> m_plotDataQueue;

    public PlotGraphAsync(LinkedBlockingQueue<List<Tuple2<String, Iterable<ObservationData>>>> plotDataQueue)
    {
      m_plotDataQueue = plotDataQueue;
    }

    @Override
    public void run()
    {
      //Thread.currentThread().setPriority(Thread.MAX_PRIORITY);
      while (true)
      {
        if (m_plotDataQueue.size() > 0)
        {
          List<Tuple2<String, Iterable<ObservationData>>> poll;
          while ((poll = m_plotDataQueue.poll()) != null)
          {
            for (final Tuple2<String, Iterable<ObservationData>> t : poll)
            {
              int index = ObservationData.getIndex(PLOT_NAMES, t._1());
              if (index >= 0)
              {
                SwingUtilities.invokeLater(new Runnable()
                {
                  @Override
                  public void run()
                  {
                    t._2().forEach(o -> {
                      try
                      {
                        datasets[index].getSeries(0).add(new Millisecond(new Date(o.getTimestamp())), o.getValue());
                        datasets[index].getSeries(0).removeAgedItems(false);
                      }
                      catch (Exception e)
                      {
                        e.printStackTrace();
                      }
                    });
                  }
                });
              }
            }
          }
        }
        else
        {
          try
          {
            Thread.sleep(batchDuration.milliseconds() / 5);
          }
          catch (InterruptedException e)
          {
            e.printStackTrace();
          }
        }
      }
    }
  }

  private JavaRDD<ObservationData> getRollingMeanJavaRDD(JavaRDD<ObservationData> rdd)
  {
    return rdd
        //        .sortBy((Function<ObservationData, Long>)ObservationData::getTimestamp, false, 2)
        .groupBy(ObservationData::getGrouping)
        .mapValues(o -> {
          if (o != null)
          {
            int size = Iterables.size(o);
            if (size > 0)
            {
              Iterator<ObservationData> iterator = o.iterator();
              ObservationData d = iterator.next();
              String name = d.getName();
              String unit = d.getUnit();
              double avgValue = d.getValue();
              while (iterator.hasNext())
              {
                d = iterator.next();
                avgValue += d.getValue();
              }
              avgValue /= size;
              return new ObservationData(
                  name,
                  unit,
                  d.getTimestamp(),
                  avgValue
              );
            }
          }
          return null;
        })
        .values();
  }

  public static void main(String[] args) throws ParseException
  {
    try
    {
      TestCassStreaming demo = new TestCassStreaming("test");
      demo.pack();
      RefineryUtilities.centerFrameOnScreen(demo);
      demo.setVisible(true);
      demo.runSpark();
    }
    catch (InterruptedException e)
    {
      e.printStackTrace();
    }
  }
}
