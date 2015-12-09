package si.bleedy.data;

import java.io.Serializable;
import java.text.MessageFormat;

/**
 * @author DusanM
 */
public class ObservationData implements Serializable
{
  private static final long serialVersionUID = 1572082499775592473L;
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

  public String getGrouping()
  {
    return m_name + "_" + m_unit;
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

  public Boolean filterZephyr()
  {
    return !"ecg".equals(getName()) || getValue() < 1000;
  }

  @Override
  public String toString()
  {
    return MessageFormat.format("Observation'{'name=''{0}'', timestamp={1}, unit=''{2}'', value=''{3}'''}'", getName(), getTimestamp(), getUnit(), getValue());
  }

  public long getContentSize()
  {
    return (long)hashCode();
  }
}
