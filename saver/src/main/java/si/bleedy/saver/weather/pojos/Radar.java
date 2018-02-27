package si.bleedy.saver.weather.pojos;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.joda.time.DateTime;
import si.bleedy.saver.serializer.JodaDateUnixTimeDeserializer;

import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "updated",
    "rain_level",
    "rain_mmph",
    "updated_text",
    "y",
    "x"
})
public class Radar {

  @JsonProperty("updated")
  private DateTime updated;
  @JsonProperty("rain_level")
  private Integer rainLevel;
  @JsonProperty("rain_mmph")
  private Float rainMmph;
  @JsonProperty("updated_text")
  private String updatedText;
  @JsonProperty("y")
  private Integer y;
  @JsonProperty("x")
  private Integer x;
  @JsonIgnore
  private Map<String, Object> additionalProperties = new HashMap<String, Object>();

  @JsonProperty("updated")
  @JsonDeserialize(using = JodaDateUnixTimeDeserializer.class)
  public DateTime getUpdated() {
    return updated;
  }

  @JsonProperty("updated")
  public void setUpdated(DateTime updated) {
    this.updated = updated;
  }

  @JsonProperty("rain_level")
  public Integer getRainLevel() {
    return rainLevel;
  }

  @JsonProperty("rain_level")
  public void setRainLevel(Integer rainLevel) {
    this.rainLevel = rainLevel;
  }

  @JsonProperty("rain_mmph")
  public Float getRainMmph() {
    return rainMmph;
  }

  @JsonProperty("rain_mmph")
  public void setRainMmph(Float rainMmph) {
    this.rainMmph = rainMmph;
  }

  @JsonProperty("updated_text")
  public String getUpdatedText() {
    return updatedText;
  }

  @JsonProperty("updated_text")
  public void setUpdatedText(String updatedText) {
    this.updatedText = updatedText;
  }

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

  @JsonAnyGetter
  public Map<String, Object> getAdditionalProperties() {
    return this.additionalProperties;
  }

  @JsonAnySetter
  public void setAdditionalProperty(String name, Object value) {
    this.additionalProperties.put(name, value);
  }

}
