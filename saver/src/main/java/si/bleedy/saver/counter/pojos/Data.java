package si.bleedy.saver.counter.pojos;

import com.fasterxml.jackson.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "ContentName",
    "Language",
    "Items"
})
public class Data {
  @JsonProperty("ContentName")
  private String contentName;
  @JsonProperty("Language")
  private String language;
  @JsonProperty("Items")
  private List<Item> items = null;
  @JsonIgnore
  private Map<String, Object> additionalProperties = new HashMap<String, Object>();

  @JsonProperty("ContentName")
  public String getContentName() {
    return contentName;
  }

  @JsonProperty("ContentName")
  public void setContentName(String contentName) {
    this.contentName = contentName;
  }

  @JsonProperty("Language")
  public String getLanguage() {
    return language;
  }

  @JsonProperty("Language")
  public void setLanguage(String language) {
    this.language = language;
  }

  @JsonProperty("Items")
  public List<Item> getItems() {
    return items;
  }

  @JsonProperty("Items")
  public void setItems(List<Item> items) {
    this.items = items;
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
