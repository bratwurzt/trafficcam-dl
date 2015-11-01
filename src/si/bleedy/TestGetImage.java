package si.bleedy;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

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
    ExecutorService m_threadExecutor = Executors.newCachedThreadPool();
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/Golovec/K24_Rudnik_SD_1.jpg"));
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/Maribor/IP_31_L14.1_Lendava.jpg"));
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/Maribor/IP_33_L15.1_Trimlini.jpg"));
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/Sentvid_Jug/cam13.jpg"));
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/Sentvid_Jug/cam12.jpg"));
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/Golovec/K19_Rondo_Tomacevo_SD_31.jpg"));
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/Golovec/K25_Malence_SD_2.jpg"));
  }
}
