package si.bleedy.saver.data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

/**
 * @author bratwurzt
 */
@Entity
@Table(name = "counter")
public class CounterData
{
  private long id;
  private String code;
  private float lon;
  private float lat;

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

  @Transient
  public float getLon()
  {
    return lon;
  }

  public void setLon(float lon)
  {
    this.lon = lon;
  }

  @Transient
  public float getLat()
  {
    return lat;
  }

  public void setLat(float lat)
  {
    this.lat = lat;
  }
}
