package si.bleedy.saver.counter.service;

import org.springframework.data.repository.CrudRepository;
import si.bleedy.saver.counter.data.CounterTimeline;

/**
 * @author bratwurzt
 */
public interface CounterTimelineRepository extends CrudRepository<CounterTimeline, Long>
{
}
