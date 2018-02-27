package si.bleedy.saver.counter.data;

import com.vividsolutions.jts.geom.Point;

import javax.persistence.*;

/**
 * @author bratwurzt
 */
@Entity
@Table(name = "counter")
public class CounterData {
  private long id;
  private String code;
  private Point location;

  public CounterData() {
  }

  public CounterData(long id, String code, float lon, float lat) {
    this.id = id;
    this.code = code;
  }

  @Id
  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  @Transient
  public Float getLon() {
    return (float) location.getX();
  }

  @Transient
  public Float getLat() {
    return (float) location.getY();
  }

  @Column(columnDefinition = "geometry(Point,4326)")
  public Point getLocation() {
    return location;
  }

  public void setLocation(Point location) {
    this.location = location;
  }
}
