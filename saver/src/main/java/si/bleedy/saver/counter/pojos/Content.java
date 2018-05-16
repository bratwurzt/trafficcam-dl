package si.bleedy.saver.counter.pojos;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.joda.time.DateTime;
import si.bleedy.saver.serializer.JodaDateDeserializer;

import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "ModifiedTime",
    "Language",
    "IsModified",
    "ContentName",
    "Expires",
    "ETag",
    "Data"
})
public class Content {

  @JsonProperty("ModifiedTime")
  private DateTime modifiedTime;
  @JsonProperty("Language")
  private String language;
  @JsonProperty("IsModified")
  private Boolean isModified;
  @JsonProperty("ContentName")
  private String contentName;
  @JsonProperty("Expires")
  private DateTime expires;
  @JsonProperty("ETag")
  private String eTag;
  @JsonProperty("Data")
  private Data data;
  @JsonIgnore
  private Map<String, Object> additionalProperties = new HashMap<String, Object>();

  @JsonProperty("ModifiedTime")
  @JsonDeserialize(using = JodaDateDeserializer.class)
  public DateTime getModifiedTime() {
    return modifiedTime;
  }

  @JsonProperty("ModifiedTime")
  public void setModifiedTime(DateTime modifiedTime) {
    this.modifiedTime = modifiedTime;
  }

  @JsonProperty("Language")
  public String getLanguage() {
    return language;
  }

  @JsonProperty("Language")
  public void setLanguage(String language) {
    this.language = language;
  }

  @JsonProperty("IsModified")
  public Boolean getIsModified() {
    return isModified;
  }

  @JsonProperty("IsModified")
  public void setIsModified(Boolean isModified) {
    this.isModified = isModified;
  }

  @JsonProperty("ContentName")
  public String getContentName() {
    return contentName;
  }

  @JsonProperty("ContentName")
  public void setContentName(String contentName) {
    this.contentName = contentName;
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

  @JsonProperty("ETag")
  public String getETag() {
    return eTag;
  }

  @JsonProperty("ETag")
  public void setETag(String eTag) {
    this.eTag = eTag;
  }

  @JsonProperty("Data")
  public Data getData() {
    return data;
  }

  @JsonProperty("Data")
  public void setData(Data data) {
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
