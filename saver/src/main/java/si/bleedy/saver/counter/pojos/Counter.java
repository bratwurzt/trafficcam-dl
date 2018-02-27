package si.bleedy.saver.counter.pojos;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.joda.time.DateTime;
import si.bleedy.saver.serializer.JodaDateDeserializer;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "RoutingVersion",
    "updated",
    "TileVersion",
    "ModifiedTime",
    "copyright",
    "ModelVersion",
    "Expires",
    "Contents"
})
public class Counter {
  @JsonProperty("RoutingVersion")
  private Integer routingVersion;
  @JsonProperty("updated")
  private Integer updated;
  @JsonProperty("TileVersion")
  private Integer tileVersion;
  @JsonProperty("ModifiedTime")
  private DateTime modifiedTime;
  @JsonProperty("copyright")
  private String copyright;
  @JsonProperty("ModelVersion")
  private Integer modelVersion;
  @JsonProperty("Expires")
  private DateTime expires;
  @JsonProperty("Contents")
  private List<Content> contents = null;
  @JsonIgnore
  private Map<String, Object> additionalProperties = new HashMap<String, Object>();

  @JsonProperty("RoutingVersion")
  public Integer getRoutingVersion() {
    return routingVersion;
  }

  @JsonProperty("RoutingVersion")
  public void setRoutingVersion(Integer routingVersion) {
    this.routingVersion = routingVersion;
  }

  @JsonProperty("updated")
  public Integer getUpdated() {
    return updated;
  }

  @JsonProperty("updated")
  public void setUpdated(Integer updated) {
    this.updated = updated;
  }

  @JsonProperty("TileVersion")
  public Integer getTileVersion() {
    return tileVersion;
  }

  @JsonProperty("TileVersion")
  public void setTileVersion(Integer tileVersion) {
    this.tileVersion = tileVersion;
  }

  @JsonProperty("ModifiedTime")
  @JsonDeserialize(using = JodaDateDeserializer.class)
  public DateTime getModifiedTime() {
    return modifiedTime;
  }

  @JsonProperty("ModifiedTime")
  public void setModifiedTime(DateTime modifiedTime) {
    this.modifiedTime = modifiedTime;
  }

  @JsonProperty("copyright")
  public String getCopyright() {
    return copyright;
  }

  @JsonProperty("copyright")
  public void setCopyright(String copyright) {
    this.copyright = copyright;
  }

  @JsonProperty("ModelVersion")
  public Integer getModelVersion() {
    return modelVersion;
  }

  @JsonProperty("ModelVersion")
  public void setModelVersion(Integer modelVersion) {
    this.modelVersion = modelVersion;
  }

  @JsonProperty("Expires")
  @JsonDeserialize(using = JodaDateDeserializer.class)
  public DateTime getExpires() {
    return expires;
  }

  @JsonProperty("Expires")
  public void setExpires(DateTime expires) {
    this.expires = expires;
  }

  @JsonProperty("Contents")
  public List<Content> getContents() {
    return contents;
  }

  @JsonProperty("Contents")
  public void setContents(List<Content> contents) {
    this.contents = contents;
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
