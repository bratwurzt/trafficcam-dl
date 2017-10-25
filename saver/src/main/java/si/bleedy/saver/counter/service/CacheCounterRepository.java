package si.bleedy.saver.counter.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import si.bleedy.saver.counter.data.CounterData;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * @author bratwurzt
 */
@Service
public class CacheCounterRepository
{
  private final Map<String, CounterData> COUNTER_MAP;
  private final CounterRepository counterRepository;

  @Autowired
  public CacheCounterRepository(CounterRepository counterRepository)
  {
    this.counterRepository = counterRepository;
    COUNTER_MAP = StreamSupport.stream(this.counterRepository.findAll().spliterator(), false)
            .collect(Collectors.toConcurrentMap(CounterData::getCode, Function.identity()));;
  }

  @Transactional
  public CounterData get(String code, double xCoordinates, double yCoordinates, String stevciSmerOpis, String stevciPasOpis)
  {
    CounterData counter = COUNTER_MAP.get(code);
    if (counter == null)
    {
      final String pasOpis = stevciSmerOpis + (stevciPasOpis != null ? " " + stevciPasOpis : "");
      counterRepository.save(code, xCoordinates, yCoordinates, pasOpis);
      counter = counterRepository.findByCode(code);
      if (counter != null)
      {
        COUNTER_MAP.put(code, counter);
      }
    }
    return counter;
  }

  public Collection<CounterData> findAll()
  {
    return COUNTER_MAP.values();
  }

}
