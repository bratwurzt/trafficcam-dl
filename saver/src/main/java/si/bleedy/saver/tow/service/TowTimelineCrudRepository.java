package si.bleedy.saver.tow.service;

import org.joda.time.DateTime;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import si.bleedy.saver.tow.data.Car;
import si.bleedy.saver.tow.data.Street;
import si.bleedy.saver.tow.data.TowTimeline;

import javax.persistence.EntityResult;
import javax.persistence.FieldResult;
import javax.persistence.SqlResultSetMapping;

/**
 * @author bratwurzt
 */

public interface TowTimelineCrudRepository extends CrudRepository<TowTimeline, Long>
{
  @Query(value = "SELECT tt FROM TowTimeline tt WHERE tt.car.brand=?1 AND tt.car.model=?2 AND tt.car.colour=?3 AND tt.street.name = ?4 AND tt.dayTowed=?5")
  TowTimeline find(String brand, String model, String colour, String streetName, DateTime dayTowed);


}
