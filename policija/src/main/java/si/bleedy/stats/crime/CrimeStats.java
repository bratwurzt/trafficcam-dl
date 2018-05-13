package si.bleedy.stats.crime;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.*;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @author bratwurzt
 */
//@SpringBootApplication
public class CrimeStats {
  private final static String s1 = "           ";
  private final static Pattern catalogSeparatorPattern = Pattern.compile(s1);
  private final static Pattern lineSeparatorPattern = Pattern.compile("  ");

  public CrimeStats() throws IOException {
//        List<Path> paths = listSourceFiles(Paths.get("K:/Temp/policija/kriminaliteta/kd2016/"));
    final Map<String, String> catalogMap = getCatalogMap("K:/Temp/policija/kriminaliteta/kd2016/KDL.SIFRANTI.txt");

    try (Stream<String> stream = Files.lines(Paths.get("K:/Temp/policija/kriminaliteta/kd2016/KDL.OSEBE.txt"), Charset.forName("Cp1250"))) {

      Set<String> list = stream
          .map(line -> {
            String[] split = line.split("\\$");
             return split[4];
          })
          .collect(Collectors.toSet());

      // 4. print result list
      list.forEach(System.out::println);

    } catch (IOException ioe) {
      ioe.printStackTrace();
    }
  }

  List<Path> listSourceFiles(Path dir) throws IOException {
    List<Path> result = new ArrayList<>();
    try (DirectoryStream<Path> stream = Files.newDirectoryStream(dir, "*.{txt}")) {
      for (Path entry : stream) {
        result.add(entry);
      }
    } catch (DirectoryIteratorException ex) {
      // I/O error encounted during the iteration, the cause is an IOException
      throw ex.getCause();
    }
    return result;
  }

  private Map<String, String> getCatalogMap(String pathString) throws IOException {
    final Map<String, String> map = new HashMap<>();
    BufferedReader reader = Files.newBufferedReader(Paths.get(pathString), Charset.forName("Cp1250"));
    String catalogCode = getCatalogCode(reader.readLine());
    for (String line = reader.readLine(); line != null; line = reader.readLine()) {
      if (!line.contains(s1)) {
        if (line.trim().isEmpty()) {
          continue;
        }
        catalogCode = getCatalogCode(line.trim());
      } else {
        String[] split = catalogSeparatorPattern.split(line);
        map.put(catalogCode + split[0].trim(), split[1].trim());
      }
    }
    return map;
  }

  private String getCatalogCode(String line) {
    return lineSeparatorPattern.split(line)[1];
  }

  public static void main(String[] args) throws IOException {
    new CrimeStats();
//    SpringApplication.run(CrimeStats.class, args);
  }

}
