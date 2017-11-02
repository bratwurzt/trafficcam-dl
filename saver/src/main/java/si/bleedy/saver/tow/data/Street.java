package si.bleedy.saver.tow.data;

import javax.persistence.*;

/**
 * @author bratwurzt
 */
@Entity
@Table(name = "street",
    uniqueConstraints =
    @UniqueConstraint(name = "street_uq", columnNames = {"name"}))
public class Street implements Comparable<Street>
{
  private Long id;
  private String name;

  public Street()
  {
  }

  public Street(String name)
  {
    this.name = name;
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

  public String getName()
  {
    return name;
  }

  public void setName(String name)
  {
    this.name = name;
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

    Street street = (Street) o;

    if (!name.equals(street.name))
    {
      return false;
    }

    return true;
  }

  @Override
  public int hashCode()
  {
    return name.hashCode();
  }

  @Override
  public int compareTo(Street o)
  {
    return name.compareTo(o.getName());
  }
}
