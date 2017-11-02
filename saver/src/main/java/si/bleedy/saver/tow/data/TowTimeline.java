package si.bleedy.saver.tow.data;

import org.hibernate.annotations.Type;
import org.joda.time.DateTime;

import javax.persistence.*;


/**
 * @author bratwurzt
 */
@Entity
@Table(name = "tow_timeline",
    uniqueConstraints =
    @UniqueConstraint(columnNames = {"car_id", "street_id", "dayTowed"}))
public class TowTimeline implements Comparable<TowTimeline>
{
  private Long id;
  private Car car;
  private Street street;
  private DateTime dayTowed;
  private DateTime created;
  private DateTime timePickedUp;

  public TowTimeline()
  {
  }

  public TowTimeline(Car car, Street street, DateTime dayTowed, DateTime created)
  {
    this.car = car;
    this.street = street;
    this.dayTowed = dayTowed;
    this.created = created;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(columnDefinition = "serial")
  public Long getId()
  {
    return id;
  }

  public void setId(Long id)
  {
    this.id = id;
  }

  @ManyToOne
  @JoinColumn(name = "car_id")
  public Car getCar()
  {
    return car;
  }

  public void setCar(Car car)
  {
    this.car = car;
  }

  @ManyToOne
  @JoinColumn(name = "street_id")
  public Street getStreet()
  {
    return street;
  }

  public void setStreet(Street street)
  {
    this.street = street;
  }

  @Type(type="org.jadira.usertype.dateandtime.joda.PersistentDateTime")
  public DateTime getDayTowed()
  {
    return dayTowed;
  }

  public void setDayTowed(DateTime dayTowed)
  {
    this.dayTowed = dayTowed;
  }

  @Type(type="org.jadira.usertype.dateandtime.joda.PersistentDateTime")
  public DateTime getCreated()
  {
    return created;
  }

  public void setCreated(DateTime created)
  {
    this.created = created;
  }

  @Type(type="org.jadira.usertype.dateandtime.joda.PersistentDateTime")
  public DateTime getTimePickedUp()
  {
    return timePickedUp;
  }

  public void setTimePickedUp(DateTime timePickedUp)
  {
    this.timePickedUp = timePickedUp;
  }

  @Override
  public boolean equals(Object o)
  {
    if (this == o)
    {
      return true;
    }
    if (o == null || getClass() != o.getClass())
    {
      return false;
    }

    TowTimeline that = (TowTimeline) o;

    if (!car.equals(that.car))
    {
      return false;
    }
    if (!street.equals(that.street))
    {
      return false;
    }
    if (!dayTowed.equals(that.dayTowed))
    {
      return false;
    }

    return true;
  }

  @Override
  public int hashCode()
  {
    int result = car.hashCode();
    result = 31 * result + street.hashCode();
    result = 31 * result + dayTowed.hashCode();
    return result;
  }

  @Override
  public int compareTo(TowTimeline o)
  {
    if (this == o)
    {
      return 0;
    }
    int delta = dayTowed.compareTo(o.getDayTowed());
    if (delta == 0)
    {
      delta = created.compareTo(o.getCreated());
    }
    if (delta == 0)
    {
      delta = car.compareTo(o.getCar());
    }
    if (delta == 0)
    {
      delta = street.compareTo(o.getStreet());
    }
    return delta;
  }
}
