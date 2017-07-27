package si.bleedy.runnable;

import org.joda.time.DateTime;

import javax.json.JsonObject;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author bratwurzt
 */
public class SaveWeatherToTimescaleRunnable extends SaveToDbRunnable
{
  private final String url = "http://opendata.si/vreme/report/?lat=";

  public SaveWeatherToTimescaleRunnable()
  {
  }

  @Override
  protected void initDb() throws IOException, ClassNotFoundException, SQLException
  {
    super.initDb();
    final List<URL> urls = COUNTER_MAP.values().stream()
        .map(c -> {
          try
          {
            return new URL(url + c.getLat() + "&lon=" + c.getLon());
          }
          catch (MalformedURLException e)
          {
            e.printStackTrace();
          }
          return null;
        })
        .collect(Collectors.toList());
    this.urls.addAll(urls);
  }

  @Override
  protected void initConnection() throws SQLException
  {
    super.initConnection();
    if (statement.isClosed())
    {
      statement = connection.prepareStatement(
          "INSERT INTO weather_timeline(counter_id, time, rain_level, rain_mmph) VALUES (?,?,?,?);"
      );
    }
  }

  @Override
  protected void processJson(JsonObject contents) throws SQLException
  {
    final int rainLevel = contents.getJsonNumber("rain_level").intValue();
    final float rainMmph = (float) contents.getJsonNumber("rain_mmph").doubleValue();
    int i = 1;
    statement.setLong(i++, counterId);
    statement.setTimestamp(i++, new Timestamp(timestamp.getMillis()));
    statement.setFloat(i++, avgSecGap);
    statement.setInt(i++, speed);
    statement.setInt(i++, carsPerHour);
    statement.addBatch();
  }

  @Override
  protected long trySaving(JsonObject jsonObject) throws SQLException, InterruptedException
  {
    final JsonObject contents = jsonObject.getJsonObject("radar");

    final DateTime lastUpdated = new DateTime(contents.getJsonNumber("updated").longValue() * 1000);
    if (!lastUpdated.equals(m_lastUpdate))
    {
      executeBatchDbFriendly(contents);
      m_lastUpdate = lastUpdated;
    }
    return 10000;
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
