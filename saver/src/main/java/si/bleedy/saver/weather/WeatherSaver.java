package si.bleedy.saver.weather;

import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import si.bleedy.saver.counter.service.CacheCounterRepository;
import si.bleedy.saver.weather.client.WeatherClient;
import si.bleedy.saver.weather.data.WeatherTimeline;
import si.bleedy.saver.weather.service.WeatherTimelineExtendedRepository;
import si.bleedy.saver.weather.service.WeatherTimelineRepository;

import java.util.AbstractMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

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

  @Autowired
  public WeatherSaver(
      WeatherClient weatherClient,
      WeatherTimelineRepository weatherTimelineRepository,
      WeatherTimelineExtendedRepository timelineExtendedRepository,
      CacheCounterRepository cacheCounterRepository)
  {
    lastModified = timelineExtendedRepository.findLastModified();
    this.weatherClient = weatherClient;
    this.weatherTimelineRepository = weatherTimelineRepository;
    this.cacheCounterRepository = cacheCounterRepository;
  }

  @Scheduled(fixedRate = 180000)
  public void saveWeatherData()
  {
    try
    {
      AtomicInteger counter = new AtomicInteger(0);
      Long lastChange = System.currentTimeMillis();
      cacheCounterRepository.findAll().stream()
          .filter(c -> c.getLat() > 45.21 && c.getLat() < 47.05)
          .filter(c -> c.getLon() > 12.92 && c.getLon() < 16.71)
          .map(c -> new AbstractMap.SimpleEntry<>(c, weatherClient.getWeatherData(c.getLon(), c.getLat())))
          .filter(entry -> entry.getValue() != null)
          .filter(entry -> "ok".equals(entry.getValue().getStatus()))
          .filter(entry -> !entry.getValue().getRadar().getUpdated().equals(lastModified.get(entry.getKey().getCode())))
          .forEach(entry -> {
            weatherTimelineRepository.save(
                new WeatherTimeline(
                    entry.getValue().getRadar().getUpdated(),
                    entry.getKey(),
                    entry.getValue().getHailprob().getHailLevel(),
                    entry.getValue().getRadar().getRainMmph()
                )
            );
            lastModified.put(entry.getKey().getCode(), entry.getValue().getRadar().getUpdated());
            counter.getAndIncrement();
          });
      long millis = System.currentTimeMillis() - lastChange;
      if (counter.get() > 0)
      {
        LOG.debug("Saved " + counter.get() + " of weather data in " + millis + "ms");
      }
    }
    catch (Exception e)
    {
      LOG.error("Error: ", e);
    }
  }
}
