package si.bleedy.saver.counter.pojos;

import com.fasterxml.jackson.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "y_wgs",
    "Description",
    "Title",
    "ContentName",
    "x_wgs",
    "CrsId",
    "stevci_cestaOpis",
    "Y",
    "X",
    "Icon",
    "Data",
    "Id",
    "stevci_lokacijaOpis"
})
public class Item {
  @JsonProperty("y_wgs")
  private Double yWgs;
  @JsonProperty("Description")
  private String description;
  @JsonProperty("Title")
  private String title;
  @JsonProperty("ContentName")
  private String contentName;
  @JsonProperty("x_wgs")
  private Double xWgs;
  @JsonProperty("CrsId")
  private String crsId;
  @JsonProperty("stevci_cestaOpis")
  private String stevciCestaOpis;
  @JsonProperty("Y")
  private Double y;
  @JsonProperty("X")
  private Double x;
  @JsonProperty("Icon")
  private String icon;
  @JsonProperty("Data")
  private List<Datum> data = null;
  @JsonProperty("Id")
  private String id;
  @JsonProperty("stevci_lokacijaOpis")
  private String stevciLokacijaOpis;
  @JsonIgnore
  private Map<String, Object> additionalProperties = new HashMap<String, Object>();

  @JsonProperty("y_wgs")
  public Double getYWgs() {
    return yWgs;
  }

  @JsonProperty("y_wgs")
  public void setYWgs(Double yWgs) {
    this.yWgs = yWgs;
  }

  @JsonProperty("Description")
  public String getDescription() {
    return description;
  }

  @JsonProperty("Description")
  public void setDescription(String description) {
    this.description = description;
  }

  @JsonProperty("Title")
  public String getTitle() {
    return title;
  }

  @JsonProperty("Title")
  public void setTitle(String title) {
    this.title = title;
  }

  @JsonProperty("ContentName")
  public String getContentName() {
    return contentName;
  }

  @JsonProperty("ContentName")
  public void setContentName(String contentName) {
    this.contentName = contentName;
  }

  @JsonProperty("x_wgs")
  public Double getXWgs() {
    return xWgs;
  }

  @JsonProperty("x_wgs")
  public void setXWgs(Double xWgs) {
    this.xWgs = xWgs;
  }

  @JsonProperty("CrsId")
  public String getCrsId() {
    return crsId;
  }

  @JsonProperty("CrsId")
  public void setCrsId(String crsId) {
    this.crsId = crsId;
  }

  @JsonProperty("stevci_cestaOpis")
  public String getStevciCestaOpis() {
    return stevciCestaOpis;
  }

  @JsonProperty("stevci_cestaOpis")
  public void setStevciCestaOpis(String stevciCestaOpis) {
    this.stevciCestaOpis = stevciCestaOpis;
  }

  @JsonProperty("Y")
  public Double getY() {
    return y;
  }

  @JsonProperty("Y")
  public void setY(Double y) {
    this.y = y;
  }

  @JsonProperty("X")
  public Double getX() {
    return x;
  }

  @JsonProperty("X")
  public void setX(Double x) {
    this.x = x;
  }

  @JsonProperty("Icon")
  public String getIcon() {
    return icon;
  }

  @JsonProperty("Icon")
  public void setIcon(String icon) {
    this.icon = icon;
  }

  @JsonProperty("Data")
  public List<Datum> getData() {
    return data;
  }

  @JsonProperty("Data")
  public void setData(List<Datum> data) {
    this.data = data;
  }

  @JsonProperty("Id")
  public String getId() {
    return id;
  }

  @JsonProperty("Id")
  public void setId(String id) {
    this.id = id;
  }

  @JsonProperty("stevci_lokacijaOpis")
  public String getStevciLokacijaOpis() {
    return stevciLokacijaOpis;
  }

  @JsonProperty("stevci_lokacijaOpis")
  public void setStevciLokacijaOpis(String stevciLokacijaOpis) {
    this.stevciLokacijaOpis = stevciLokacijaOpis;
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
