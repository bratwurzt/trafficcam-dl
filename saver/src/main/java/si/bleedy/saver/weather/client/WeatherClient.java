package si.bleedy.saver.weather.client;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import si.bleedy.saver.weather.pojos.WeatherDto;

/**
 * Created by bm on 3.05.2017.
 */
@Service
public class WeatherClient
{
  private final RestTemplate restTemplate;

  public WeatherClient(RestTemplateBuilder restTemplateBuilder)
  {
    this.restTemplate = restTemplateBuilder.build();
  }

  public WeatherDto getWeatherData(float lon, float lat)
  {
    return this.restTemplate.getForObject("http://opendata.si/vreme/report/?lat=" + lat + "&lon=" + lon, WeatherDto.class);
  }
}
