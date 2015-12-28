package si.bleedy.data;

import java.io.Serializable;

/**
 * @author bratwurzt
 */
public class SleepData implements Serializable
{
  private Long m_timestampStart;
  private Long m_fromTime;
  private Long m_toTime;
  private Float m_sleepHours;
  private Integer m_sleepCycles;
  private Float m_sleepDeep;

  public SleepData(Long timestampStart, Long fromTime, Long toTime, Float sleepHours, Integer sleepCycles, Float sleepDeep)
  {
    m_timestampStart = timestampStart;
    m_fromTime = fromTime;
    m_toTime = toTime;
    m_sleepHours = sleepHours;
    m_sleepCycles = sleepCycles;
    m_sleepDeep = sleepDeep;
  }

  public Long getTimestampStart()
  {
    return m_timestampStart;
  }

  public Long getFromTime()
  {
    return m_fromTime;
  }

  public Long getToTime()
  {
    return m_toTime;
  }

  public Float getSleepHours()
  {
    return m_sleepHours;
  }

  public Integer getSleepCycles()
  {
    return m_sleepCycles;
  }

  public Float getSleepDeep()
  {
    return m_sleepDeep;
  }
}
