package si.bleedy.saver.counter.pojos;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import si.bleedy.saver.serializer.IntegerDeserializer;

import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "stevci_statOpis",
    "stevci_gap",
    "stevci_hit",
    "stevci_stev",
    "stevci_pasOpis",
    "stevci_smerOpis",
    "stevci_stat"
})
public class Properties {

  @JsonProperty("stevci_statOpis")
  private String stevciStatOpis;
  @JsonProperty("stevci_gap")
  private String stevciGap;
  @JsonProperty("stevci_hit")
  private Integer stevciHit;
  @JsonProperty("stevci_stev")
  private Integer stevciStev;
  @JsonProperty("stevci_pasOpis")
  private String stevciPasOpis;
  @JsonProperty("stevci_smerOpis")
  private String stevciSmerOpis;
  @JsonProperty("stevci_stat")
  private String stevciStat;
  @JsonIgnore
  private Map<String, Object> additionalProperties = new HashMap<String, Object>();

  @JsonProperty("stevci_statOpis")
  public String getStevciStatOpis() {
    return stevciStatOpis;
  }

  @JsonProperty("stevci_statOpis")
  public void setStevciStatOpis(String stevciStatOpis) {
    this.stevciStatOpis = stevciStatOpis;
  }

  @JsonProperty("stevci_gap")
  public String getStevciGap() {
    return stevciGap;
  }

  @JsonProperty("stevci_gap")
  public void setStevciGap(String stevciGap) {
    this.stevciGap = stevciGap;
  }

  @JsonProperty("stevci_hit")
  @JsonDeserialize(using = IntegerDeserializer.class)
  public Integer getStevciHit() {
    return stevciHit;
  }

  @JsonProperty("stevci_hit")
  public void setStevciHit(Integer stevciHit) {
    this.stevciHit = stevciHit;
  }

  @JsonProperty("stevci_stev")
  @JsonDeserialize(using = IntegerDeserializer.class)
  public Integer getStevciStev() {
    return stevciStev;
  }

  @JsonProperty("stevci_stev")
  public void setStevciStev(Integer stevciStev) {
    this.stevciStev = stevciStev;
  }

  @JsonProperty("stevci_pasOpis")
  public String getStevciPasOpis() {
    return stevciPasOpis;
  }

  @JsonProperty("stevci_pasOpis")
  public void setStevciPasOpis(String stevciPasOpis) {
    this.stevciPasOpis = stevciPasOpis;
  }

  @JsonProperty("stevci_smerOpis")
  public String getStevciSmerOpis() {
    return stevciSmerOpis;
  }

  @JsonProperty("stevci_smerOpis")
  public void setStevciSmerOpis(String stevciSmerOpis) {
    this.stevciSmerOpis = stevciSmerOpis;
  }

  @JsonProperty("stevci_stat")
  public String getStevciStat() {
    return stevciStat;
  }

  @JsonProperty("stevci_stat")
  public void setStevciStat(String stevciStat) {
    this.stevciStat = stevciStat;
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
