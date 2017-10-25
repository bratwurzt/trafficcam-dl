package si.bleedy.saver.counter.service;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import si.bleedy.saver.counter.data.CounterData;

import javax.transaction.Transactional;

/**
 * @author bratwurzt
 */
public interface CounterRepository extends CrudRepository<CounterData, Long>
{
  @Modifying
  @Transactional
  @Query(value = "INSERT INTO counter(id, code, location, description) VALUES (nextval('counter_seq'), ?1, ST_SetSRID(ST_MakePoint(?2, ?3), 4326), ?4)", nativeQuery = true)
  void save(String code, double xCoordinates, double yCoordinates, String pasOpis);

  @Transactional
  @Query(value = "SELECT id, code, ST_X(location) as lon, ST_Y(location) as lat FROM counter WHERE code = ?1", nativeQuery = true)
  CounterData findByCode(String code);
}
