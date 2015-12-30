package triggers;

import java.io.InputStream;
import java.nio.ByteBuffer;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.cassandra.config.CFMetaData;
import org.apache.cassandra.db.Cell;
import org.apache.cassandra.db.ColumnFamily;
import org.apache.cassandra.db.Mutation;
import org.apache.cassandra.db.composites.CellName;
import org.apache.cassandra.io.util.FileUtils;
import org.apache.cassandra.triggers.ITrigger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import data.PriorityBlockingDeque;
import eu.fistar.sdcs.pa.ZephyrProtos;

/**
 * @author DusanM
 */
public class InsertTrigger implements ITrigger
{
  private static final Logger LOG = LoggerFactory.getLogger(InsertTrigger.class);
  public static int BATCH_MILLIS = 1000;
  protected final PriorityBlockingDeque<ZephyrProtos.ObservationPB> m_observations;
  protected final Map<Long, Map<String, ZephyrProtos.ObservationPB.Builder>> m_map = new ConcurrentHashMap<>();
  private Properties m_properties = loadProperties();
  public static XORShiftRandom XOR_SHIFT_RANDOM = new XORShiftRandom();

  public InsertTrigger()
  {
    String ipAddress = m_properties.getProperty("ip.address");
    Integer port = Integer.parseInt(m_properties.getProperty("ip.port"));
    Integer dequeSize = Integer.parseInt(m_properties.getProperty("deque.size"));
    m_observations = new PriorityBlockingDeque<>(
        (Comparator<ZephyrProtos.ObservationPB>)
            (o1, o2) -> o1.getTime() > o2.getTime() ? -1 : o1.getTime() < o2.getTime() ? 1 : 0,
        dequeSize
    );
    new Thread(new RemoteClientSaveWorker(m_observations, ipAddress, port)).start();
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

        if (split.length == 2 && (columnName = split[1]) != null && columnName.length() > 0 && value != null)
        {
          if (!m_map.containsKey(key))
          {
            m_map.put(key, new ConcurrentHashMap<>());
          }

          if (!m_map.get(key).containsKey(localKey) || m_map.get(key).get(localKey) == null)
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

//          LOG.info("Cell localKey=" + localKey + ", name=" + name  + ", key=" + key + ", value=" + value);
          if (builder.hasName() && builder.hasTime() && builder.hasUnit() && builder.getValuesCount() > 0)
          {
//            LOG.info("Sending " + builder.getName() + ", " + builder.getUnit() + ", " + builder.getTime() + ", " + builder.getValues(0));
            m_map.get(key).remove(localKey);
            synchronized (m_observations)
            {
              m_observations.addLast(builder.build());
            }
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
