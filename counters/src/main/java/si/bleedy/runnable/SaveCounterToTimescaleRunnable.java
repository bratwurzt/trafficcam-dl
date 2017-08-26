package si.bleedy.runnable;

import org.joda.time.DateTime;
import si.bleedy.CounterData;

import javax.json.JsonNumber;
import javax.json.JsonObject;
import javax.json.JsonValue;
import java.sql.*;

/**
 * @author bratwurzt
 */
public class SaveCounterToTimescaleRunnable extends SaveToDbRunnable
{
  public SaveCounterToTimescaleRunnable()
  {
    super("http://opendata.si/promet/counters/");
  }

  protected void initConnection() throws SQLException
  {
    super.initConnection();
    if (statement.isClosed())
    {
      statement = connection.prepareStatement(
          "INSERT INTO counter_timeline(counter_id, time, avg_sec_gap, speed, cars_per_sec) VALUES (?,?,?,?,?);"
      );
    }
  }

  @Override
  protected long trySaving(final JsonObject jsonObject) throws SQLException, InterruptedException
  {
    final JsonObject contents = jsonObject.getJsonArray("Contents").getJsonObject(0);
    final DateTime expires = new DateTime(contents.getString("Expires"));
    if (!expires.equals(m_lastUpdate))
    {
      executeBatchDbFriendly(contents);
      m_lastUpdate = expires;
    }
    return expires.minus(DateTime.now().getMillis()).getMillis();
  }

  @Override
  protected void processJson(final JsonObject contents) throws SQLException
  {
    final DateTime modifiedTime = new DateTime(contents.getString("ModifiedTime"));
    for (final JsonValue value : contents.getJsonObject("Data").getJsonArray("Items"))
    {
      JsonObject st = (JsonObject) value;

      final JsonNumber y_wgs = st.getJsonNumber("y_wgs");
      final JsonNumber x_wgs = st.getJsonNumber("x_wgs");
      final double xCoordinates = x_wgs.doubleValue();
      final double yCoordinates = y_wgs.doubleValue();
      for (final JsonValue data : st.getJsonArray("Data"))
      {
        JsonObject node = (JsonObject) data;
        String identity = node.getString("Id");
        final JsonObject properties = node.getJsonObject("properties");
        String pasOpisJsonValue = properties.getString("stevci_smerOpis");
        String pasOpis = null;
        if (pasOpisJsonValue != null && !pasOpisJsonValue.toString().equals("null"))
        {
          pasOpis = properties.getString("stevci_smerOpis");
        }
        pasOpisJsonValue = properties.getString("stevci_pasOpis");
        if (pasOpisJsonValue != null && !pasOpisJsonValue.toString().equals("null"))
        {
          pasOpis = (pasOpis == null ? "" : " ") + properties.getString("stevci_pasOpis");
        }
        int speed = 0;
        int carsPerHour = 0;
        try
        {
          speed = Integer.parseInt(properties.getString("stevci_hit"));
        }
        catch (NumberFormatException ignored)
        {
        }
        try
        {
          carsPerHour = Integer.parseInt(properties.getString("stevci_stev"));
        }
        catch (NumberFormatException ignored)
        {
        }
        float avgSecGap = 999;
        try
        {
          avgSecGap = Float.valueOf(properties.getString("stevci_gap").replace(",", "."));
        }
        catch (NumberFormatException ignored)
        {
        }
        CounterData counter = COUNTER_MAP.get(identity);
        if (counter == null)
        {
          counter = insertNewCounter(identity, xCoordinates, yCoordinates, pasOpis);
          if (counter != null)
          {
            COUNTER_MAP.put(identity, counter);
          }
        }
        addBatch(counter.getId(), modifiedTime, speed, carsPerHour, avgSecGap);
      }
    }
  }

  private void addBatch(Long counterId, DateTime timestamp, int speed, int carsPerHour, float avgSecGap) throws SQLException
  {
    int i = 1;
    statement.setLong(i++, counterId);
    statement.setTimestamp(i++, new Timestamp(timestamp.getMillis()));
    statement.setFloat(i++, avgSecGap);
    statement.setInt(i++, speed);
    statement.setInt(i++, carsPerHour);
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

  private CounterData insertNewCounter(String identity, double xCoordinates, double yCoordinates, String pasOpis) throws SQLException
  {
    try (Connection con = DriverManager.getConnection(POSTGRES_DB_URL, USERNAME, PASSWORD))
    {
      PreparedStatement st = con.prepareStatement(
          "INSERT INTO counter(id, code, location, description) VALUES (nextval('counter_seq'), ?, ST_SetSRID(ST_MakePoint(?, ?), 4326), ?) RETURNING id;"
      );
      try
      {
        st.setString(1, identity);
        st.setDouble(2, xCoordinates);
        st.setDouble(3, yCoordinates);
        st.setString(4, pasOpis);
        st.execute();
        long counterId = 0;
        try(final ResultSet resultSet = st.getResultSet())
        {
          resultSet.next();
          counterId = resultSet.getLong(1);
        }
        st = con.prepareStatement(
            "SELECT id, code, ST_X(location), ST_Y(location) from counter where id = ?;"
        );
        st.setLong(1, counterId);
        st.execute();
        try (final ResultSet rs = st.executeQuery())
        {
          if (rs.next())
          {
            return new CounterData(rs.getLong(1), rs.getString(2), rs.getFloat(3), rs.getFloat(4));
          }
        }
      }
      finally
      {
        st.close();
      }
      return null;
    }
  }
}
