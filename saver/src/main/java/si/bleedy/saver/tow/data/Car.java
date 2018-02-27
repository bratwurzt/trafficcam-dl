package si.bleedy.saver.tow.data;

import javax.persistence.*;

/**
 * @author bratwurzt
 */
@Entity
@Table(name = "car",
    uniqueConstraints =
    @UniqueConstraint(name = "car_uq", columnNames = {"brand", "model", "colour"}))
public class Car implements Comparable<Car> {
  private Long id;
  private String brand;
  private String model;
  private String colour;

  public Car() {
  }

  public Car(String brand, String model, String colour) {
    this.brand = brand;
    this.model = model;
    this.colour = colour;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(columnDefinition = "serial")
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getBrand() {
    return brand;
  }

  public void setBrand(String brand) {
    this.brand = brand;
  }

  public String getModel() {
    return model;
  }

  public void setModel(String model) {
    this.model = model;
  }

  public String getColour() {
    return colour;
  }

  public void setColour(String colour) {
    this.colour = colour;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    Car car = (Car) o;

    if (!brand.equals(car.brand)) {
      return false;
    }
    if (!model.equals(car.model)) {
      return false;
    }
    if (!colour.equals(car.colour)) {
      return false;
    }

    return true;
  }

  @Override
  public int hashCode() {
    int result = brand.hashCode();
    result = 31 * result + model.hashCode();
    result = 31 * result + colour.hashCode();
    return result;
  }

  @Override
  public int compareTo(Car o) {
    if (this == o) {
      return 0;
    }
    int delta = brand.compareTo(o.getBrand());
    if (delta == 0) {
      delta = model.compareTo(o.getModel());
    }
    if (delta == 0) {
      delta = colour.compareTo(o.getColour());
    }
    return delta;
  }
}
