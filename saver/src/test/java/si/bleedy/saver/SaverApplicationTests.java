package si.bleedy.saver;

import org.jsoup.Jsoup;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;
import si.bleedy.saver.service.JsoupDao;
import si.bleedy.saver.tow.CarTowSaver;
import si.bleedy.saver.tow.data.TowTimeline;
import si.bleedy.saver.tow.service.CarRepository;
import si.bleedy.saver.tow.service.StreetRepository;
import si.bleedy.saver.tow.service.TowTimelineCrudRepository;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.stream.StreamSupport;

@DataJpaTest(showSql = false)
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
    long updatedCount = StreamSupport.stream(towTimelineCrudRepository.findAll().spliterator(), false)
        .filter(t -> t.getTimePickedUp() != null)
        .count();
    long allCount = towTimelineCrudRepository.count();

    url = SaverApplicationTests.class.getResource("/tow_after_added.html");
    String htmlAfter = new java.util.Scanner(new File(url.toURI()), StandardCharsets.UTF_8.name()).useDelimiter("\\Z").next();
    Mockito.when(jsoupDao.downloadDoc()).then(invocationOnMock -> Jsoup.parse(htmlAfter));
    carTowSaver.saveCarTows();
    allCount -= towTimelineCrudRepository.count();
    Assert.assertEquals(allCount, -22L);

    updatedCount -= StreamSupport.stream(towTimelineCrudRepository.findAll().spliterator(), false)
            .filter(t -> t.getTimePickedUp() != null)
            .count();
    Assert.assertEquals(updatedCount, -12L);
  }

  @Test
  public void testTowRemovedCars() throws URISyntaxException, IOException {
    JsoupDao jsoupDao = Mockito.mock(JsoupDao.class);
    CarTowSaver carTowSaver = new CarTowSaver(towTimelineCrudRepository, carRepository, streetRepository, jsoupDao);
    URL url = SaverApplicationTests.class.getResource("/tow_before.html");
    String htmlBefore = new java.util.Scanner(new File(url.toURI()), StandardCharsets.UTF_8.name()).useDelimiter("\\Z").next();
    Mockito.when(jsoupDao.downloadDoc()).then(invocationOnMock -> Jsoup.parse(htmlBefore));

    carTowSaver.saveCarTows();
    long updatedCount = StreamSupport.stream(towTimelineCrudRepository.findAll().spliterator(), false)
        .filter(t -> t.getTimePickedUp() != null)
        .count();
    long allCount = towTimelineCrudRepository.count();
    url = SaverApplicationTests.class.getResource("/tow_after_removed.html");
    String htmlAfter = new java.util.Scanner(new File(url.toURI()), StandardCharsets.UTF_8.name()).useDelimiter("\\Z").next();
    Mockito.when(jsoupDao.downloadDoc()).then(invocationOnMock -> Jsoup.parse(htmlAfter));

    carTowSaver.saveCarTows();
    allCount -= towTimelineCrudRepository.count();
    Assert.assertEquals(allCount, 0L);

    updatedCount -= StreamSupport.stream(towTimelineCrudRepository.findAll().spliterator(), false)
            .filter(t -> t.getTimePickedUp() != null)
            .count();
    Assert.assertEquals(updatedCount, -1L);
  }

}
