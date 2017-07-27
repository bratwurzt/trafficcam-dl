package si.bleedy;

/**
 * @author bratwurzt
 */
public class CounterData
{
  private long id;
  private String code;
  private float lon;
  private float lat;

  public CounterData(long id, String code, float lon, float lat)
  {
    this.id = id;
    this.code = code;
    this.lon = lon;
    this.lat = lat;
  }

  public long getId()
  {
    return id;
  }

  public String getCode()
  {
    return code;
  }

  public float getLon()
  {
    return lon;
  }

  public float getLat()
  {
    return lat;
  }
}
