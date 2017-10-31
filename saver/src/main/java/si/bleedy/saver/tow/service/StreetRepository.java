package si.bleedy.saver.tow.service;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import si.bleedy.saver.tow.data.Car;
import si.bleedy.saver.tow.data.Street;

/**
 * @author bratwurzt
 */
public interface StreetRepository extends CrudRepository<Street, Long>
{
  @Query(value = "INSERT INTO street(name) VALUES (?1) ON CONFLICT ON CONSTRAINT street_uq DO UPDATE SET name = street.name RETURNING id", nativeQuery = true)
  long save(String name);
}
