package si.bleedy.saver.counter.service.impl;

import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.sql.Timestamp;
import java.util.List;

/**
 * @author bratwurzt
 */
@Service
public class CounterTimelineExtendedRepositoryImpl
{
  private final EntityManager entityManager;

  @Autowired
  public CounterTimelineExtendedRepositoryImpl(EntityManager entityManager)
  {
    this.entityManager = entityManager;
  }

  public DateTime findLastModified()
  {
    final Query nativeQuery = entityManager.createNativeQuery("SELECT c.time from counter_timeline c where c.id = (select max(id) from counter_timeline)");

    @SuppressWarnings("unchecked")
    final List<Object> resultList = nativeQuery.getResultList();
    
    return resultList.iterator().hasNext() ? new DateTime(((Timestamp)resultList.iterator().next()).getTime()) : null;
  }
}
