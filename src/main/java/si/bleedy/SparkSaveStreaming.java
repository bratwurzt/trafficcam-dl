package si.bleedy;

import java.io.Serializable;
import java.net.URL;
import java.util.Arrays;
import javax.swing.JPanel;

import com.datastax.spark.connector.japi.CassandraJavaUtil;
import com.datastax.spark.connector.japi.CassandraStreamingJavaUtil;
import org.apache.log4j.PropertyConfigurator;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.function.FlatMapFunction;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.Durations;
import org.apache.spark.streaming.api.java.JavaDStream;
import org.apache.spark.streaming.api.java.JavaStreamingContext;
import org.apache.spark.streaming.mqtt.MQTTUtils;
import si.bleedy.data.ObservationData;
import si.bleedy.runnable.IOTTCPReceiver;

/**
 * @author bratwurzt
 */
public class SparkSaveStreaming extends JPanel implements Serializable
{
  private static final long serialVersionUID = -4289949126909167376L;
  private float m_vcc = 5.0f, ganancia = 5.0f, RefTension = 2.98f, Ra = 4640.0f, Rc = 4719.0f, Rb = 698.0f;

//  static
//  {
//    URL url = Thread.currentThread().getContextClassLoader().getResource("config/log4j.properties");
//    PropertyConfigurator.configure(url);
//  }

  public SparkSaveStreaming()
  {
    SparkConf conf = new SparkConf()
        .setAppName("heart")
        .set("spark.cassandra.connection.host", "cassandra.marand.si")
        .set("spark.cassandra.connection.port", "9042")
        .setMaster("local[2]");

    // streaming
    JavaStreamingContext ssc = new JavaStreamingContext(conf, Durations.seconds(1));

    JavaDStream<ObservationData> zephyrStream = ssc.receiverStream(
        new IOTTCPReceiver(StorageLevel.MEMORY_ONLY(), 8099)
    )
        .filter((Function<ObservationData, Boolean>)ObservationData::filterZephyr);

    CassandraStreamingJavaUtil.javaFunctions(zephyrStream)
        .writerBuilder("obskeyspace", "observations", CassandraJavaUtil.mapToRow(ObservationData.class))
        .saveToCassandra();

//    JavaDStream<ObservationData> cassStream = ssc.receiverStream(
//        new IOTTCPReceiver(StorageLevel.MEMORY_ONLY(), 8111)
//    );

//    final JavaDStream<ObservationData> mqttStream = MQTTUtils.createStream(ssc, "tcp://192.168.1.33:1883", "temp/gsr")
//        .map(entry -> entry.split("\\|"))
//        .flatMap((FlatMapFunction<String[], ObservationData>)strings -> {
//          int tempAnalog = Integer.parseInt(strings[0]);
//          int gsrAnalog = Integer.parseInt(strings[1]);
//          long timestamp = Long.parseLong(strings[2]);
//          return Arrays.asList(
//              //computeConductance(gsrAnalog, timestamp),
//              //computeTemperature(tempAnalog, timestamp)
//              new ObservationData("temp", "mV", timestamp, getVoltage(tempAnalog)),
//              new ObservationData("gsr", "mV", timestamp, getVoltage(gsrAnalog))
//          );
//        })
        //.window(Durations.milliseconds(1000), Durations.milliseconds(500))
        //.transform(new Function2<JavaRDD<ObservationData>, Time, JavaRDD<ObservationData>>()  // mean over last 5 seconds
        //{
        //  private static final long serialVersionUID = 5455964470681463716L;
        //
        //  @Override
        //  public JavaRDD<ObservationData> call(JavaRDD<ObservationData> rdd, Time time) throws Exception
        //  {
        //    if (rdd != null && rdd.count() > 0)
        //    {
        //      return rdd.sortBy((Function<ObservationData, Long>)ObservationData::getTimestamp, false, 2)
        //          .groupBy(ObservationData::getName)
        //          .mapValues(o -> {
        //            if (o != null)
        //            {
        //              int size = Iterables.size(o);
        //              if (size > 0)
        //              {
        //                double avgValue = 0;
        //                String name1 = null;
        //                Long maxTimestamp = 0L, minTimestamp = Long.MAX_VALUE;
        //                for (ObservationData d : o)
        //                {
        //                  avgValue += d.getValue();
        //                  if (name1 == null)
        //                  {
        //                    name1 = d.getName();
        //                  }
        //                  if (d.getTimestamp() > maxTimestamp)
        //                  {
        //                    maxTimestamp = d.getTimestamp();
        //                  }
        //                  if (d.getTimestamp() < minTimestamp)
        //                  {
        //                    minTimestamp = d.getTimestamp();
        //                  }
        //                }
        //                avgValue /= size;
        //                return new ObservationData(
        //                    name1,
        //                    "",
        //                    (maxTimestamp + minTimestamp) / 2,
        //                    avgValue
        //                );
        //              }
        //            }
        //            return null;
        //          })
        //          .values();
        //    }
        //    return rdd;
        //  }
        //})
        ;

    // filter Zephyr ecg
    //    JavaDStream<ObservationData> filteredZephyrStream = zephyrStream
    //        .filter((Function<ObservationData, Boolean>)ObservationData::filterZephyr);

    //    zephyrStream.filter(e -> "ecg".equals(e.getName()))
    //        .foreachRDD((Function2<JavaRDD<ObservationData>, Time, Void>)(rdd, time) -> {
    //          if (rdd.count() > 0)
    //          {
    //            long count = rdd.count();
    //            // Calculate statistics based on the content size.
    //            long usable = rdd.filter(e -> e.getValue() < 1000).count();
    //            long unusable = count - usable;
    //            System.out.println(String.format("Number of ecg samples in 1 second: All: %s Usable: %s, Unusable: %s", count, usable, unusable));
    //          }
    //          return null;
    //        });

    ssc.start();
    ssc.awaitTermination();
  }

