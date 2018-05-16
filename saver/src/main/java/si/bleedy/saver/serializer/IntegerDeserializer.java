package si.bleedy.saver.serializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdScalarDeserializer;

import java.io.IOException;

/**
 * @author bratwurzt
 */
public class IntegerDeserializer extends StdScalarDeserializer<Integer> {
  protected IntegerDeserializer() {
    super(Integer.class);
  }

  @Override
  public Integer deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException {
    JsonToken currentToken = jsonParser.getCurrentToken();
    if (currentToken == JsonToken.VALUE_STRING) {
      String trimmed = jsonParser.getText().trim();
      return Integer.parseInt(trimmed.contains(",") ? trimmed.substring(0, trimmed.indexOf(',')) : trimmed);
    }
    return (Integer) deserializationContext.handleUnexpectedToken(handledType(), jsonParser);
  }
}
