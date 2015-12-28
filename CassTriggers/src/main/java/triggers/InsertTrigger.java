package triggers;

import java.io.InputStream;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;

import org.apache.cassandra.config.CFMetaData;
import org.apache.cassandra.db.Cell;
import org.apache.cassandra.db.ColumnFamily;
import org.apache.cassandra.db.Mutation;
import org.apache.cassandra.db.composites.CellName;
import org.apache.cassandra.db.marshal.AbstractType;
import org.apache.cassandra.io.util.FileUtils;
import org.apache.cassandra.triggers.ITrigger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import eu.fistar.sdcs.pa.ZephyrProtos;

/**
 * @author DusanM
 */
public class InsertTrigger implements ITrigger
{
  private static final Logger LOG = LoggerFactory.getLogger(InsertTrigger.class);
  public static int BATCH_TIME = 1000;
  protected final BlockingQueue<ZephyrProtos.ObservationPB> m_observations;
  protected final Map<Long, Map<String, ZephyrProtos.ObservationPB.Builder>> m_map = new ConcurrentHashMap<>();
  protected ExecutorService m_queryThreadExecutor = Executors.newSingleThreadExecutor();
  private Long m_lastTime;
  private Properties m_properties = loadProperties();
  private Socket m_socket;

  public InsertTrigger()
  {
    m_observations = new LinkedBlockingQueue<>();
    m_lastTime = System.currentTimeMillis();
  }

  @Override
  public Collection<Mutation> augment(ByteBuffer byteBuffer, ColumnFamily update)
  {
    try
    {
      CFMetaData cfm = update.metadata();

      for (Cell cell : update)
      {
        CellName cellName = cell.name();
        String name = cfm.comparator.getString(cell.name());
        String localKey = cfm.getKeyValidator().getString(byteBuffer);
        String value = cfm.getValueValidator(cellName).getString(cell.value());
        String[] split = name.split(":");
        Long key = Long.valueOf(split[0]);
        String columnName;

        if (split.length == 2 && (columnName = split[1]) != null && columnName.length() > 0)
        {
          if (!m_map.containsKey(key))
          {
            m_map.put(key, new ConcurrentHashMap<>());
          }

          if (!m_map.get(key).containsKey(localKey))
          {
            ZephyrProtos.ObservationPB.Builder newBuilder = ZephyrProtos.ObservationPB.newBuilder();
            newBuilder.setName(localKey);
            newBuilder.setTime(key);
            m_map.get(key).put(localKey, newBuilder);
          }

          ZephyrProtos.ObservationPB.Builder builder = m_map.get(key).get(localKey);
          switch (columnName)
          {
            case "unit":
              builder.setUnit(value);
              break;
            case "value":
              builder.addAllValues(Collections.singletonList(value));
              break;
          }

          if (builder.hasName() && builder.hasTime() && builder.hasUnit() && builder.getValuesCount() > 0)
          {
            ZephyrProtos.ObservationPB build = builder.build();

            synchronized (m_observations)
            {
              m_observations.put(build);
            }
            m_map.get(key).remove(localKey);
          }
        }
//        LOG.info("Cell key=" + localKey + ", name=" + name + ", value=" + value);
      }

      if (m_observations.size() >= 500)
      {
        LOG.info("Sending " + m_observations.size() + " protobuffers.");
        sendData();
        m_lastTime = System.currentTimeMillis();
      }

      if (m_observations.size() >= 50000)
      {
        synchronized (m_observations)
        {
          while(m_observations.size()>= 50000)
          {
            m_observations.peek();
          }
        }
      }
    }
    catch (Exception e)
    {
      LOG.error("Error: ", e);
    }
    return null;
  }

  private void sendData()
  {
    String ipAddress = m_properties.getProperty("ip.address");
    Integer port = Integer.parseInt(m_properties.getProperty("ip.port"));
    m_queryThreadExecutor.execute(new RemoteClientSaveWorker(m_observations, m_socket, ipAddress, port));
  }

  private static Properties loadProperties()
  {
    Properties properties = new Properties();
    InputStream stream = InsertTrigger.class.getClassLoader().getResourceAsStream("inserttrigger.properties");
    try
    {
      properties.load(stream);
    }
    catch (Exception e)
    {
      throw new RuntimeException(e);
    }
    finally
    {
      FileUtils.closeQuietly(stream);
    }
    LOG.info("loaded property file, inserttrigger.properties");
    return properties;
  }
}
