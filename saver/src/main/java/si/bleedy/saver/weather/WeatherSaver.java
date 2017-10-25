package si.bleedy.saver.weather;

import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import si.bleedy.saver.counter.data.CounterData;
import si.bleedy.saver.counter.service.CacheCounterRepository;
import si.bleedy.saver.weather.client.WeatherClient;
import si.bleedy.saver.weather.data.WeatherTimeline;
import si.bleedy.saver.weather.pojos.WeatherDto;
import si.bleedy.saver.weather.service.WeatherTimelineRepository;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author bratwurzt
 */
@Component
public class WeatherSaver
{
  private static final Logger LOG = LoggerFactory.getLogger(WeatherSaver.class);
  private final Map<String, DateTime> lastModified;

  private final WeatherClient weatherClient;
  private final WeatherTimelineRepository weatherTimelineRepository;
  private final CacheCounterRepository cacheCounterRepository;

  public WeatherSaver(WeatherClient weatherClient, WeatherTimelineRepository weatherTimelineRepository, CacheCounterRepository cacheCounterRepository)
  {
    this.weatherClient = weatherClient;
    this.weatherTimelineRepository = weatherTimelineRepository;
    this.cacheCounterRepository = cacheCounterRepository;
    lastModified = new ConcurrentHashMap<>();
  }

  @Scheduled(fixedRate = 180000)
  public void saveWeatherData()
  {
    try
    {
      short i = 0;
      Long lastChange = System.currentTimeMillis();
      for (CounterData c : cacheCounterRepository.findAll())
      {
        final WeatherDto weather = weatherClient.getWeatherData(c.getLon(), c.getLat());
        final DateTime modifiedTime = weather.getRadar().getUpdated();
        if (!modifiedTime.equals(lastModified.get(c.getCode())))
        {
          weatherTimelineRepository.save(
              new WeatherTimeline(
                  modifiedTime,
                  c,
                  weather.getHailprob().getHailLevel(),
                  weather.getRadar().getRainMmph()
              )
          );
          i++;
          lastModified.put(c.getCode(), modifiedTime);
        }
      }
      long millis = System.currentTimeMillis() - lastChange;
      if (i > 0)
      {
        LOG.debug("Saved " + i + " of weather data in " + millis + "ms");
      }
    }
    catch (Exception e)
    {
      LOG.error("Error: ", e);
    }
  }
}
