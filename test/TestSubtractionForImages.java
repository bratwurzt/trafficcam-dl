import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.ArrayList;
import javax.imageio.ImageIO;

import com.atul.JavaOpenCV.Imshow;
import org.opencv.core.Core;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.core.MatOfPoint;
import org.opencv.core.Point;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.highgui.Highgui;
import org.opencv.imgproc.Imgproc;
import org.opencv.video.BackgroundSubtractorMOG;
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
    Mat kernel = Imgproc.getStructuringElement(Imgproc.MORPH_ELLIPSE, new Size(4, 4));
    Mat dilationKernel = Imgproc.getStructuringElement(Imgproc.MORPH_DILATE, new Size(2, 2));
    //BackgroundSubtractorMOG2 bs = new BackgroundSubtractorMOG2(15, 32, false);
    BackgroundSubtractorMOG bs = new BackgroundSubtractorMOG(15, 2, 0.6, 0);
    Mat fgMaskMOG = new Mat();
    Mat fgMaskMOGShow = new Mat();
    Mat gray = new Mat();
    Imshow im = new Imshow("Current");
    Imshow imb = new Imshow("Background");
    //Imshow imc = new Imshow("Contours");
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
          //Imgproc.blur(gray, gray, new Size(5, 5));
          bs.apply(gray, fgMaskMOGShow, 0.05);
          //Imgproc.blur(fgMaskMOG, fgMaskMOGShow, new Size(10, 10));
          //Imgproc.threshold(fgMaskMOG, fgMaskMOGShow, 100, 255, Imgproc.THRESH_BINARY);
          Imgproc.morphologyEx(fgMaskMOGShow, fgMaskMOGShow, Imgproc.MORPH_OPEN, kernel);
          //Imgproc.erode(fgMaskMOGShow, fgMaskMOGShow, dilationKernel);
          //ArrayList<MatOfPoint> contours = new ArrayList<>();
          //Mat hierarchy = new Mat();
          //Imgproc.findContours(fgMaskMOGShow, contours, hierarchy, Imgproc.RETR_TREE, Imgproc.CHAIN_APPROX_SIMPLE);
          //Mat c = Mat.zeros(fgMaskMOGShow.size(), fgMaskMOGShow.type());
          //for (int i = 0; i < contours.size(); i++)
          //{
          //  Imgproc.drawContours(c, contours, i, new Scalar(255, 255, 255), 2, 7, hierarchy, 0, new Point());
          //}
          im.showImage(mat);
          //imc.showImage(c);
          imb.showImage(fgMaskMOGShow);
          Thread.sleep(200);
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
