package si.bleedy;

import si.bleedy.runnable.GetCounterRunnable;

/**
 * @author bratwurzt
 */
public class TestGetCounters
{
  public static void main(String[] args)
  {
    new Thread(new GetCounterRunnable()).start();
  }
}
