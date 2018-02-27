package si.bleedy.saver.counter.pojos;

import com.fasterxml.jackson.annotation.*;

import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "properties",
    "Id",
    "Icon"
})
public class Datum {
  @JsonProperty("properties")
  private Properties properties;
  @JsonProperty("Id")
  private String id;
  @JsonProperty("Icon")
  private String icon;
  @JsonIgnore
  private Map<String, Object> additionalProperties = new HashMap<String, Object>();

  @JsonProperty("properties")
  public Properties getProperties() {
    return properties;
  }

  @JsonProperty("properties")
  public void setProperties(Properties properties) {
    this.properties = properties;
  }

  @JsonProperty("Id")
  public String getId() {
    return id;
  }

  @JsonProperty("Id")
  public void setId(String id) {
    this.id = id;
  }

  @JsonProperty("Icon")
  public String getIcon() {
    return icon;
  }

  @JsonProperty("Icon")
  public void setIcon(String icon) {
    this.icon = icon;
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
