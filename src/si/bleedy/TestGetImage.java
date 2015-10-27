package si.bleedy;

import org.opencv.core.Core;
import si.bleedy.runnable.GetImageRunnable;

/**
 * @author DusanM
 */
public class TestGetImage
{
  static
  {
    System.loadLibrary("/libs/" + Core.NATIVE_LIBRARY_NAME);
  }

  public static void main(String[] args)
  {
    new Thread(
        new GetImageRunnable("http://kamere.dars.si/kamere/Golovec/K24_Rudnik_SD_1.jpg")
    ).start();
  }
}
