package si.bleedy;

import si.bleedy.runnable.SaveWeatherToTimescaleRunnable;

/**
 * @author bratwurzt
 */
public class TestGetWeather
{
  public static void main(String[] args)
  {
    new Thread(new SaveWeatherToTimescaleRunnable()).start();
  }
}
