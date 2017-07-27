package si.bleedy.runnable;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.joda.time.DateTime;
import si.bleedy.CounterData;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.sql.*;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.zip.GZIPInputStream;

/**
 * @author bratwurzt
 */
public abstract class SaveToDbRunnable implements Runnable
{
  final static String POSTGRES_DB_URL = "jdbc:postgresql://192.168.1.7:5432/counterkeyspace";
  final static String USERNAME = "bleedah";
  final static String PASSWORD = "password";

  private static final Logger LOG = LogManager.getLogger(SaveToDbRunnable.class);
  DateTime m_lastUpdate = null;
  final static Map<String, CounterData> COUNTER_MAP = new ConcurrentHashMap<>();
  final List<URL> urls = new CopyOnWriteArrayList<>();
  Connection connection = null;
  PreparedStatement statement;

  SaveToDbRunnable()
  {
  }

  SaveToDbRunnable(String urlString)
  {
    try
    {
      this.urls.add(new URL(urlString));
    }
    catch (MalformedURLException e)
    {
      throw new RuntimeException(e);
    }
  }

  protected void initDb() throws IOException, ClassNotFoundException, SQLException
  {
    Class.forName("org.postgresql.Driver");
    try
    {
      connection = DriverManager.getConnection(POSTGRES_DB_URL, USERNAME, PASSWORD);
      if (COUNTER_MAP.isEmpty())
      {
        statement = connection.prepareStatement(
            "SELECT id, code, ST_X(location), ST_Y(location) from counter;"
        );

        try (final ResultSet rs = statement.executeQuery())
        {
          while (rs.next())
          {
            final String code = rs.getString(2);
            COUNTER_MAP.put(code, new CounterData(rs.getLong(1), code, rs.getFloat(3), rs.getFloat(4)));
          }
        }
      }
    }
    finally
    {
      closeConnections();
    }
  }


  protected abstract void closeConnections() throws SQLException;

  protected abstract void processJson(JsonObject contents) throws SQLException;

  protected void initConnection() throws SQLException
  {
    if (connection == null || connection.isClosed())
    {
      connection = DriverManager.getConnection(POSTGRES_DB_URL, USERNAME, PASSWORD);
    }
  }

  protected abstract void executeBatch() throws SQLException;

  protected abstract long trySaving(JsonObject jsonObject) throws SQLException, InterruptedException;

  @Override
  public void run()
  {
    try
    {
      initDb();
      long millisToSleep = 1000;
      while (true)
      {
        for (final URL url : urls)
        {
          final HttpURLConnection connection = (HttpURLConnection) url.openConnection();
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
              millisToSleep = trySaving(reader.readObject());
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
        Thread.sleep(millisToSleep < 0 ? 180000 : millisToSleep);
      }
    }
    catch (Exception e)
    {
      LOG.error("Error: ", e);
    }
  }

  void executeBatchDbFriendly(JsonObject contents) throws SQLException
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
