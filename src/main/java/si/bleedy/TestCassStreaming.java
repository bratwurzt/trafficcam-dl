package si.bleedy;

import java.awt.BorderLayout;
import java.awt.Color;
import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.LinkedBlockingQueue;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

import com.google.common.collect.Iterables;
import si.bleedy.detectors.wQRS;
import si.bleedy.runnable.CassandraReceiver;
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

/**
 * @author bratwurzt
 */
public class TestCassStreaming extends ApplicationFrame implements Serializable
{
  private static final long serialVersionUID = -4289949126909167376L;
  private static final Logger LOG = Logger.getLogger(TestCassStreaming.class);
  private SimpleDateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm");
  //protected final ExecutorService m_threadPool = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors() / 2);
  public static SparkConf conf = new SparkConf()
      .setAppName("heart")
      .set("spark.cassandra.connection.host", "cassandra.marand.si")
      .set("spark.cassandra.connection.port", "9042")
      .setMaster("local[4]");

  // streaming
  public static Duration batchDuration = Durations.milliseconds(1000);
  public static final JavaStreamingContext ssc = new JavaStreamingContext(conf, batchDuration);
  public final LinkedBlockingQueue<List<Tuple2<String, Iterable<ObservationData>>>> m_plotDataQueue;
  private long m_rangeMillis = 10000;
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
    public static final String[] PLOT_NAMES = new String[]{"qrs_bool", "ecg_mV", "r to r_s"};

  /**
   * The datasets.
   */
  public final TimeSeriesCollection[] datasets;

  /**
   * The most recent value added to series 1.
   */
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

  private void runSpark() throws ParseException, InterruptedException
  {
    CassandraReceiver receiver = new CassandraReceiver(
        StorageLevel.MEMORY_ONLY(),
        "21.12.2015 04:20",
        "21.12.2015 08:20",
        batchDuration,
        100000
    );

    JavaDStream<ObservationData> cassStream = ssc.receiverStream(receiver);

    JavaDStream<ObservationData> transform = cassStream.filter(o -> "ecg".equals(o.getName()))
        .transform(rdd -> {
          if (rdd.count() > 0)
          {
            List<ObservationData> collect = rdd.collect();
            List<ObservationData> result = m_qrsDetector.getResult(collect);
            return ssc.sparkContext().parallelize(result);
          }
          return rdd;
        });

    transform.union(cassStream).foreachRDD((Function<JavaRDD<ObservationData>, Void>)rdd -> {
      if (rdd.count() > 0)
      {
        final List<Tuple2<String, Iterable<ObservationData>>> collect = rdd
            .groupBy(ObservationData::getGrouping)
            .collect();

        m_plotDataQueue.add(collect);
        //m_threadPool.execute(new PlotGraphAsync(collect));
      }
      return null;
    });

    ssc.start();
    ssc.awaitTermination();
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
