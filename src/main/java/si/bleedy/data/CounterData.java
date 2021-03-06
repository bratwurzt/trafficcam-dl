package si.bleedy.data;

import java.io.Serializable;

/**
 * @author bratwurzt
 */
public class CounterData implements Serializable
{
  private static final long serialVersionUID = 8901864770099180810L;
  private String m_id;
  private String m_description;
  private String m_direction;
  private long m_timestamp;
  private float m_avgSecGap;
  private int m_speed;
  private int m_carsPerHour;
  private float m_utilization;
  private GpsPoint m_gps;

  public CounterData(String compositeId, long timestamp, float avgSecGap, int speed, int carsPerHour, float utilization)
  {
    String[] split = compositeId.split("\\s+");
    if (split.length > 2)
    {
      m_gps = new GpsPoint(Float.parseFloat(split[0]), Float.parseFloat(split[1]));
      m_id = split[2];
      m_direction = m_id.split("-")[1];
      if (split.length > 3)
      {
        m_description = split[3];
        m_id += "-" + m_description;
      }
    }
    m_timestamp = timestamp * 1000 + 3600000;
    //m_avgSecGap = 999.9f == avgSecGap ? 0 : avgSecGap;
    m_avgSecGap = avgSecGap;
    m_speed = speed;
    m_carsPerHour = carsPerHour;
    m_utilization = utilization;
  }

  public String getId()
  {
    return m_id;
  }

  public void setId(String id)
  {
    m_id = id;
  }

  public long getTimestamp()
  {
    return m_timestamp;
  }

  public void setTimestamp(long timestamp)
  {
    m_timestamp = timestamp;
  }

  public float getAvgSecGap()
  {
    return m_avgSecGap;
  }

  public void setAvgSecGap(float avgSecGap)
  {
    m_avgSecGap = avgSecGap;
  }

  public int getSpeed()
  {
    return m_speed;
  }

  public void setSpeed(int speed)
  {
    m_speed = speed;
  }

  public int getCarsPerHour()
  {
    return m_carsPerHour;
  }

  public int getCarsPerMin()
  {
    return m_carsPerHour / 60;
  }

  public void setCarsPerHour(int carsPerHour)
  {
    m_carsPerHour = carsPerHour;
  }

  public float getUtilization()
  {
    return m_utilization;
  }

  public void setUtilization(float utilization)
  {
    m_utilization = utilization;
  }

  public GpsPoint getGps()
  {
    return m_gps;
  }

  public double[] toDoubleArray()
  {
    return new double[]{
        //getAvgSecGap(),
        //getSpeed()
        getCarsPerHour()
        //getUtilization()
    };
  }

  public boolean isHighway()
  {
    return m_description != null;
  }

  public boolean isDirection11()
  {
    return "11".equals(m_direction);
  }
}
