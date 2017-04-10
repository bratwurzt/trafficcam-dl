package si.bleedy.runnable;

import org.apache.log4j.Logger;
import org.joda.time.DateTime;

import javax.json.*;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.sql.SQLException;
import java.util.zip.GZIPInputStream;

/**
 * @author bratwurzt
 */
public abstract class SaveCounterToDbRunnable implements Runnable
{
  private static final Logger LOG = Logger.getLogger(SaveCounterToDbRunnable.class);
  private DateTime m_lastExpired = null;

  protected abstract void initDb() throws IOException, ClassNotFoundException, SQLException;
  protected abstract void closeConnections() throws SQLException;
  protected abstract void saveToDb(String identity, DateTime timestamp, int speed, int carsPerHour, float avgSecGap) throws SQLException;

  @Override
  public void run()
  {
    try
    {
      initDb();
      int i = 0;
      try
      {
        while (true)
        {
          URL url = new URL("http://opendata.si/promet/counters/");
          HttpURLConnection connection = (HttpURLConnection)url.openConnection();
          connection.addRequestProperty("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
          connection.addRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36");
          connection.addRequestProperty("Host", url.getHost());
          connection.addRequestProperty("Referer", url.toString());
          connection.addRequestProperty("Accept-Encoding", "gzip, deflate, sdch");
          connection.addRequestProperty("Accept-Language", "en-US,en;q=0.8,sl;q=0.6,de;q=0.4");
          connection.addRequestProperty("Upgrade-Insecure-Requests", "1");
          connection.connect();
          try (InputStream is = connection.getInputStream())
          {
            String response = readResponse(is, connection);
            try (JsonReader reader = Json.createReader(new StringReader(response)))
            {
              JsonObject object = reader.readObject();
              final DateTime expires = new DateTime(object.getString("Expires"));
              if (!expires.equals(m_lastExpired))
              {
                processJson(object);
                LOG.info(++i + ". inserted.");
                m_lastExpired = expires;
              }
              final long millisToSleep = expires.minus(DateTime.now().getMillis()).getMillis();
              Thread.sleep(millisToSleep < 0 ? 180000 : millisToSleep);
            }
            catch (Exception e)
            {
              LOG.error(e);
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
            e.printStackTrace();
          }
        }
      }
      finally
      {
        closeConnections();
      }
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
  }

  private void processJson(JsonObject object) throws SQLException
  {
    final DateTime modifiedTime = new DateTime(object.getString("ModifiedTime"));
    for (JsonValue value : object.getJsonArray("Contents").getJsonObject(0).getJsonObject("Data").getJsonArray("Items"))
    {
      JsonObject st = (JsonObject)value;

      final JsonNumber y_wgs = st.getJsonNumber("y_wgs");
      final JsonNumber x_wgs = st.getJsonNumber("x_wgs");
      for (JsonValue data : st.getJsonArray("Data"))
      {
        JsonObject node = (JsonObject) data;
        String identity = y_wgs + "_" + x_wgs + "_" + node.getString("Id");
        final JsonObject properties = node.getJsonObject("properties");
        String pasOpisJsonValue = properties.getString("stevci_pasOpis");
        String pasOpis = null;
        if (pasOpisJsonValue != null && !pasOpisJsonValue.toString().equals("null"))
        {
          pasOpis = properties.getString("stevci_pasOpis");
        }
        if (pasOpis != null)
        {
          identity += "_" + pasOpis;
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
        saveToDb(identity, modifiedTime, speed, carsPerHour, avgSecGap);
      }
    }
  }


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
