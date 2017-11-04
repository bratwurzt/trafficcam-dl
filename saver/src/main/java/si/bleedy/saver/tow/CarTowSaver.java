package si.bleedy.saver.tow;

import org.joda.time.DateTime;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import si.bleedy.saver.tow.data.TowTimeline;
import si.bleedy.saver.tow.service.CarRepository;
import si.bleedy.saver.tow.service.StreetRepository;
import si.bleedy.saver.tow.service.TowTimelineCrudRepository;

import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashSet;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

/**
 * @author bratwurzt
 */
@Component
public class CarTowSaver
{
  private static final Logger LOG = LoggerFactory.getLogger(CarTowSaver.class);
  private DateFormat dateFormatter = new SimpleDateFormat("dd.MM.yyyy H:mm:ss");
  private DateFormat dayDateFormatter = new SimpleDateFormat("dd.MM.yyyy");
  private DateTime lastModified = null;
  private final Set<TowTimeline> TOW_TIMELINES = new HashSet<>();

  private final TowTimelineCrudRepository towTimelineCrudRepository;
  private final CarRepository carRepository;
  private final StreetRepository streetRepository;

  @Autowired
  public CarTowSaver(
      TowTimelineCrudRepository towTimelineCrudRepository,
      CarRepository carRepository,
      StreetRepository streetRepository)
  {
    this.towTimelineCrudRepository = towTimelineCrudRepository;
    this.carRepository = carRepository;
    this.streetRepository = streetRepository;
  }

  @Async
  @Scheduled(fixedRateString = "${saver.tow.scheduledMillis:300000}")
  public void saveCounters()
  {
    try
    {
      Document doc = Jsoup.connect("http://www.lpt.si/parkirisca_pajki/parkirisca/zapuscena_vozila").get();
      String modifiedString = doc.select("div[class=title_1_bg head_bg rightside]").first().text();
      DateTime modified = new DateTime(dateFormatter.parse(modifiedString.substring("Zadnja posodobitev: ".length())).getTime());
      if (!modified.equals(lastModified))
      {
        Long lastChange = System.currentTimeMillis();
        DateTime created = new DateTime();
        Set<TowTimeline> towTimelines = doc.select("tr[class^=table_list]").stream()
            .map(el -> {
              try
              {
                return new TowTimeline(
                    carRepository.findOne(carRepository.save(
                        el.select("td").get(0).text(),
                        el.select("td").get(1).text(),
                        el.select("td").get(2).text())),
                    streetRepository.findOne(streetRepository.save(el.select("td").get(3).text())),
                    new DateTime(dayDateFormatter.parse(el.select("td").get(4).text()).getTime()),
                    created
                );
              }
              catch (ParseException e)
              {
                throw new RuntimeException(e);
              }
            })
            .collect(Collectors.toSet());

        if (!towTimelines.isEmpty())
        {
          long savedCount = 0, updatedCount = 0;
          if (TOW_TIMELINES.isEmpty())
          {
            TOW_TIMELINES.addAll(towTimelines);
            Set<TowTimeline> filteredTowTimelines = TOW_TIMELINES.stream()
                .filter(tt -> towTimelineCrudRepository.find(
                    tt.getCar().getBrand(),
                    tt.getCar().getModel(),
                    tt.getCar().getColour(),
                    tt.getStreet().getName(),
                    tt.getDayTowed()) == null)
                .collect(Collectors.toSet());
            if (!filteredTowTimelines.isEmpty())
            {
              Iterable<TowTimeline> savedTowTimelines = towTimelineCrudRepository.save(filteredTowTimelines);
              savedCount = savedTowTimelines.spliterator().getExactSizeIfKnown();
            }
          }
          else
          {
            Set<TowTimeline> intersection = intersection(TOW_TIMELINES, towTimelines);
            if (!intersection.isEmpty())
            {
              Set<TowTimeline> changesOnOldSet = difference(TOW_TIMELINES, intersection);
              updatedCount += changesOnOldSet.stream()
                  .map(towTimeline -> {
                    towTimeline.setTimePickedUp(modified);
                    return towTimelineCrudRepository.save(towTimeline);
                  })
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
            }
          }
          long millis = System.currentTimeMillis() - lastChange;
          if (savedCount > 0)
          {
            LOG.debug("Saved " + savedCount + " of car tow data in " + millis / 1000 + "s");
          }
          if (updatedCount > 0)
          {
            LOG.debug("Updated " + updatedCount + " of car tow data in " + millis / 1000 + "s");
          }

        }
        lastModified = modified;
      }
    }
    catch (IOException | ParseException e)
    {
      LOG.error("Error: ", e);
    }
  }

  public <T> Set<T> union(Set<T> setA, Set<T> setB)
  {
    Set<T> tmp = new TreeSet<T>(setA);
    tmp.addAll(setB);
    return tmp;
  }

  private <T> Set<T> intersection(Set<T> setA, Set<T> setB)
  {
    Set<T> tmp = new TreeSet<T>(setA);
    tmp.retainAll(setB);
    return tmp;
  }

  private <T> Set<T> difference(Set<T> setA, Set<T> setB)
  {
    Set<T> tmp = new TreeSet<T>(setA);
    tmp.removeAll(setB);
    return tmp;
  }
}
