package si.bleedy.saver.counter;

import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import si.bleedy.saver.counter.client.CountersClient;
import si.bleedy.saver.counter.data.CounterTimeline;
import si.bleedy.saver.counter.pojos.Content;
import si.bleedy.saver.counter.pojos.Counter;
import si.bleedy.saver.counter.service.CacheCounterRepository;
import si.bleedy.saver.counter.service.CounterTimelineRepository;
import si.bleedy.saver.counter.service.impl.CounterTimelineExtendedRepositoryImpl;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author bratwurzt
 */
@Component
public class CounterSaver
{
  private static final Logger LOG = LoggerFactory.getLogger(CounterSaver.class);
  private volatile DateTime lastModified = null;

  private final CountersClient countersClient;
  private final CacheCounterRepository cacheCounterRepository;
  private final CounterTimelineRepository counterTimelineRepository;

  @Autowired
  public CounterSaver(
      CountersClient countersClient,
      CacheCounterRepository cacheCounterRepository,
      CounterTimelineRepository counterTimelineRepository,
      CounterTimelineExtendedRepositoryImpl counterTimelineExtendedRepository)
  {
    lastModified = counterTimelineExtendedRepository.findLastModified();
    this.countersClient = countersClient;
    this.cacheCounterRepository = cacheCounterRepository;
    this.counterTimelineRepository = counterTimelineRepository;
  }

  @Async
  @Scheduled(fixedRateString = "${saver.counter.scheduledMillis}")
  public void saveCounters()
  {
    final Counter counters = countersClient.getCounters();
    final Content content = counters.getContents().iterator().next();
    final DateTime modifiedTime = content.getModifiedTime();
    try
    {
      if (!modifiedTime.equals(lastModified))
      {
        Long lastChange = System.currentTimeMillis();
        final List<CounterTimeline> counterTimelines = content.getData().getItems().stream()
            .flatMap(it -> it.getData().stream()
                .map(d -> new CounterTimeline(
                    modifiedTime,
                    cacheCounterRepository.get(
                        it.getId(),
                        it.getXWgs(),
                        it.getYWgs(),
                        d.getProperties().getStevciSmerOpis(),
                        d.getProperties().getStevciPasOpis()),
                    getAvgSecGap(d.getProperties().getStevciGap()),
                    d.getProperties().getStevciHit(),
                    d.getProperties().getStevciStev()
                )))
            .collect(Collectors.toList());

        counterTimelineRepository.save(counterTimelines);
        lastModified = modifiedTime;
        long millis = System.currentTimeMillis() - lastChange;

        LOG.debug("Saved " + counterTimelines.size() + " counters in " + millis / 1000 + "s");
      }
    }
    catch (Exception e)
    {
      LOG.error("Error: ", e);
    }
  }


  private float getAvgSecGap(final String stevciGap)
  {
    float avgSecGap = 999;
    try
    {
      avgSecGap = Float.valueOf(stevciGap.replace(",", "."));
    }
    catch (NumberFormatException ignored)
    {
    }
    return avgSecGap;
  }

}
