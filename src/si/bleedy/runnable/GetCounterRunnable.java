package si.bleedy.runnable;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringReader;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.zip.GZIPInputStream;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonNumber;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.json.JsonValue;
import javax.swing.text.NumberFormatter;

import com.datastax.driver.core.BoundStatement;
import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.PreparedStatement;
import com.datastax.driver.core.Session;
import org.apache.log4j.Logger;

/**
 * @author bratwurzt
 */
public class GetCounterRunnable implements Runnable
{
  private static final Logger LOG = Logger.getLogger(GetCounterRunnable.class);
  private BigDecimal m_lastUpdated = null;
  @Override
  public void run()
  {
    try
    {
      Cluster cluster = Cluster.builder().withPort(9042).addContactPoint("127.0.0.1").build();
      Session session = cluster.connect("counterkeyspace");
      PreparedStatement statement = session.prepare(
          "INSERT INTO counter_timeline(counter_id, timestamp, avg_sec_gap, speed, cars_per_sec, utilization) VALUES (?,?,?,?,?,?);"
      );
      BoundStatement boundStatement = new BoundStatement(statement);
      int i = 0;
      try
      {
        while (true)
        {
          URL url = new URL("http://opendata.si/promet/counters/");
          HttpURLConnection connection = (HttpURLConnection)url.openConnection();
          connection.addRequestProperty("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
          connection.addRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36");
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
              BigDecimal updated = ((JsonNumber)object.get("updated")).bigDecimalValue();
              if (!updated.equals(m_lastUpdated))
              {
                processJson(object, session, boundStatement);
                LOG.info(++i + ". inserted.");
                m_lastUpdated = updated;
              }
              Thread.sleep(180000);
            }
            catch (Exception e)
            {
              LOG.error(e);
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
        cluster.close();
      }
    }
    catch (IOException e)
    {
      e.printStackTrace();
    }
  }

  private void processJson(JsonObject object, Session session, BoundStatement statement)
  {
    for (JsonValue value : (JsonArray)((JsonObject)object.get("feed")).get("entry"))
    {
      JsonObject st = (JsonObject)value;
      JsonValue pasOpisJsonValue = st.get("stevci_pasOpis");
      String pasOpis = null;
      if (pasOpisJsonValue != null && !pasOpisJsonValue.toString().equals("null"))
      {
        pasOpis = st.getString("stevci_pasOpis");
      }
      String identity = st.getJsonNumber("stevci_geoY_wgs") + " " + st.getJsonNumber("stevci_geoX_wgs") + " " + st.getString("id");
      if (pasOpis != null)
      {
        identity += " " + pasOpis;
      }
      BigDecimal timestamp = st.getJsonNumber("updated").bigDecimalValue();
      int speed = st.getInt("stevci_hit");
      int carsPerHour = st.getInt("stevci_stev");
      float avgSecGap = Float.valueOf(st.getString("stevci_gap").replace(",", "."));
      float utilization = (float)(st.getJsonNumber("stevci_occ").doubleValue() / 10f);
      try
      {
        session.execute(statement.bind(identity, timestamp.longValue(), avgSecGap, speed, carsPerHour, utilization));
      }
      catch (Exception e)
      {
        e.printStackTrace();
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
