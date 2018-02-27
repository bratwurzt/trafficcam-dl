package si.bleedy.saver.weather.pojos;

import com.fasterxml.jackson.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "y",
    "x",
    "updated",
    "data"
})
public class Forecast {

  @JsonProperty("y")
  private Integer y;
  @JsonProperty("x")
  private Integer x;
  @JsonProperty("updated")
  private Integer updated;
  @JsonProperty("data")
  private List<Datum> data = null;
  @JsonIgnore
  private Map<String, Object> additionalProperties = new HashMap<String, Object>();

  @JsonProperty("y")
  public Integer getY() {
    return y;
  }

  @JsonProperty("y")
  public void setY(Integer y) {
    this.y = y;
  }

  @JsonProperty("x")
  public Integer getX() {
    return x;
  }

  @JsonProperty("x")
  public void setX(Integer x) {
    this.x = x;
  }

  @JsonProperty("updated")
  public Integer getUpdated() {
    return updated;
  }

  @JsonProperty("updated")
  public void setUpdated(Integer updated) {
    this.updated = updated;
  }

  @JsonProperty("data")
  public List<Datum> getData() {
    return data;
  }

  @JsonProperty("data")
  public void setData(List<Datum> data) {
    this.data = data;
  }

  @JsonAnyGetter
  public Map<String, Object> getAdditionalProperties() {
    return this.additionalProperties;
  }

  @JsonAnySetter
  public void setAdditionalProperty(String name, Object value) {
    this.additionalProperties.put(name, value);
  }

}
