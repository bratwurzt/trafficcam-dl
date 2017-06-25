package si.bleedy.runnable;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.joda.time.DateTime;

import javax.json.*;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.GZIPInputStream;

/**
 * @author bratwurzt
 */
public abstract class SaveCounterToDbRunnable implements Runnable
{
  private static final Logger LOG = LogManager.getLogger(SaveCounterToDbRunnable.class);
  private DateTime m_lastExpired = null;
  final Map<String, Long> counterMap = new HashMap<>();

  protected abstract void initDb() throws IOException, ClassNotFoundException, SQLException;

  protected abstract void closeConnections() throws SQLException;

  protected abstract void addBatch(Long counterId, DateTime timestamp, int speed, int carsPerHour, float avgSecGap) throws SQLException;

  protected abstract void initConnection() throws SQLException;

  protected abstract void executeBatch() throws SQLException;

  @Override
  public void run()
  {
    try
    {
      initDb();
      int i = 0;
      while (true)
      {
        URL url = new URL("http://opendata.si/promet/counters/");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.addRequestProperty("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
        connection.addRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36");
        connection.addRequestProperty("Host", url.getHost());
        connection.addRequestProperty("Referer", url.toString());
        connection.addRequestProperty("Accept-Encoding", "gzip, deflate, sdch");
        connection.addRequestProperty("Accept-Language", "en-US,en;q=0.8,sl;q=0.6,de;q=0.4");
        connection.addRequestProperty("Upgrade-Insecure-Requests", "1");
        connection.connect();
        try (final InputStream is = connection.getInputStream())
        {
          final String response = readResponse(is, connection);
          try (final JsonReader reader = Json.createReader(new StringReader(response)))
          {
            final JsonObject jsonObject = reader.readObject();
            final JsonObject contents = jsonObject.getJsonArray("Contents").getJsonObject(0);
            final DateTime expires = new DateTime(contents.getString("Expires"));
            if (!expires.equals(m_lastExpired))
            {
              executeBatchDbFriendly(contents);
              LOG.info(++i + ". inserted.");
              m_lastExpired = expires;
            }
            final long millisToSleep = expires.minus(DateTime.now().getMillis()).getMillis();
            Thread.sleep(millisToSleep < 0 ? 180000 : millisToSleep);
          }
          catch (final Exception e)
          {
            LOG.error("Error: ", e);
            try
            {
              Thread.sleep(20000);
            }
            catch (InterruptedException ignored)
            {
            }
          }
        }
        catch (IOException e)
        {
          LOG.error("Error: ", e);
        }
      }
    }
    catch (Exception e)
    {
      LOG.error("Error: ", e);
    }
  }

  private void processJson(final JsonObject contents) throws SQLException
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
        Long counterId = counterMap.get(identity);
        if (counterId == null)
        {
          counterId = insertNewCounter(identity, xCoordinates, yCoordinates, pasOpis);
          counterMap.put(identity, counterId);
        }
        addBatch(counterId, modifiedTime, speed, carsPerHour, avgSecGap);
      }
    }
  }

  private void executeBatchDbFriendly(JsonObject contents) throws SQLException
  {
    initConnection();
    try
    {
      processJson(contents);
      executeBatch();
    }
    finally
    {
      closeConnections();
    }
  }

  abstract Long insertNewCounter(String identity, double xCoordinates, double yCoordinates, String pasOpis) throws SQLException;

  private String readResponse(InputStream ins, HttpURLConnection connection) throws IOException
  {
    Reader reader;
    StringWriter writer;
    String encoding = connection.getHeaderField("Content-Encoding");
    if (encoding != null && encoding.equals("gzip"))
    {
      ins = new GZIPInputStream(ins);
    }

    reader = new InputStreamReader(ins, getCharSetFromConnection(connection));
    writer = new StringWriter();

    try
    {
      char[] buffer = new char[4096];
      for (int length; (length = reader.read(buffer)) > 0; )
      {
        writer.write(buffer, 0, length);
      }
    }
    finally
    {
      writer.close();
      reader.close();
    }
    return writer.toString();
  }

  private String getCharSetFromConnection(URLConnection connection)
  {
    String contentType = connection.getHeaderField("Content-Type");

    String charset = null;
    if (contentType != null)
    {
      String[] values = contentType.split(";");

      for (String value : values)
      {
        value = value.trim();

        if (value.toLowerCase().startsWith("charset="))
        {
          charset = value.substring("charset=".length());
        }
      }
    }

    if (charset == null)
    {
      charset = "UTF-8";
    }
    return charset;
  }

}
