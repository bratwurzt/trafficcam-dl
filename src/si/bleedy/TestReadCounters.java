package si.bleedy;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.zip.GZIPInputStream;

/**
 * @author bratwurzt
 */
public class TestReadCounters
{
  public static void main(String[] args)
  {
    try
    {
      URL url = new URL("http://www.promet.si/rwproxy/RWProxy.ashx?method=GET&rproxytype=json&remoteUrl=http%3A//promet/counters_si");
      HttpURLConnection connection = (HttpURLConnection)url.openConnection();
      connection.addRequestProperty("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
      connection.addRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36");
      connection.addRequestProperty("Host", url.getHost());
      connection.addRequestProperty("Referer", url.toString());
      connection.addRequestProperty("Accept-Encoding", "gzip, deflate, sdch");
      connection.addRequestProperty("Accept-Language", "en-US,en;q=0.8,sl;q=0.6,de;q=0.4");
      connection.addRequestProperty("Upgrade-Insecure-Requests", "1");
      connection.connect();
      InputStream is = connection.getInputStream();
      String response = readResponse(is, connection);
      response = response.replaceAll("^[\\s]+", response);
      StringBuilder b = new StringBuilder();
      for (int i = 0; i < response.length(); i += 2)
      {
        b.append((char)(255 - response.charAt(i)));
      }
      if (response.length() > 0 && response.length() % 2 == 1)
      {
        response = response.substring(0, response.length() - 1);
      }
      for (int i = response.length() - 1; i >= 0; i -= 2)
      {
        b.append((char)(255 - response.charAt(i)));
      }
      System.out.println();
    }
    catch (IOException e)
    {
      e.printStackTrace();
    }
  }

  private static byte[] readStream(InputStream stream) throws IOException
  {
    // Copy content of the image to byte-array
    ByteArrayOutputStream buffer = new ByteArrayOutputStream();
    int nRead;
    byte[] data = new byte[16384];

    while ((nRead = stream.read(data, 0, data.length)) != -1)
    {
      buffer.write(data, 0, nRead);
    }

    buffer.flush();
    byte[] temporaryImageInMemory = buffer.toByteArray();
    buffer.close();
    stream.close();
    return temporaryImageInMemory;
  }


  private static String readResponse(InputStream ins, HttpURLConnection connection) throws IOException
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

  private static String getCharSetFromConnection(URLConnection connection)
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
