package si.bleedy.runnable;

import org.joda.time.DateTime;

import java.io.IOException;
import java.sql.*;

/**
 * @author bratwurzt
 */
public class SaveCounterToTimescaleRunnable extends SaveCounterToDbRunnable
{
  private Connection connection = null;
  private PreparedStatement statement;

  @Override
  protected void initDb() throws IOException, ClassNotFoundException, SQLException
  {
    Class.forName("org.postgresql.Driver");
    connection = DriverManager.getConnection("jdbc:postgresql://192.168.1.7:5432/counterkeyspace", "bleedah", "mininova3");
    statement = connection.prepareStatement(
        "INSERT INTO counter_timeline(counter_id, time, avg_sec_gap, speed, cars_per_sec) VALUES (?,?,?,?,?);"
    );
  }

  @Override
  protected void saveToDb(String identity, DateTime timestamp, int speed, int carsPerHour, float avgSecGap) throws SQLException
  {
    int i = 1;
    statement.setString(i++, identity);
    statement.setTimestamp(i++, new Timestamp(timestamp.getMillis()));
    statement.setFloat(i++, avgSecGap);
    statement.setInt(i++, speed);
    statement.setInt(i++, carsPerHour);
    statement.execute();
  }

  @Override
  protected void closeConnections() throws SQLException
  {
    connection.close();
  }
}
