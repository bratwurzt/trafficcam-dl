package si.bleedy.runnable;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import com.datastax.spark.connector.japi.CassandraRow;
import com.datastax.spark.connector.japi.CassandraStreamingJavaUtil;
import org.apache.log4j.Logger;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.Duration;
import org.apache.spark.streaming.receiver.Receiver;
import si.bleedy.TestCassStreaming;
import si.bleedy.data.ObservationData;
import si.bleedy.data.PriorityBlockingDeque;

/**
 * @author bratwurzt
 */
public class CassandraReceiver extends Receiver<ObservationData> implements Serializable
{
  private static final Logger LOG = Logger.getLogger(CassandraReceiver.class);
  protected boolean m_isStopped = false;
  private SimpleDateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm");
  protected long m_from, m_to, m_batchDurationMillis;
  protected final PriorityBlockingDeque<ObservationData> m_observations;

  public CassandraReceiver(StorageLevel storageLevel, String from, String to, Duration duration, Integer dequeSize)
  {
    super(storageLevel);
    m_observations = new PriorityBlockingDeque<>(new ObservationComparator(), dequeSize);
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
    new Thread(new CassReceiver(), "CassReceiver").start();
    new Thread(new CassStorer(), "CassStorer").start();
  }

  @Override
  public void onStop()
  {
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

  private class CassReceiver implements Runnable
  {
    private boolean isObsDequeBigEnough(long millis)
    {
      ObservationData first;
      ObservationData last;
      synchronized (m_observations)
      {
        first = m_observations.peekFirst();
        last = m_observations.peekLast();
      }

      return first != null && last != null && first.getTimestamp() - last.getTimestamp() > millis;
    }

    @Override
    public void run()
    {
      try
      {
        Thread.currentThread().setPriority(Thread.MIN_PRIORITY);
        while (!isStopped())
        {
          long to = m_from + (m_batchDurationMillis < 1000 ? 1000 : m_batchDurationMillis) * 50;
          if (to > m_to)
          {
            to = m_to;
          }

          List<ObservationData> collect = CassandraStreamingJavaUtil.javaFunctions(TestCassStreaming.ssc)
              .cassandraTable("obskeyspace", "observations")
              .where("timestamp >= ?", m_from)
              .where("timestamp < ?", to)
              .map(CassandraRow::toMap)
              .map(entry -> new ObservationData(
                  (String)entry.get("name"),
                  (String)entry.get("unit"),
                  (long)entry.get("timestamp"),
                  (String)entry.get("value")))
              .collect();

          synchronized (m_observations)
          {
            m_observations.addAll(collect);
          }
          while (isObsDequeBigEnough((m_batchDurationMillis < 1000 ? 1000 : m_batchDurationMillis)*10))
          {
            Thread.sleep((m_batchDurationMillis < 1000 ? 1000 : m_batchDurationMillis));
          }
          m_from = to;
        }
      }
      catch (Exception e)
      {
        restart(e.getMessage());
      }
    }
  }

  private class CassStorer implements Runnable
  {
    private boolean isObsDequeBigEnough(long millis)
    {
      ObservationData first;
      ObservationData last;
      synchronized (m_observations)
      {
        first = m_observations.peekFirst();
        last = m_observations.peekLast();
      }

      return first != null && last != null && first.getTimestamp() - last.getTimestamp() > millis;
    }

    @Override
    public void run()
    {
      long lastTime = System.currentTimeMillis();
      while (!isStopped())
      {
        List<ObservationData> tempList = new ArrayList<>();
        try
        {
          if (isObsDequeBigEnough(m_batchDurationMillis))
          {
            synchronized (m_observations)
            {
              ObservationData obs = m_observations.pollLast();
              try
              {
                long lastObsTime = obs.getTimestamp();
                tempList.add(obs);

                while ((obs = m_observations.pollLast()) != null && obs.getTimestamp() - lastObsTime <= m_batchDurationMillis)
                {
                  tempList.add(obs);
                }
              }
              catch (Exception e)
              {
                e.printStackTrace();
              }
            }
            //}
            long diff;
            while((diff = System.currentTimeMillis() - lastTime) < m_batchDurationMillis)
            {
              try
              {
                Thread.sleep(m_batchDurationMillis / 100);
              }
              catch (InterruptedException e)
              {
                e.printStackTrace();
              }
            }

            if (tempList.size() > 0)
            {
              store(tempList.iterator());
              lastTime = System.currentTimeMillis() + (diff - m_batchDurationMillis);
            }
          }
          else
          {
            try
            {
              Thread.sleep(m_batchDurationMillis);
            }
            catch (InterruptedException e)
            {
              e.printStackTrace();
            }
          }
        }
        catch (Exception e)
        {
          synchronized (m_observations)
          {
            m_observations.addAll(tempList);
          }
        }
        //long diff = System.currentTimeMillis() - lastTime;
        //if ((diff >= m_batchDurationMillis))
        //{
        //  //if (isObsDequeBigEnough(m_batchDurationMillis))
        //  //{
        //  LOG.info("Storing " + diff + " millis of data.");
        //  storeFromObservations();
        //  lastTime = System.currentTimeMillis();
        //  //}
        //
        //}
        //else
        //{
        //  try
        //  {
        //    Thread.sleep(m_batchDurationMillis / 3);
        //  }
        //  catch (InterruptedException e)
        //  {
        //    e.printStackTrace();
        //  }
        //}
      }
    }

    //private void storeFromObservations()
    //{
    //  List<ObservationData> tempList = new ArrayList<>();
    //  try
    //  {
    //    //synchronized (m_observations)
    //    //{
    //    ObservationData obs = m_observations.pollFirst();
    //    long firstTime = obs.getTimestamp();
    //    tempList.add(obs);
    //
    //    while ((obs = m_observations.pollFirst()) != null && obs.getTimestamp() - firstTime <= m_batchDurationMillis)
    //    {
    //      tempList.add(obs);
    //    }
    //    //}
    //    store(tempList.iterator());
    //  }
    //  catch (Exception e)
    //  {
    //    m_observations.addAll(tempList);
    //  }
    //}
  }

  private class ObservationComparator implements Comparator<ObservationData>, Serializable
  {
    @Override
    public int compare(ObservationData o1, ObservationData o2)
    {
      return o1.getTimestamp() > o2.getTimestamp() ? -1 : o1.getTimestamp() < o2.getTimestamp() ? 1 : 0;
    }
  }
}
