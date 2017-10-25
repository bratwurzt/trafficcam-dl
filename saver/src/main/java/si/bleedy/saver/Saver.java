package si.bleedy.saver;

import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import si.bleedy.saver.client.CountersClient;
import si.bleedy.saver.data.CounterData;
import si.bleedy.saver.data.CounterTimeline;
import si.bleedy.saver.pojos.Content;
import si.bleedy.saver.pojos.Item;
import si.bleedy.saver.pojos.Counter;
import si.bleedy.saver.pojos.Properties;
import si.bleedy.saver.service.CounterRepository;
import si.bleedy.saver.service.CounterTimelineRepository;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * @author bratwurzt
 */
@Component
public class Saver
{
  private static final Logger LOG = LoggerFactory.getLogger(Saver.class);
  private final Map<String, CounterData> COUNTER_MAP;
  private volatile DateTime lastModified = null;
  private Long lastChange;

  private final CountersClient countersClient;
  private final CounterRepository counterRepository;
  private final CounterTimelineRepository counterTimelineRepository;

  @Autowired
  public Saver(CountersClient countersClient, CounterRepository counterRepository, CounterTimelineRepository counterTimelineRepository)
  {
    this.countersClient = countersClient;
    this.counterRepository = counterRepository;
    this.counterTimelineRepository = counterTimelineRepository;
    COUNTER_MAP = StreamSupport.stream(counterRepository.findAll().spliterator(), false)
        .collect(Collectors.toMap(CounterData::getCode, Function.identity()));
  }

  @Scheduled(fixedRate = 60000)
  public void saveCounters()
  {
    final Counter counters = countersClient.getCounters();
    final Content content = counters.getContents().iterator().next();
    final DateTime modifiedTime = content.getModifiedTime();
    if (!modifiedTime.equals(lastModified))
    {
      lastChange = System.currentTimeMillis();
      final List<CounterTimeline> counterTimelines = content.getData().getItems().stream()
          .flatMap(it -> it.getData().stream()
              .map(d -> new CounterTimeline(
                  modifiedTime,
                  getCounter(it, d.getProperties()),
                  getAvgSecGap(d.getProperties().getStevciGap()),
                  d.getProperties().getStevciHit(),
                  d.getProperties().getStevciStev()
              )))
          .collect(Collectors.toList());

      counterTimelineRepository.save(counterTimelines);
      lastModified = modifiedTime;
      long millis = System.currentTimeMillis() - lastChange;

      LOG.info("Saved " + counterTimelines.size() + " counters in " + (millis/1000) + " seconds.");
    }
  }

  private CounterData getCounter(Item dto, Properties p)
  {
    final String code = dto.getId();
    CounterData counter = COUNTER_MAP.get(code);
    if (counter == null)
    {
      final String pasOpis = p.getStevciSmerOpis() + (p.getStevciPasOpis() != null ? " " + p.getStevciPasOpis() : "");
      counterRepository.save(code, dto.getXWgs(), dto.getYWgs(), pasOpis);
      counter = counterRepository.findByCode(code);
      if (counter != null)
      {
        COUNTER_MAP.put(code, counter);
      }
    }
    return counter;
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
