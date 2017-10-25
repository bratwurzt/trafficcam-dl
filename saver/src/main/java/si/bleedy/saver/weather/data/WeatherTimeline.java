package si.bleedy.saver.weather.data;

import org.hibernate.annotations.Type;
import org.joda.time.DateTime;
import si.bleedy.saver.counter.data.CounterData;

import javax.persistence.*;

import static javax.persistence.GenerationType.SEQUENCE;

/**
 * @author bratwurzt
 */
@Entity
@SequenceGenerator(name = "weather_timeline_id_seq", sequenceName = "weather_timeline_id_seq", allocationSize = 500)
@Table(name = "weather_timeline")
public class WeatherTimeline
{
  private Long id;
  private DateTime time;
  private CounterData counter;
  private Short hailprobLevel;
  private Float rainMmph;

  public WeatherTimeline(DateTime time, CounterData counter, short hailprobLevel, Float rainMmph)
  {
    this.time = time;
    this.counter = counter;
    this.hailprobLevel = hailprobLevel;
    this.rainMmph = rainMmph;
  }

  @Id
  @GeneratedValue(strategy = SEQUENCE, generator = "weather_timeline_id_seq")
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

  public Short getHailprobLevel()
  {
    return hailprobLevel;
  }

  public void setHailprobLevel(Short hailprobLevel)
  {
    this.hailprobLevel = hailprobLevel;
  }

  public Float getRainMmph()
  {
    return rainMmph;
  }

  public void setRainMmph(Float rainMmph)
  {
    this.rainMmph = rainMmph;
  }
}
