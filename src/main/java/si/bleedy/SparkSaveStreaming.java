package si.bleedy;

import java.io.Serializable;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
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
  private static final int MAX_LIMIT = 1020;

//  static
//  {
//    URL url = Thread.currentThread().getContextClassLoader().getResource("config/log4j.properties");
//    PropertyConfigurator.configure(url);
//  }

  public SparkSaveStreaming()
  {

    SparkConf conf = new SparkConf()
        .setAppName("zephyr")
        .set("spark.cassandra.connection.host", "192.168.1.2")
        .set("spark.cassandra.connection.port", "9042")
        .set("spark.cassandra.connection.keep_alive_ms", "20000")
        .setMaster("local[6]");

    // streaming
    JavaStreamingContext ssc = new JavaStreamingContext(conf, Durations.seconds(10));

    JavaDStream<ObservationData> zephyrStream = ssc.receiverStream(
        new IOTTCPReceiver(StorageLevel.MEMORY_ONLY(), 8099)
    );

    // ecg
    JavaDStream<ObservationData> filteredEcgStream = zephyrStream
        .filter(o -> "ecg".equals(o.getName()))
        .transform(rdd -> {
//          RDDFunctions.fromRDD(rdd.rdd(), rdd.classTag()).sliding(3).re
          return ssc.sparkContext().parallelize(fillMissingSamplesWithAvg(rdd.collect(), 250));
        });

    // breathing
    JavaDStream<ObservationData> filteredBreathingStream = zephyrStream
        .filter(o -> "breathing".equals(o.getName()))
        .transform(rdd -> {
          return ssc.sparkContext().parallelize(fillMissingSamplesWithAvg(rdd.collect(), 18));
        });

    JavaDStream<ObservationData> union = zephyrStream
        .filter(o -> !"ecg".equals(o.getName()) && !"breathing".equals(o.getName()))
        .union(filteredEcgStream)
        .union(filteredBreathingStream);

    CassandraStreamingJavaUtil.javaFunctions(union)
        .writerBuilder("obskeyspace", "observations", CassandraJavaUtil.mapToRow(ObservationData.class))
        .saveToCassandra();

    ssc.start();
    ssc.awaitTermination();
  }

  private List<ObservationData> fillMissingSamplesWithAvg(List<ObservationData> collect, int sampleFreq)
  {
    List<ObservationData> returnList = new ArrayList<>();

    for (int i = 0; i < collect.size(); i++)
    {
      ObservationData data = collect.get(i);
      int sampleTimeDiffMillis = 1000 / sampleFreq;

      if (i > 0 && i < collect.size() - 1)
      {
        ObservationData previousData = collect.get(i - 1);
        ObservationData nextData = collect.get(i + 1);

        if (data.getValue() > MAX_LIMIT)
        {
          data.setValue(getValueAvg(data.getValue(), previousData.getValue(),nextData.getValue()));
        }

        int timeDiff = (int)(data.getTimestamp() - previousData.getTimestamp()) - sampleTimeDiffMillis;
        if (timeDiff > 0)
        {
          for (int j = sampleTimeDiffMillis; j <= timeDiff; j += sampleTimeDiffMillis)
          {
            returnList.add(
                new ObservationData(
                    data.getName(),
                    data.getUnit(),
                    previousData.getTimestamp() + j,
                    getValueAvg(data.getValue(), previousData.getValue(), data.getValue()))
            );
          }
        }
        returnList.add(data);
      }
      else if (i == 0)
      {
        ObservationData nextData = collect.get(i + 1);
        if (data.getValue() > MAX_LIMIT && nextData.getValue() < MAX_LIMIT)
        {
          data.setValue(nextData.getValue());
        }
        returnList.add(data);
      }
      else
      {
        ObservationData previousData = collect.get(i - 1);
        if (data.getValue() > MAX_LIMIT && previousData.getValue() < MAX_LIMIT)
        {
          data.setValue(previousData.getValue());
        }
        int timeDiff = (int)(data.getTimestamp() - previousData.getTimestamp()) - sampleTimeDiffMillis;
        if (timeDiff > 0 && previousData.getValue() < MAX_LIMIT && data.getValue() < MAX_LIMIT)
        {
          for (int j = sampleTimeDiffMillis; j <= timeDiff; j += sampleTimeDiffMillis)
          {
            returnList.add(new ObservationData(data.getName(), data.getUnit(), data.getTimestamp() + j, (previousData.getValue() + data.getValue()) / 2));
          }
        }
        returnList.add(data);
      }
    }
    return returnList;
  }

  private double getValueAvg(double currentValue, double previousValue, double nextValue)
  {
    if (previousValue < MAX_LIMIT && nextValue < MAX_LIMIT)
    {
      return (previousValue + nextValue) / 2;
    }
    else if (previousValue < MAX_LIMIT)
    {
      return previousValue;
    }
    else if (nextValue < MAX_LIMIT)
    {
      return nextValue;
    }
    return currentValue;
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
