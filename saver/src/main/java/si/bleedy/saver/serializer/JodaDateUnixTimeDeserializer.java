package si.bleedy.saver.serializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdScalarDeserializer;
import org.joda.time.DateTime;

import java.io.IOException;
import java.math.BigInteger;

/**
 * @author bratwurzt
 */
public class JodaDateUnixTimeDeserializer extends StdScalarDeserializer<DateTime> {
  protected JodaDateUnixTimeDeserializer() {
    super(DateTime.class);
  }

  @Override
  public DateTime deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException {
    JsonToken currentToken = jsonParser.getCurrentToken();
    if (currentToken == JsonToken.VALUE_NUMBER_INT) {
      BigInteger unixTimeAsString = jsonParser.getBigIntegerValue();
      return new DateTime(unixTimeAsString.longValue() * 1000);
    }
    throw deserializationContext.mappingException(getValueClass());
  }
}
