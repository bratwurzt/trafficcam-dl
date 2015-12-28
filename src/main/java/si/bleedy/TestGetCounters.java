package si.bleedy;

import java.net.URL;

import org.apache.log4j.PropertyConfigurator;

import si.bleedy.runnable.GetCounterRunnable;

/**
 * @author bratwurzt
 */
public class TestGetCounters
{
  static
  {
    URL url = Thread.currentThread().getContextClassLoader().getResource("config/log4j.properties");
    PropertyConfigurator.configure(url);
  }
  public static void main(String[] args)
  {
    new Thread(new GetCounterRunnable()).start();
  }
}
