package si.bleedy.saver;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import si.bleedy.saver.service.JsoupDao;
import si.bleedy.saver.tow.CarTowSaver;
import si.bleedy.saver.tow.service.CarRepository;
import si.bleedy.saver.tow.service.StreetRepository;
import si.bleedy.saver.tow.service.TowTimelineCrudRepository;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@RunWith(SpringRunner.class)
public class SaverApplicationTests {

  @Test
  public void testTowJsoup() {
    try {
      TowTimelineCrudRepository towTimelineCrudRepository = Mockito.mock(TowTimelineCrudRepository.class);
      CarRepository carRepository = Mockito.mock(CarRepository.class);
      StreetRepository streetRepository = Mockito.mock(StreetRepository.class);
      JsoupDao jsoupDao = Mockito.mock(JsoupDao.class);
      CarTowSaver carTowSaver = new CarTowSaver(towTimelineCrudRepository, carRepository, streetRepository, jsoupDao);
      URL url = SaverApplicationTests.class.getResource("/tow_before.html");
      String htmlBefore = new java.util.Scanner(new File(url.toURI()), StandardCharsets.UTF_8.name()).useDelimiter("\\Z").next();
      Mockito.when(jsoupDao.downloadDoc()).then(invocationOnMock -> Jsoup.parse(htmlBefore));

      carTowSaver.saveCarTows();

//      Document parse = jsoupDao.downloadDoc();
//      Document doc = Jsoup.connect("http://www.lpt.si/parkirisca_pajki/parkirisca/zapuscena_vozila").get();
      System.out.println();
    } catch (IOException | URISyntaxException e) {
    }
  }
}
