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
    connection = DriverManager.getConnection("jdbc:postgresql://192.168.1.7:5432/counterkeyspace", "bleedah", "password");
    statement = connection.prepareStatement(
        "SELECT code, id from counter;"
    );

    try (final ResultSet rs = statement.executeQuery())
    {
      while (rs.next())
      {
        counterMap.put(rs.getString(1), rs.getLong(2));
      }
    }

    statement = connection.prepareStatement(
        "INSERT INTO counter_timeline(counter_id, time, avg_sec_gap, speed, cars_per_sec, geom) VALUES (?,?,?,?,?,ST_SetSRID(ST_MakePoint(?, ?), 4326));"
    );
  }

  @Override
  void insertNewCounter(String identity, double xCoordinates, double yCoordinates) throws SQLException
  {
    final PreparedStatement st = connection.prepareStatement(
        "INSERT INTO counter(id, code, location) VALUES (nextval('counter_seq'), ?, ST_SetSRID(ST_MakePoint(?, ?), 4326));"
    );
    st.setString(1, identity);
    st.setDouble(2, xCoordinates);
    st.setDouble(3, yCoordinates);
    st.executeUpdate();
  }

  @Override
  protected void saveToDb(Long counterId, DateTime timestamp, int speed, int carsPerHour, float avgSecGap, double xCoordinates, double yCoordinates) throws SQLException
  {
    int i = 1;
    statement.setLong(i++, counterId);
    statement.setTimestamp(i++, new Timestamp(timestamp.getMillis()));
    statement.setFloat(i++, avgSecGap);
    statement.setInt(i++, speed);
    statement.setInt(i++, carsPerHour);
    statement.setDouble(i++, xCoordinates);
    statement.setDouble(i++, yCoordinates);
    statement.addBatch();
  }

  @Override
  protected void executeBatch() throws SQLException
  {
    statement.executeBatch();
  }

  @Override
  protected void closeConnections() throws SQLException
  {
    connection.close();
  }
}
