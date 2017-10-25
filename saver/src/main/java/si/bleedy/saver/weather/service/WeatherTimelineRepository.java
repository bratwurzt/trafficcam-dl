package si.bleedy.saver.weather.service;

import org.springframework.data.repository.CrudRepository;
import si.bleedy.saver.weather.data.WeatherTimeline;

/**
 * @author bratwurzt
 */
public interface WeatherTimelineRepository extends CrudRepository<WeatherTimeline, Long>
{
}
