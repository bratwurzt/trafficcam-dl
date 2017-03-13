package si.bleedy;

import org.apache.log4j.Logger;

import javax.json.*;
import java.io.*;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.Socket;
import java.net.URL;
import java.net.URLConnection;
import java.time.Instant;
import java.util.Map;
import java.util.zip.GZIPInputStream;

/**
 * @author bratwurzt
 */
public class GetCountersRunnable implements Runnable
{
  private static final Logger LOG = Logger.getLogger(GetCountersRunnable.class);
  private BigDecimal lastUpdated = null;
  private Socket socket;
  private String hostname;
  private int port;

  public GetCountersRunnable(String hostname, int port)
  {
    this.hostname = hostname;
    this.port = port;
  }

  @Override
  public void run()
  {
    try
    {
      int i = 0;
      while (true)
      {
        URL url = new URL("http://opendata.si/promet/counters/");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.addRequestProperty("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
        connection.addRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36");
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
            BigDecimal updated = ((JsonNumber) object.get("updated")).bigDecimalValue();
            if (!updated.equals(lastUpdated))
            {
              String timestampISO8601 = Instant.ofEpochSecond(updated.longValue()).toString();
              sendJson(object, timestampISO8601);
              LOG.info(++i + ". sent.");
              lastUpdated = updated;
            }
          }
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
        Thread.sleep(180000);
      }
    }
    catch (IOException | InterruptedException e)
    {
      e.printStackTrace();
    }
  }

  private void sendJson(JsonObject object, String timestampISO8601) throws IOException
  {
    socket = new Socket(hostname, port);
    try (BufferedOutputStream bos = new BufferedOutputStream(socket.getOutputStream()))
    {
      try (OutputStreamWriter osw = new OutputStreamWriter(bos, "UTF-8"))
      {
        for (JsonValue value : (JsonArray) ((JsonObject) object.get("feed")).get("entry"))
        {
          JsonObject st = (JsonObject) value;
          JsonObject builtJsonObject = jsonObjectToBuilder(st)
              .add("@timestamp", timestampISO8601)
              .add("@version", 1)
              .build();

          osw.write(builtJsonObject.toString() + System.getProperty("line.separator"));
        }
        osw.flush();
      }
    }
  }

  private JsonObjectBuilder jsonObjectToBuilder(JsonObject st)
  {
    JsonObjectBuilder job = Json.createObjectBuilder();

    for (Map.Entry<String, JsonValue> entry : st.entrySet())
    {
      if ("stevci_gap".equals(entry.getKey()))
      {
        String originalString = entry.getValue().toString();
        String replacedString = "\"999,9\"".equals(originalString) ? "0" : originalString.replace(",", ".").replaceAll("\"", "");
        job.add(entry.getKey(),  Float.valueOf(replacedString));
      }
      else if ("stevci_occ".equals(entry.getKey()))
      {
        float utilization = (float)(st.getJsonNumber("stevci_occ").doubleValue() / 10f);
        job.add(entry.getKey(),  utilization);
      }
      else
      {
        job.add(entry.getKey(), entry.getValue());
      }
    }

    return job;
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

  public static void main(String[] args)
  {
    if (args.length < 2)
    {
      System.out.println("Usage: GetCountersRunnable localhost 9191");
      System.exit(1);
    }
    new Thread(new GetCountersRunnable(args[0], Integer.parseInt(args[1]))).start();
  }
}
