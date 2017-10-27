package si.bleedy.saver.weather.service;

import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.sql.Timestamp;
import java.util.AbstractMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author bratwurzt
 */
@Service
public class WeatherTimelineExtendedRepository
{
  private final EntityManager entityManager;

  @Autowired
  public WeatherTimelineExtendedRepository(EntityManager entityManager)
  {
    this.entityManager = entityManager;
  }

  public Map<String, DateTime> findLastModified()
  {
    final Query nativeQuery = entityManager.createNativeQuery("select c.code, f.time" +
        " from (" +
        "   select counter_id, max(id) as maxId" +
        "   from weather_timeline group by counter_id" +
        ") as x inner join weather_timeline as f on f.id = x.maxId inner join counter as c on c.id = f.counter_id");

    @SuppressWarnings("unchecked")
    final List<Object[]> resultList = nativeQuery.getResultList();
    
    return resultList.stream()
        .map(r -> new AbstractMap.SimpleEntry<>((String)r[0], new DateTime(((Timestamp)r[1]).getTime())))
        .collect(Collectors.toConcurrentMap(AbstractMap.SimpleEntry::getKey, AbstractMap.SimpleEntry::getValue));
  }
}
