package si.bleedy.saver.serializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdScalarDeserializer;
import org.joda.time.DateTime;

import java.io.IOException;

/**
 * @author bratwurzt
 */
public class JodaDateDeserializer extends StdScalarDeserializer<DateTime>
{
  protected JodaDateDeserializer()
  {
    super(DateTime.class);
  }

  @Override
  public DateTime deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException
  {
    JsonToken currentToken = jsonParser.getCurrentToken();
    if (currentToken == JsonToken.VALUE_STRING)
    {
      String dateTimeAsString = jsonParser.getText().trim();
      return new DateTime(dateTimeAsString);
    }
    throw deserializationContext.mappingException(getValueClass());
  }
}
