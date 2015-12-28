package si.bleedy.runnable;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.regex.Pattern;

import com.csvreader.CsvReader;
import com.datastax.driver.core.BoundStatement;
import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.PreparedStatement;
import com.datastax.driver.core.Session;
import si.bleedy.data.ObservationData;
import si.bleedy.data.SleepData;

/**
 * @author bratwurzt
 */
public class SaveCsvRunnable implements Runnable
{
  protected boolean m_isStopped = false;
  protected ExecutorService m_clientThreadPool = Executors.newSingleThreadExecutor();
  protected Session m_session;
  protected BoundStatement m_sleepBoundStatement, m_obsBoundStatement;

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
      m_session = cluster.connect("obskeyspace");
      PreparedStatement sleepStatement = m_session
          .prepare("INSERT INTO sleep(timestamp_start, from_time, to_time, sleep_hours, sleep_cycles, sleep_deep) VALUES (?,?,?,?,?,?);");
      PreparedStatement obsStatement = m_session.prepare("INSERT INTO observations(name, unit, timestamp, value) VALUES (?,?,?,?);");
      m_sleepBoundStatement = new BoundStatement(sleepStatement);
      m_obsBoundStatement = new BoundStatement(obsStatement);
      InputStream resourceAsStream = SaveCsvRunnable.class.getResourceAsStream("/sleep-export.csv");
      CsvReader reader = new CsvReader(new InputStreamReader(resourceAsStream));
      reader.setDelimiter(',');
      List<SleepData> sleepList = new ArrayList<>();
      List<ObservationData> obsList = new ArrayList<>();
      Pattern p = Pattern.compile(".*\\d+.*");
      SimpleDateFormat dateFormat = new SimpleDateFormat("dd. MM. yyyy HH:mm"); //06. 12. 2015 23:51
      SimpleDateFormat hourMovementFormat = new SimpleDateFormat("dd. MM. yyyy"); //23:51
      try
      {
        while (reader.readRecord())
        {
          int hourIndex = 0;
          Long timestampStart = null;
          Date from = null, to = null;
          Float sleepHours = null, sleepDeep = null;
          Integer sleepCycles = null;
          String[] headers = reader.getValues();
          reader.readRecord();
          String[] values = reader.getValues();
          String header;
          for (int i = 0; i < headers.length; i++)
          {
            header = headers[i];
            if ("Id".equals(header))
            {
              timestampStart = Long.parseLong(values[i]);
            }
            else if ("From".equals(header))
            {
              from = dateFormat.parse(values[i]);
            }
            else if ("To".equals(header))
            {
              to = dateFormat.parse(values[i]);
            }
            else if ("Hours".equals(header))
            {
              sleepHours = Float.parseFloat(values[i]);
            }
            else if ("Cycles".equals(header))
            {
              sleepCycles = Integer.parseInt(values[i]);
            }
            else if ("DeepSleep".equals(header))
            {
              sleepDeep = Float.parseFloat(values[i]);
            }
            else if (p.matcher(header).matches())
            {
              hourIndex = i;
              break;
            }
          }

          int i = hourIndex;
          String fromDateOnly = hourMovementFormat.format(from);
          String toDateOnly = hourMovementFormat.format(to);
          long eventTime = timestampStart;
          while(p.matcher(header = headers[i]).matches())
          {
            eventTime = dateFormat.parse(fromDateOnly + " " + header).getTime();
            if (eventTime < from.getTime() || eventTime > to.getTime())
            {
              eventTime = dateFormat.parse(toDateOnly + " " + header).getTime();
            }
            obsList.add(new ObservationData(
                "sleep",
                "movement",
                eventTime,
                values[i]
            ));
            i++;
          }
          while(headers.length > i && "Event".equals(header = headers[i]))
          {
            String[] split = values[i].split("-");
            String[] split2 = split[0].toLowerCase().split("_");
            String type = split2[0];
            Long timestamp = Long.valueOf(split[1]);
            obsList.add(new ObservationData(
                "sleep",
                "event_" + type,
                timestamp,
                "start".equals(split2[1]) || "resumed".equals(split2[1]) ? 1 : 0
            ));
            i++;
          }
          if (timestampStart != null && from != null && to != null && sleepCycles != null && sleepDeep != null && sleepHours != null)
          {
            sleepList.add(new SleepData(
                timestampStart,
                from.getTime(),
                to.getTime(),
                sleepHours,
                sleepCycles,
                sleepDeep
            ));
          }
        }

        for (SleepData data : sleepList)
        {
          m_session.execute(m_sleepBoundStatement.bind(
              data.getTimestampStart(), data.getFromTime(), data.getToTime(), data.getSleepHours(), data.getSleepCycles(), data.getSleepDeep()
          ));
        }

        for (ObservationData data : obsList)
        {
          m_session.execute(m_obsBoundStatement.bind(data.getName(), data.getUnit(), data.getTimestamp(), data.getStringValue()));
        }
      }
      catch (Exception e)
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
