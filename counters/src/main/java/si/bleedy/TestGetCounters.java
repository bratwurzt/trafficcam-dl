package si.bleedy;

import si.bleedy.runnable.SaveCounterToTimescaleRunnable;

/**
 * @author bratwurzt
 */
public class TestGetCounters
{
  public static void main(String[] args)
  {
    new Thread(new SaveCounterToTimescaleRunnable()).start();
  }
}
