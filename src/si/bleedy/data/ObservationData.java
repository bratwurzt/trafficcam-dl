package si.bleedy.data;

import java.io.Serializable;

/**
 * @author DusanM
 */
public class ObservationData implements Serializable
{
  private String m_name;
  private String m_unit;
  private long m_timestamp;
  private double m_value;

  public ObservationData(String name, String unit, long timestamp, String value)
  {
    m_name = name;
    m_unit = unit;
    m_timestamp = timestamp;
    m_value = Double.parseDouble(value);
    if (m_value < 0)
    {
      m_value *= -1;
    }
    //m_value *= 0.013405;
  }

  public String getName()
  {
    return m_name;
  }

  public String getUnit()
  {
    return m_unit;
  }

  public long getTimestamp()
  {
    return m_timestamp;
  }

  public double getValue()
  {
    return m_value;
  }

  public Boolean filter()
  {
    return
        //"respiration rate".equals(getName())
        //|| "breathing".equals(getName())
        //|| "breathing wave amplitude".equals(getName())
        //|| "heart rate".equals(getName())
        //|| "peak acceleration".equals(getName())
        //"r to r".equals(getName())
        !"ecg".equals(getName()) || getValue() < 1000
        //&& getValue() < 1000
        ;
  }
}
