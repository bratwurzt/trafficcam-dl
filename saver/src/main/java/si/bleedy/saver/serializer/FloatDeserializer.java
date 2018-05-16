package si.bleedy.saver.serializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdScalarDeserializer;

import java.io.IOException;

/**
 * @author bratwurzt
 */
public class FloatDeserializer extends StdScalarDeserializer<Float> {

  protected FloatDeserializer() {
    super(Float.class);
  }

  @Override
  public Float deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
    JsonToken currentToken = p.getCurrentToken();
    if (currentToken == JsonToken.VALUE_STRING) {
      String trimmed = p.getText().trim();
      return Float.parseFloat(trimmed.replace(',', '.'));
    }
    return (Float) ctxt.handleUnexpectedToken(handledType(), p);
  }
}
