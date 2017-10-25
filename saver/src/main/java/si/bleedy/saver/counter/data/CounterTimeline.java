package si.bleedy.saver.counter.data;

import org.hibernate.annotations.Type;
import org.joda.time.DateTime;

import javax.persistence.*;

import static javax.persistence.GenerationType.SEQUENCE;

/**
 * @author bratwurzt
 */
@Entity
@SequenceGenerator(name = "counter_timeline_id_seq", sequenceName = "counter_timeline_id_seq", allocationSize = 1200)
@Table(name = "counter_timeline")
public class CounterTimeline
{
  private Long id;
  private DateTime time;
  private CounterData counter;
  private Float avgSecGap;
  private Integer speed;
  private Integer carsPerSec;

  public CounterTimeline(DateTime time, CounterData counter, Float avgSecGap, Integer speed, Integer carsPerSec)
  {
    setTime(time);
    setCounter(counter);
    setAvgSecGap(avgSecGap);
    setSpeed(speed);
    setCarsPerSec(carsPerSec);
  }

  @Id
  @GeneratedValue(strategy = SEQUENCE, generator = "counter_timeline_id_seq")
  public Long getId()
  {
    return id;
  }

  public void setId(Long id)
  {
    this.id = id;
  }

  @Column(name = "time", columnDefinition= "TIMESTAMP WITH TIME ZONE")
  @Type(type="org.jadira.usertype.dateandtime.joda.PersistentDateTime")
  public DateTime getTime()
  {
    return time;
  }

  public void setTime(DateTime time)
  {
    this.time = time;
  }

  @ManyToOne
  @JoinColumn(name = "counter_id")
  public CounterData getCounter()
  {
    return counter;
  }

  public void setCounter(CounterData counter)
  {
    this.counter = counter;
  }

  public Float getAvgSecGap()
  {
    return avgSecGap;
  }

  public void setAvgSecGap(Float avgSecGap)
  {
    this.avgSecGap = avgSecGap;
  }

  public Integer getSpeed()
  {
    return speed;
  }

  public void setSpeed(Integer speed)
  {
    this.speed = speed;
  }

  public Integer getCarsPerSec()
  {
    return carsPerSec;
  }

  public void setCarsPerSec(Integer carsPerSec)
  {
    this.carsPerSec = carsPerSec;
  }
}
