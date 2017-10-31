package si.bleedy.saver;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import si.bleedy.saver.weather.client.WeatherClient;
import si.bleedy.saver.weather.pojos.WeatherDto;

import java.io.IOException;

@RunWith(SpringRunner.class)
@SpringBootTest
public class SaverApplicationTests
{

  private WeatherClient weatherClient;

  @Autowired
  public void setWeatherClient(WeatherClient weatherClient)
  {
    this.weatherClient = weatherClient;
  }

  @Test
  public void contextLoads()
  {
  }

  @Test
  public void testNon200Reponses()
  {
    WeatherDto weatherData;
    try
    {
      while (true)
      {
        weatherData = weatherClient.getWeatherData(15.889921f, 46.43844f);
      }
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
  }

  @Test
  public void testTowJsoup()
  {
    try
    {
      Document doc = Jsoup.connect("http://www.lpt.si/parkirisca_pajki/parkirisca/zapuscena_vozila").get();
      System.out.println();
    }
    catch (IOException e)
    {
      System.out.println();
    }
  }
}
