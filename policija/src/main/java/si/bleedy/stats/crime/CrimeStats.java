package si.bleedy.stats.crime;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * @author bratwurzt
 */
//@SpringBootApplication
public class CrimeStats
{
  private final static String s1 = "           ";
  private final static Pattern catalogSeparatorPattern = Pattern.compile(s1);
  private final static Pattern lineSeparatorPattern = Pattern.compile("  ");

  public CrimeStats() throws IOException
  {
//    Files.newDirectoryStream(Paths.get("K:/Temp/policija/kriminaliteta/kd2016/"))

    String pathString = "K:/Temp/policija/kriminaliteta/kd2016/KDL.SIFRANTI.txt";
    final Map<String, String> map = getCatalogMap(pathString);
    System.out.println();
  }

  private Map<String, String> getCatalogMap(String pathString) throws IOException
  {
    final Map<String, String> map = new HashMap<>();
    BufferedReader reader = Files.newBufferedReader(Paths.get(pathString), Charset.forName("Cp1250"));
    String catalogCode = getCatalogCode(reader.readLine());
    for (String line = reader.readLine(); line != null; line = reader.readLine())
    {
      if (!line.contains(s1))
      {
        if (line.trim().isEmpty())
        {
          break;
        }
        catalogCode = getCatalogCode(line);
      }
      else
      {
        String[] split = catalogSeparatorPattern.split(line);
        map.put(catalogCode + split[0], split[1]);
      }
    }
    return map;
  }

  private String getCatalogCode(String line)
  {
    return lineSeparatorPattern.split(line)[1];
  }

  public static void main(String[] args) throws IOException
  {
    new CrimeStats();
//    SpringApplication.run(CrimeStats.class, args);
  }

}
