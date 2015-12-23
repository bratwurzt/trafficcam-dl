package triggers;

import java.io.InputStream;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.util.Collection;
import java.util.Properties;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;

import org.apache.cassandra.config.CFMetaData;
import org.apache.cassandra.db.Cell;
import org.apache.cassandra.db.ColumnFamily;
import org.apache.cassandra.db.Mutation;
import org.apache.cassandra.io.util.FileUtils;
import org.apache.cassandra.triggers.ITrigger;

import eu.fistar.sdcs.pa.ZephyrProtos;

/**
 * @author DusanM
 */
public class InsertTrigger implements ITrigger
{
  public static int BATCH_TIME = 2000;
  protected final BlockingQueue<ZephyrProtos.ObservationPB> m_observations;
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
    CFMetaData cfm = update.metadata();
//    ZephyrProtos.ObservationsPB.Builder builder = ZephyrProtos.ObservationsPB.newBuilder();
    ZephyrProtos.ObservationPB.Builder builder = ZephyrProtos.ObservationPB.newBuilder();
//    builder.addObservations(
    builder1
        .setName(obs.getPropertyName())
        .setUnit(obs.getMeasurementUnit())
        .setTime(obs.getPhenomenonTime())
        .setDuration((int)obs.getDuration())
        .addAllValues(obs.getValues())
//                );
    for (Cell cell : update)
    {
      if (cell.value().remaining() > 0)
      {
        String name = cfm.comparator.getString(cell.name());
        String value = cfm.getValueValidator(cell.name()).getString(cell.value());
        switch (name)
        {
          case "name":
            builder.setName(value);
            break;
          case "unit":
            builder.setUnit(value);
            break;
          case "value":
            builder.setValues(0, value);
            break;
          case "timestamp":
            break;

        }
      }
    }
    if (System.currentTimeMillis() - BATCH_TIME > m_lastTime)
    {
      saveData();
      m_lastTime = System.currentTimeMillis();
    }
    return null;
  }

  private void saveData()
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
//      logger.info("loaded property file, InvertedIndex.properties");
    return properties;
  }
}
