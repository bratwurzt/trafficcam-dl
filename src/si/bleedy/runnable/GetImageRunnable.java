package si.bleedy.runnable;

import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;

import javax.imageio.ImageIO;

import com.atul.JavaOpenCV.Imshow;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import org.opencv.video.BackgroundSubtractorMOG2;
import org.opencv.video.Video;

/**
 * @author DusanM
 */
public class GetImageRunnable implements Runnable
{
  private SimpleDateFormat m_formatter = new SimpleDateFormat("yyyyMMddHHmmss");
  private String m_address;
  private BufferedImage m_temporaryImageInMemory;
  private Long m_lastChange, m_avgMillis = 1000L;
  private byte[] m_oldBytes;

  public GetImageRunnable(String address)
  {
    m_address = address;
  }

  @Override
  public void run()
  {
    try
    {
      URL url = new URL(m_address);
      String filename = m_address.substring(m_address.lastIndexOf("/") + 1, m_address.indexOf(".jp"));
      //BackgroundSubtractorMOG2 bs = Video.createBackgroundSubtractorMOG2(15, 32, false);
      //Mat fgMaskMOG = new Mat();
      //Mat gray = new Mat();
      //Imshow im = new Imshow("Current");
      //Imshow imb = new Imshow("Background");
      File directory = new File("data/" + filename + "/");
      if (!directory.exists())
      {
        directory.mkdir();
      }
      while (true)
      {
        try
        {
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
          //BufferedImage bufferedImage = ImageIO.read(is);
          byte[] currentBytes = readStream(is);//((DataBufferByte) bufferedImage.getRaster().getDataBuffer()).getData();
          //m_oldBytes = m_temporaryImageInMemory == null ? new byte[0] : ((DataBufferByte) m_temporaryImageInMemory.getRaster().getDataBuffer()).getData();
          if (!Arrays.equals(currentBytes, m_oldBytes))
          {
            //File file = new File("data/" + filename + "_" + m_formatter.format(new Date(System.currentTimeMillis())) + ".jpg");
            //ImageIO.write(bufferedImage, "JPEG", file);
            //m_temporaryImageInMemory = bufferedImage;
            ByteArrayInputStream byteStream = new ByteArrayInputStream(currentBytes);
            m_temporaryImageInMemory = ImageIO.read(byteStream);

            File file = new File(directory, m_formatter.format(new Date(System.currentTimeMillis())) + ".jpg");
            ImageIO.write(m_temporaryImageInMemory, "JPEG", file);
            //Mat mat = Imgcodecs.imdecode(new MatOfByte(currentBytes), Imgcodecs.IMREAD_UNCHANGED);
            //Imgproc.cvtColor(mat, gray, Imgproc.COLOR_RGB2GRAY);
            //bs.apply(gray, fgMaskMOG);
            //Metadata metadata = ImageMetadataReader.readMetadata(new ByteArrayInputStream(m_temporaryImageInMemory));
            //Imshow im = new Imshow("Title");
            //im.showImage(gray);
            //imb.showImage(fgMaskMOG);
            if (m_lastChange != null)
            {
              long millis = System.currentTimeMillis() - m_lastChange;
              m_avgMillis += millis;
              m_avgMillis /= 2;
              System.out.println("Last change for " + filename + " happened " + parseReadableTime(millis, true) + " ago.");
            }
            m_lastChange = System.currentTimeMillis();
            m_oldBytes = currentBytes;
          }
          else
          {
            //System.out.println("Still the same!");
          }
          Thread.sleep(m_avgMillis);
        }
        catch (IOException e)
        {
          e.printStackTrace();
        }
        catch (InterruptedException e)
        {
          e.printStackTrace();
        }
      }
    }
    catch (MalformedURLException e)
    {
      e.printStackTrace();
    }
  }

  protected static String getCharSetFromConnection(URLConnection connection)
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

  private static Mat readInputStreamIntoMat(InputStream inputStream) throws IOException
  {
    // Read into byte-array
    byte[] temporaryImageInMemory = readStream(inputStream);

    // Decode into mat. Use any IMREAD_ option that describes your image appropriately
    Mat outputImage = Imgcodecs.imdecode(new MatOfByte(temporaryImageInMemory), Imgcodecs.IMREAD_UNCHANGED);

    return outputImage;
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

  public static String parseReadableTime(Long millis, boolean seconds)
  {
    String time;
    long diffSeconds = millis / 1000 % 60;
    long diffMinutes = millis / (60 * 1000) % 60;
    long diffHours = millis / (60 * 60 * 1000) % 24;
    long diffInDays = millis / (1000 * 60 * 60 * 24) % 7;
    long diffInWeeks = millis / (1000 * 60 * 60 * 24 * 7);
    time = (diffInWeeks > 0 ? diffInWeeks + (diffInWeeks == 1 ? "week " : "weeks ") : "")
        + (diffInDays > 0 ? diffInDays + "day " : "")
        + (diffHours > 0 ? diffHours + "h " : "") + diffMinutes + "min";
    if (seconds)
    {
      time += " " + diffSeconds + "s";
    }
    return time;
  }
}
