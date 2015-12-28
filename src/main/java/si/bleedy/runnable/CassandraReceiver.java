package si.bleedy.runnable;

import java.io.Serializable;
import java.net.ServerSocket;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.Duration;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.apache.spark.streaming.receiver.Receiver;
import com.datastax.spark.connector.japi.CassandraRow;
import com.datastax.spark.connector.japi.CassandraStreamingJavaUtil;
import com.datastax.spark.connector.japi.StreamingContextJavaFunctions;
import com.datastax.spark.connector.japi.rdd.CassandraTableScanJavaRDD;

import si.bleedy.data.ObservationData;

/**
 * @author bratwurzt
 */
public class CassandraReceiver extends Receiver<ObservationData> implements Serializable
{
  private static final long serialVersionUID = 1840376582814772051L;
  private ServerSocket m_serverSocket;
  protected boolean m_isStopped = false;
  private SimpleDateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm");
  protected long m_from, m_to, m_batchDurationMillis;
  protected final BlockingQueue<ObservationData> m_observations;
  private  StreamingContextJavaFunctions m_tableScanJavaRDD;

  public CassandraReceiver(StorageLevel storageLevel, final StreamingContextJavaFunctions f, String from, String to, Duration duration)
  {
    super(storageLevel);
    m_observations = new LinkedBlockingQueue<>();
    m_tableScanJavaRDD = f;
    try
    {
      m_from = dateFormat.parse(from).getTime();
      m_to = dateFormat.parse(to).getTime();
    }
    catch (ParseException e)
    {
      m_from = System.currentTimeMillis();
      m_to = 0;
    }
    m_batchDurationMillis = duration.milliseconds();
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

  @Override
  public void onStop()
  {
  }

  private void receive()
  {
    try
    {
      long start;

      while (!isStopped())
      {
        start = System.currentTimeMillis();
        long to = m_from + m_batchDurationMillis;
        if (to > m_to)
        {
          to = m_to;
        }

        List<ObservationData> collect = m_tableScanJavaRDD
            .cassandraTable("obskeyspace", "observations")
            .where("timestamp > ?", m_from)
            .where("timestamp < ?", to)
            .map(CassandraRow::toMap)
            .map(entry -> new ObservationData(
                (String)entry.get("name"),
                (String)entry.get("unit"),
                (long)entry.get("timestamp"),
                (String)entry.get("value")))
            .collect();

        while (System.currentTimeMillis() - start < m_batchDurationMillis)
        {
          Thread.sleep(m_batchDurationMillis / 100);
        }
        store(collect.iterator());
        m_from = to;
      }
    }
    catch (Exception e)
    {
      restart(e.getMessage());
    }
  }

  public synchronized boolean isStopped()
  {
    return m_isStopped;
  }

  @Override
  public StorageLevel storageLevel()
  {
    return StorageLevel.MEMORY_ONLY();
  }
}
