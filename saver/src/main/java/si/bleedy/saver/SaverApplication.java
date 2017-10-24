package si.bleedy.saver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class SaverApplication
{
  public static void main(String[] args)
  {
    SpringApplication.run(SaverApplication.class, args);
  }
}
