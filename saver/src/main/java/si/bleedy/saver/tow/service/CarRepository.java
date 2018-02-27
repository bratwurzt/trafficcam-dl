package si.bleedy.saver.tow.service;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import si.bleedy.saver.tow.data.Car;

/**
 * @author bratwurzt
 */
public interface CarRepository extends CrudRepository<Car, Long> {
  @Query(value = "INSERT INTO car(brand, model, colour) VALUES (?1, ?2, ?3) ON CONFLICT ON CONSTRAINT car_uq DO UPDATE SET brand = car.brand RETURNING id", nativeQuery = true)
  long save(String brand, String model, String colour);
}
