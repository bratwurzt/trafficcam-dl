package si.bleedy.data;

import java.io.Serializable;
import java.util.Date;

/**
 * @author bratwurzt
 */
public class SleepData implements Serializable
{
  private Long m_id;
  private Date m_from;
  private Date m_to;
  private Float m_sleepHours;
  private Integer m_sleepCycles;
  private Float m_sleepDeep;

  private String m_name;
  private Long m_timestamp;
  private String m_value;

  public SleepData(Long id, Date from, Date to, Float sleepHours, Integer sleepCycles, Float sleepDeep)
  {
    m_id = id;
    m_from = from;
    m_to = to;
    m_sleepHours = sleepHours;
    m_sleepCycles = sleepCycles;
    m_sleepDeep = sleepDeep;
  }
}
