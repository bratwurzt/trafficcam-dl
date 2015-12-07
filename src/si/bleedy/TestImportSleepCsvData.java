package si.bleedy;

import si.bleedy.runnable.SaveCsvRunnable;

/**
 * @author bratwurzt
 */
public class TestImportSleepCsvData
{
  public static void main(String[] args)
  {
    new Thread(new SaveCsvRunnable()).start();
  }
}
