package si.bleedy.saver.tow;

import org.joda.time.DateTime;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import si.bleedy.saver.service.JsoupDao;
import si.bleedy.saver.tow.data.TowTimeline;
import si.bleedy.saver.tow.service.CarRepository;
import si.bleedy.saver.tow.service.StreetRepository;
import si.bleedy.saver.tow.service.TowTimelineCrudRepository;

import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author bratwurzt
 */
@Component
public class CarTowSaver {
  private static final Logger LOG = LoggerFactory.getLogger(CarTowSaver.class);
  private DateFormat dateFormatter = new SimpleDateFormat("dd.MM.yyyy H:mm:ss");
  private DateFormat dayDateFormatter = new SimpleDateFormat("dd.MM.yyyy");
  private DateTime lastModified = null;
  private Document previousDoc;
  private final Set<TowTimeline> TOW_TIMELINES = new HashSet<>();

  private final TowTimelineCrudRepository towTimelineCrudRepository;
  private final CarRepository carRepository;
  private final StreetRepository streetRepository;
  private final JsoupDao jsoupDao;

  @Autowired
  public CarTowSaver(
      TowTimelineCrudRepository towTimelineCrudRepository,
      CarRepository carRepository,
      StreetRepository streetRepository,
      JsoupDao jsoupDao) {
    this.towTimelineCrudRepository = towTimelineCrudRepository;
    this.carRepository = carRepository;
    this.streetRepository = streetRepository;
    this.jsoupDao = jsoupDao;
  }

  @Async
  @Scheduled(fixedRateString = "${saver.tow.scheduledMillis}")
  public void saveCarTows() {
    int retries = 0;
    try {
      while (retries++ < 5) {
        try {
          Document doc = jsoupDao.downloadDoc();
          if (doc == null) continue;
          String cssQuery = "div[class=title_1_bg head_bg rightside]";
          Elements elements = doc.select(cssQuery);
          if (elements == null || elements.isEmpty()) {
            LOG.error("Error, retry " + retries + ": No element for '" + cssQuery + "' found in " + doc.toString());
            continue;
          }
          String modifiedString = elements.first().text();
          DateTime modified = new DateTime(dateFormatter.parse(modifiedString.substring("Zadnja posodobitev: ".length())).getTime());
          if (!modified.equals(lastModified)) {
            Long lastChange = System.currentTimeMillis();
            DateTime created = new DateTime();
            Set<TowTimeline> towTimelines = doc.select("tr[class^=table_list]").stream()
                .map(el -> {
                  try {
                    return new TowTimeline(
                        carRepository.findById(carRepository.save(
                            el.select("td").get(0).text(),
                            el.select("td").get(1).text(),
                            el.select("td").get(2).text())),
                        streetRepository.findById(streetRepository.save(el.select("td").get(3).text())),
                        new DateTime(dayDateFormatter.parse(el.select("td").get(4).text()).getTime()),
                        created
                    );
                  } catch (NoSuchElementException | ParseException e) {
                    throw new RuntimeException(e);
                  }
                })
                .collect(Collectors.toSet());

            if (!towTimelines.isEmpty()) {
              long savedCount = 0, updatedCount = 0;
              if (TOW_TIMELINES.isEmpty()) {
                TOW_TIMELINES.addAll(towTimelines);
                Set<TowTimeline> filteredTowTimelines = TOW_TIMELINES.stream()
                    .filter(tt -> towTimelineCrudRepository.find(
                        tt.getCar().getBrand(),
                        tt.getCar().getModel(),
                        tt.getCar().getColour(),
                        tt.getStreet().getName(),
                        tt.getDayTowed()) == null)
                    .collect(Collectors.toSet());
                if (!filteredTowTimelines.isEmpty()) {
                  Iterable<TowTimeline> savedTowTimelines = towTimelineCrudRepository.saveAll(filteredTowTimelines);
                  savedCount = savedTowTimelines.spliterator().getExactSizeIfKnown();
                }
              } else {
                Set<TowTimeline> intersection = intersection(TOW_TIMELINES, towTimelines);
                if (!intersection.isEmpty()) {
                  try {
                    Set<TowTimeline> changesOnOldSet = difference(TOW_TIMELINES, intersection);
                    updatedCount += changesOnOldSet.stream()
                        .map(towTimeline -> {
                          towTimeline.setTimePickedUp(modified);
                          TowTimeline save = null;
                          try {
                            save = towTimelineCrudRepository.save(towTimeline);
                          } catch (Exception e) {
                            LOG.error("Error while saving towTimeline", e);
                          }
                          return save;
                        })
                        .filter(Objects::nonNull)
                        .count();
                    Set<TowTimeline> changesOnNewSet = difference(towTimelines, intersection);
                    savedCount += changesOnNewSet.stream()
                        .filter(tt -> towTimelineCrudRepository.find(
                            tt.getCar().getBrand(),
                            tt.getCar().getModel(),
                            tt.getCar().getColour(),
                            tt.getStreet().getName(),
                            tt.getDayTowed()) == null)
                        .map(towTimelineCrudRepository::save)
                        .count();
                  } finally {
                    TOW_TIMELINES.clear();
                    TOW_TIMELINES.addAll(towTimelines);
                  }
                }
              }
              long millis = System.currentTimeMillis() - lastChange;
              if (savedCount > 0) {
                LOG.debug("Saved " + savedCount + " of car tow data in " + millis / 1000 + "s");
              }
              if (updatedCount > 0) {
                LOG.debug("Updated " + updatedCount + " of car tow data in " + millis / 1000 + "s");
              }

            }
            lastModified = modified;
            previousDoc = doc;
          }
        } catch (IOException e) {
          LOG.error("Error, retry " + retries, e);
        }
        return;
      }
      Thread.sleep(30000);
    } catch (ParseException | InterruptedException e) {
      LOG.error("Error: ", e);
    }
  }


  public <T> Set<T> union(Set<T> setA, Set<T> setB) {
    Set<T> tmp = new HashSet<T>(setA);
    tmp.addAll(setB);
    return tmp;
  }

  private <T> Set<T> intersection(Set<T> setA, Set<T> setB) {
    Set<T> tmp = new HashSet<T>(setA);
    tmp.retainAll(setB);
    return tmp;
  }

  private <T> Set<T> difference(Set<T> setA, Set<T> setB) {
    Set<T> tmp = new HashSet<>(setA);
    tmp.removeAll(setB);
    return tmp;
  }
}
