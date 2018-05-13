package si.bleedy.saver.service;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * @author bratwurzt
 */
@Component
public class JsoupDao {
  public Document downloadDoc() throws IOException {
    Connection connect = Jsoup.connect("http://www.lpt.si/parkirisca_pajki/parkirisca/zapuscena_vozila");
    if (connect == null) {
      return null;
    }
    Document doc = connect.get();
    if (doc == null) {
      return null;
    }
    return doc;
  }

}
