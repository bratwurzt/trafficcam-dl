package si.bleedy.saver.client;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import si.bleedy.saver.pojos.Counter;

/**
 * Created by bm on 3.05.2017.
 */
@Service
public class CountersClient
{
  private final RestTemplate restTemplate;

  public CountersClient(RestTemplateBuilder restTemplateBuilder)
  {
    this.restTemplate = restTemplateBuilder.build();
  }

  public Counter getCounters()
  {
    return this.restTemplate.getForObject("http://opendata.si/promet/counters/", Counter.class);
  }
}
