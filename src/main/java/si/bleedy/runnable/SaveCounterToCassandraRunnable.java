package si.bleedy.runnable;

import java.math.BigDecimal;

import com.datastax.driver.core.BoundStatement;
import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.PreparedStatement;
import com.datastax.driver.core.Session;
import org.apache.log4j.Logger;
import org.joda.time.DateTime;

/**
 * @author bratwurzt
 */
public class SaveCounterToCassandraRunnable extends SaveCounterToDbRunnable
{
  private static final Logger LOG = Logger.getLogger(SaveCounterToCassandraRunnable.class);
  private BigDecimal m_lastUpdated = null;
  private Cluster cluster;
  private Session session;
  private BoundStatement boundStatement;

  @Override
  protected void initDb()
  {
    cluster = Cluster.builder().withPort(9042).addContactPoint("192.168.1.2").build();
    session = cluster.connect("counterkeyspace");
    PreparedStatement statement = session.prepare(
        "INSERT INTO counter_timeline(counter_id, time, avg_sec_gap, speed, cars_per_sec) VALUES (?,?,?,?,?);"
    );
    boundStatement = new BoundStatement(statement);
  }

  @Override
  protected void saveToDb(String identity, DateTime timestamp, int speed, int carsPerHour, float avgSecGap)
  {
    try
    {
      session.execute(boundStatement.bind(identity, timestamp.getMillis(), avgSecGap, speed, carsPerHour));
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
  }

  @Override
  protected void closeConnections()
  {
    cluster.close();
  }
}
