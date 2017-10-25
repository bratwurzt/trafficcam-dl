
package si.bleedy.saver.weather.pojos;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "forecast_time",
    "clouds",
    "rain",
    "offset"
})
public class Datum {

    @JsonProperty("forecast_time")
    private String forecastTime;
    @JsonProperty("clouds")
    private Integer clouds;
    @JsonProperty("rain")
    private Integer rain;
    @JsonProperty("offset")
    private Integer offset;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("forecast_time")
    public String getForecastTime() {
        return forecastTime;
    }

    @JsonProperty("forecast_time")
    public void setForecastTime(String forecastTime) {
        this.forecastTime = forecastTime;
    }

    @JsonProperty("clouds")
    public Integer getClouds() {
        return clouds;
    }

    @JsonProperty("clouds")
    public void setClouds(Integer clouds) {
        this.clouds = clouds;
    }

    @JsonProperty("rain")
    public Integer getRain() {
        return rain;
    }

    @JsonProperty("rain")
    public void setRain(Integer rain) {
        this.rain = rain;
    }

    @JsonProperty("offset")
    public Integer getOffset() {
        return offset;
    }

    @JsonProperty("offset")
    public void setOffset(Integer offset) {
        this.offset = offset;
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
