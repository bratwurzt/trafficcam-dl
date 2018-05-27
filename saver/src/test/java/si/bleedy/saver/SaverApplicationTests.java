package si.bleedy.saver;

import org.jsoup.Jsoup;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
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

@DataJpaTest
@RunWith(SpringRunner.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class SaverApplicationTests {

  @Autowired
  private StreetRepository streetRepository;

  @Autowired
  private CarRepository carRepository;

  @Autowired
  private TowTimelineCrudRepository towTimelineCrudRepository;

  @Test
  public void testTowAddedCars() throws URISyntaxException, IOException {
    JsoupDao jsoupDao = Mockito.mock(JsoupDao.class);
    CarTowSaver carTowSaver = new CarTowSaver(towTimelineCrudRepository, carRepository, streetRepository, jsoupDao);
    URL url = SaverApplicationTests.class.getResource("/tow_before.html");
    String htmlBefore = new java.util.Scanner(new File(url.toURI()), StandardCharsets.UTF_8.name()).useDelimiter("\\Z").next();
    Mockito.when(jsoupDao.downloadDoc()).then(invocationOnMock -> Jsoup.parse(htmlBefore));

    carTowSaver.saveCarTows();
    url = SaverApplicationTests.class.getResource("/tow_after_added.html");
    String htmlAfter = new java.util.Scanner(new File(url.toURI()), StandardCharsets.UTF_8.name()).useDelimiter("\\Z").next();
    Mockito.when(jsoupDao.downloadDoc()).then(invocationOnMock -> Jsoup.parse(htmlAfter));

    carTowSaver.saveCarTows();
  }

  @Test
  public void testTowRemovedCars() throws URISyntaxException, IOException {
    JsoupDao jsoupDao = Mockito.mock(JsoupDao.class);
    CarTowSaver carTowSaver = new CarTowSaver(towTimelineCrudRepository, carRepository, streetRepository, jsoupDao);
    URL url = SaverApplicationTests.class.getResource("/tow_before.html");
    String htmlBefore = new java.util.Scanner(new File(url.toURI()), StandardCharsets.UTF_8.name()).useDelimiter("\\Z").next();
    Mockito.when(jsoupDao.downloadDoc()).then(invocationOnMock -> Jsoup.parse(htmlBefore));

    carTowSaver.saveCarTows();
    url = SaverApplicationTests.class.getResource("/tow_after_removed.html");
    String htmlAfter = new java.util.Scanner(new File(url.toURI()), StandardCharsets.UTF_8.name()).useDelimiter("\\Z").next();
    Mockito.when(jsoupDao.downloadDoc()).then(invocationOnMock -> Jsoup.parse(htmlAfter));

    carTowSaver.saveCarTows();
  }

}
