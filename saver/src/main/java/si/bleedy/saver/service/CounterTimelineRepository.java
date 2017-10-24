package si.bleedy.saver.service;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import si.bleedy.saver.data.CounterData;
import si.bleedy.saver.data.CounterTimeline;

/**
 * @author bratwurzt
 */
public interface CounterTimelineRepository extends CrudRepository<CounterTimeline, Long>
{
}
