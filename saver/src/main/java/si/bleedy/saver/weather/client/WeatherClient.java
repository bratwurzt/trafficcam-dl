package si.bleedy.saver.weather.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import si.bleedy.saver.weather.pojos.WeatherDto;

/**
 * Created by bm on 3.05.2017.
 */
@Service
public class WeatherClient
{
  private static final Logger LOG = LoggerFactory.getLogger(WeatherClient.class);
  private final RestTemplate restTemplate;
   private int i = 0;
  public WeatherClient(RestTemplateBuilder restTemplateBuilder)
  {
    this.restTemplate = restTemplateBuilder.build();
  }

  public WeatherDto getWeatherData(float lon, float lat)
  {
    final String url = "http://opendata.si/vreme/report/?lat=" + lat + "&lon=" + lon;
    try
    {
      final WeatherDto forObject = this.restTemplate.getForObject(url, WeatherDto.class);
      if ("ok".equals(forObject.getStatus()))
      {
        return forObject;
      }
      LOG.error("Error calling " + url + ": status=" + forObject.getStatus() + ", description=" + forObject.getAdditionalProperties().values().iterator().next());
    }
    catch (RestClientException e)
    {
      if (i < 5)
      {
        if (e instanceof HttpStatusCodeException && HttpStatus.INTERNAL_SERVER_ERROR.equals(((HttpStatusCodeException)e).getStatusCode()))
        {
          i++;
          try
          {
            Thread.sleep(2000);
          }
          catch (InterruptedException ignored)
          {
          }
          return getWeatherData(lon, lat);
        }
        LOG.error("Error calling " + url + ": " + e.getLocalizedMessage());
      }
      else
      {
        LOG.error("Error calling " + url + " after " + i + " tries. Message: " + e.getLocalizedMessage());
        i = 0;
      }
    }
    return null;
  }
}
