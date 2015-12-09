package si.bleedy.runnable;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.regex.Pattern;

import com.csvreader.CsvReader;
import com.datastax.driver.core.BoundStatement;
import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.PreparedStatement;
import com.datastax.driver.core.Session;
import si.bleedy.data.SleepData;

/**
 * @author bratwurzt
 */
public class SaveCsvRunnable implements Runnable
{
  protected boolean m_isStopped = false;
  protected ExecutorService m_clientThreadPool = Executors.newSingleThreadExecutor();
  protected Session m_session;
  protected BoundStatement m_boundStatement;

  public SaveCsvRunnable()
  {
  }

  public void run()
  {
    try (Cluster cluster = Cluster.builder()
        .withPort(9042)
        .addContactPoint("192.168.1.2")
        .build())
    {
      m_session = cluster.connect("zephyrkeyspace");
      PreparedStatement statement = m_session
          .prepare("INSERT INTO sleep(id, from_time, to_time, sleep_hours, sleep_cycles, sleep_deep, name, timestamp, value) VALUES (?,?,?,?,?,?,?,?,?);");
      m_boundStatement = new BoundStatement(statement);
      InputStream resourceAsStream = SaveCsvRunnable.class.getResourceAsStream("/sleep-export.csv");
      CsvReader reader = new CsvReader(new InputStreamReader(resourceAsStream));
      reader.setDelimiter(',');
      List<SleepData> list = new ArrayList<>();
      Pattern p = Pattern.compile(".*\\d+.*");
      try
      {
        reader.readHeaders();
        String[] headers = reader.getHeaders();
        int hourIndex = 0;
        for (int i = 0; i < headers.length; i++)
        {

        }
        while (reader.readRecord())
        {
          //new SleepData(
          //    Long.parseLong(reader.get(0)),
          //
          //);
          System.out.println();
        }
      }
      catch (IOException e)
      {
        e.printStackTrace();
      }
    }
  }

  public synchronized boolean isStopped()
  {
    return m_isStopped;
  }

  public synchronized void stop()
  {
    m_isStopped = true;
  }
}
