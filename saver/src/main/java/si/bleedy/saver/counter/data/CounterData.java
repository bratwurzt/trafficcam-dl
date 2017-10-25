package si.bleedy.saver.counter.data;

import org.hibernate.annotations.ColumnTransformer;
import org.hibernate.annotations.Formula;

import javax.persistence.*;

/**
 * @author bratwurzt
 */
@Entity
@Table(name = "counter")
public class CounterData
{
  private long id;
  private String code;
  private Float lon;
  private Float lat;

  public CounterData()
  {
  }

  public CounterData(long id, String code, float lon, float lat)
  {
    this.id = id;
    this.code = code;
    this.lon = lon;
    this.lat = lat;
  }

  @PostLoad
  private void onLoad() {
  }

  @Id
  public long getId()
  {
    return id;
  }

  public void setId(long id)
  {
    this.id = id;
  }

  public String getCode()
  {
    return code;
  }

  public void setCode(String code)
  {
    this.code = code;
  }

  @Formula(value = "ST_X(location)")
  public Float getLon()
  {
    return lon;
  }

  public void setLon(Float lon)
  {
    this.lon = lon;
  }

    @Formula(value = "ST_Y(location)")
  public Float getLat()
  {
    return lat;
  }

  public void setLat(Float lat)
  {
    this.lat = lat;
  }
}
