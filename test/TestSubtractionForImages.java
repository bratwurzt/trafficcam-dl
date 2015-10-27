import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import javax.imageio.ImageIO;

import com.atul.JavaOpenCV.Imshow;
import org.opencv.core.Core;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.core.Size;
import org.opencv.highgui.Highgui;
import org.opencv.imgproc.Imgproc;
import org.opencv.video.BackgroundSubtractorMOG2;

/**
 * @author DusanM
 */
public class TestSubtractionForImages
{
  static
  {
    System.loadLibrary("/libs/" + Core.NATIVE_LIBRARY_NAME);
  }

  static final FilenameFilter IMAGE_FILTER = new FilenameFilter()
  {
    @Override
    public boolean accept(final File dir, final String name)
    {
      return name.endsWith(".jpg") || name.endsWith(".jpeg");
    }
  };

  public static void main(String[] args)
  {
    File dir = new File("data/");
    Mat kernel = Imgproc.getStructuringElement(Imgproc.MORPH_ELLIPSE, new Size(2, 2));
    BackgroundSubtractorMOG2 bs = new BackgroundSubtractorMOG2(30, 32, true);
    Mat fgMaskMOG = new Mat();
    Mat gray = new Mat();
    Imshow im = new Imshow("Current");
    Imshow imb = new Imshow("Background");
    if (dir.isDirectory())
    {
      for (File image : dir.listFiles(IMAGE_FILTER))
      {
        BufferedImage img;

        try
        {
          img = ImageIO.read(image);
          ByteArrayOutputStream baos = new ByteArrayOutputStream();
          ImageIO.write(img, "jpg", baos);
          byte[] imageInByte = baos.toByteArray();
          Mat mat = Highgui.imdecode(new MatOfByte(imageInByte), Highgui.IMREAD_UNCHANGED);
          Imgproc.cvtColor(mat, gray, Imgproc.COLOR_RGB2GRAY);
          bs.apply(gray, fgMaskMOG);
          Imgproc.threshold(fgMaskMOG, fgMaskMOG, 254, 255, Imgproc.THRESH_BINARY);
          //Imgproc.morphologyEx(fgMaskMOG, fgMaskMOG, Imgproc.MORPH_OPEN, kernel);
          im.showImage(gray);
          imb.showImage(fgMaskMOG);
          Thread.sleep(100);
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
  }
}