  private ObservationData computeConductance(int gsrAnalog, long timestamp)
  {
    float voltage = getVoltage(gsrAnalog);
    double conductance = 2 * ((voltage - 0.497) / 100000);
    return new ObservationData("gsr", "resistance", timestamp, conductance);
  }

  private float getVoltage(int analogValue)
  {
    return (analogValue * m_vcc) / 1023;
  }

  private ObservationData computeTemperature(int tempAnalog, long timestamp)
  {
    float Temperature = 0f; //Corporal Temperature
    float Resistance;  //Resistance of sensor.
    float voltage = getVoltage(tempAnalog);
    voltage = voltage / ganancia;
    // Resistance sensor calculate
    float aux = (voltage / RefTension) + Rb / (Rb + Ra);
    Resistance = Rc * aux / (1 - aux);
    if (Resistance >= 1822.8)
    {
      // if temperature between 25?C and 29.9?C. R(t?)=6638.20457*(0.95768)^t
      Temperature = (float)(Math.log(Resistance / 6638.20457) / Math.log(0.95768));
    }
    else
    {
      if (Resistance >= 1477.1)
      {
        // if temperature between 30?C and 34.9?C. R(t?)=6403.49306*(0.95883)^t
        Temperature = (float)(Math.log(Resistance / 6403.49306) / Math.log(0.95883));
      }
      else
      {
        if (Resistance >= 1204.8)
        {
          // if temperature between 35?C and 39.9?C. R(t?)=6118.01620*(0.96008)^t
          Temperature = (float)(Math.log(Resistance / 6118.01620) / Math.log(0.96008));
        }
        else
        {
          if (Resistance >= 988.1)
          {
            // if temperature between 40?C and 44.9?C. R(t?)=5859.06368*(0.96112)^t
            Temperature = (float)(Math.log(Resistance / 5859.06368) / Math.log(0.96112));
          }
          else
          {
            if (Resistance >= 811.7)
            {
              // if temperature between 45?C and 50?C. R(t?)=5575.94572*(0.96218)^t
              Temperature = (float)(Math.log(Resistance / 5575.94572) / Math.log(0.96218));
            }
          }
        }
      }
    }
    return new ObservationData("temp", "celsius", timestamp, Temperature);
  }

  public static void main(String[] args)
  {
    SparkSaveStreaming demo = new SparkSaveStreaming();
  }
}
