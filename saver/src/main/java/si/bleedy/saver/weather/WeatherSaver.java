package si.bleedy.saver.weather;

import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import si.bleedy.saver.counter.data.CounterData;
import si.bleedy.saver.counter.service.CacheCounterRepository;
import si.bleedy.saver.weather.client.WeatherClient;
import si.bleedy.saver.weather.data.WeatherTimeline;
import si.bleedy.saver.weather.pojos.WeatherDto;
import si.bleedy.saver.weather.service.WeatherTimelineExtendedRepository;
import si.bleedy.saver.weather.service.WeatherTimelineRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author bratwurzt
 */
@Component
public class WeatherSaver {
  private static final Logger LOG = LoggerFactory.getLogger(WeatherSaver.class);
  private final Map<String, DateTime> lastModified;

  private final WeatherClient weatherClient;
  private final WeatherTimelineRepository weatherTimelineRepository;
  private final CacheCounterRepository cacheCounterRepository;

  private final Integer sleepMillis;

  @Autowired
  public WeatherSaver(
      WeatherClient weatherClient,
      WeatherTimelineRepository weatherTimelineRepository,
      WeatherTimelineExtendedRepository timelineExtendedRepository,
      CacheCounterRepository cacheCounterRepository,
      @Value("${saver.weather.sleepMillis}") Integer sleepMillis) {
    lastModified = timelineExtendedRepository.findLastModified();
    this.weatherClient = weatherClient;
    this.weatherTimelineRepository = weatherTimelineRepository;
    this.cacheCounterRepository = cacheCounterRepository;
    this.sleepMillis = sleepMillis;
  }

  @Async
  @Scheduled(fixedRateString = "${saver.weather.scheduledMillis}")
  public void saveWeatherData() {
    try {
      Long lastChange = System.currentTimeMillis();
      List<CounterData> counterDataList = cacheCounterRepository.findAll().stream()
          .filter(c -> c.getLat() > 45.21 && c.getLat() < 47.05)
          .filter(c -> c.getLon() > 12.92 && c.getLon() < 16.71)
          .collect(Collectors.toList());
      int i = 0;
      for (CounterData c : counterDataList) {
        WeatherDto w = weatherClient.getWeatherData(c.getLon(), c.getLat());
        if (w != null && "ok".equals(w.getStatus()) && !w.getRadar().getUpdated().equals(lastModified.get(c.getCode()))) {
          weatherTimelineRepository.save(
              new WeatherTimeline(
                  w.getRadar().getUpdated(),
                  c,
                  w.getHailprob().getHailLevel(),
                  w.getRadar().getRainMmph()
              ));
          lastModified.put(c.getCode(), w.getRadar().getUpdated());
          i++;
          try {
            Thread.sleep(sleepMillis);
          } catch (InterruptedException ignored) {
          }
        }
      }

      long millis = System.currentTimeMillis() - lastChange;
      if (i > 0) {
        LOG.debug("Saved " + i + " of weather data in " + millis / 1000 + "s");
      }
    } catch (Exception e) {
      LOG.error("Error: ", e);
    }
  }
}
