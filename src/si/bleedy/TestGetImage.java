package si.bleedy;

import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import eu.fistar.sdcs.runnable.GetImageRunnable;
import org.apache.log4j.PropertyConfigurator;
import org.opencv.core.Core;

/**
 * @author bratwurzt
 */
public class TestGetImage
{
  static
  {
    System.loadLibrary("/libs/" + Core.NATIVE_LIBRARY_NAME);
    initLogging();
  }

  public static void main(String[] args)
  {
    ExecutorService m_threadExecutor = Executors.newCachedThreadPool();
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/Golovec/K24_Rudnik_SD_1.jpg"));
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/Maribor/IP_31_L14.1_Lendava.jpg"));
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/Maribor/IP_33_L15.1_Trimlini.jpg"));
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/Sentvid_Jug/cam12.jpg"));
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/Sentvid_Jug/cam13.jpg"));
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/Sentvid_Jug/cam14.jpg"));
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/Golovec/K19_Rondo_Tomacevo_SD_31.jpg"));
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/ljubljana/K06_Vodnikova.jpg"));
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/Golovec/K29_Leskovskova_11.jpg"));
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/Golovec/K30_Leskovskova_12.jpg"));
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/Golovec/K23_Smartinska_SD.jpg"));
    m_threadExecutor.execute(new GetImageRunnable("http://kamere.dars.si/kamere/Golovec/K12_Zadobrova_Sneberje_6.jpg"));
  }

  public static void initLogging()
  {
    URL url = Thread.currentThread().getContextClassLoader().getResource("config/log4j.properties");
    PropertyConfigurator.configure(url);
  }
}
