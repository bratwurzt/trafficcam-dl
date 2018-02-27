package si.bleedy.saver.weather.pojos;

import com.fasterxml.jackson.annotation.*;

import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "y",
    "updated_text",
    "updated",
    "hail_level",
    "x"
})
public class Hailprob {

  @JsonProperty("y")
  private Integer y;
  @JsonProperty("updated_text")
  private String updatedText;
  @JsonProperty("updated")
  private Integer updated;
  @JsonProperty("hail_level")
  private Short hailLevel;
  @JsonProperty("x")
  private Integer x;
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

  @JsonProperty("updated_text")
  public String getUpdatedText() {
    return updatedText;
  }

  @JsonProperty("updated_text")
  public void setUpdatedText(String updatedText) {
    this.updatedText = updatedText;
  }

  @JsonProperty("updated")
  public Integer getUpdated() {
    return updated;
  }

  @JsonProperty("updated")
  public void setUpdated(Integer updated) {
    this.updated = updated;
  }

  @JsonProperty("hail_level")
  public Short getHailLevel() {
    return hailLevel;
  }

  @JsonProperty("hail_level")
  public void setHailLevel(Short hailLevel) {
    this.hailLevel = hailLevel;
  }

  @JsonProperty("x")
  public Integer getX() {
    return x;
  }

  @JsonProperty("x")
  public void setX(Integer x) {
    this.x = x;
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
