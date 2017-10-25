package si.bleedy.saver.weather.service;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import si.bleedy.saver.counter.data.CounterData;

import javax.transaction.Transactional;

/**
 * @author bratwurzt
 */
public interface WeatherRepository extends CrudRepository<CounterData, Long>
{
  @Modifying
  @Transactional
  @Query(value = "INSERT INTO counter(id, code, location, description) VALUES (nextval('counter_seq'), ?1, ST_SetSRID(ST_MakePoint(?2, ?3), 4326), ?4)", nativeQuery = true)
  void save(String code, double xCoordinates, double yCoordinates, String pasOpis);

  @Override
  @Transactional
  @Query(value = "SELECT id, code, ST_X(location), ST_Y(location) FROM counter", nativeQuery = true)
  Iterable<CounterData> findAll();

  @Override
  @Transactional
  @Query(value = "SELECT id, code, ST_X(location), ST_Y(location) FROM counter WHERE id = ?1", nativeQuery = true)
  CounterData findOne(Long id);

  @Transactional
  @Query(value = "SELECT id, code, ST_X(location), ST_Y(location) FROM counter WHERE code = ?1", nativeQuery = true)
  CounterData findByCode(String code);
}
