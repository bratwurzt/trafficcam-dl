package triggers;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.Socket;
import java.util.Enumeration;
import java.util.concurrent.BlockingQueue;
import javax.net.SocketFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import eu.fistar.sdcs.pa.ZephyrProtos;

/**
 * @author bratwurzt
 */
public class RemoteClientSaveWorker implements Runnable
{
  private static final Logger LOG = LoggerFactory.getLogger(RemoteClientSaveWorker.class);
  private String m_ipAddress;
  private Integer m_port;
  protected final BlockingQueue<ZephyrProtos.ObservationPB> m_observations;

  public RemoteClientSaveWorker(BlockingQueue<ZephyrProtos.ObservationPB> obs, String ipAddress, Integer port)
  {
    m_observations = obs;
    m_ipAddress = ipAddress;
    m_port = port;
  }

  @Override
  public void run()
  {
    while(true)
    {

      try
      {
        synchronized (m_observations)
        {
          ZephyrProtos.ObservationPB obs;
          while ((obs = m_observations.poll()) != null)
          {
            tempList.add(obs);
            builder.addObservations(
                ZephyrProtos.ObservationPB.newBuilder()
                    .setName(obs.getPropertyName())
                    .setUnit(obs.getMeasurementUnit())
                    .setTime(obs.getPhenomenonTime())
                    .setDuration((int)obs.getDuration())
                    .addAllValues(obs.getValues())
            );
          }
        }


        int localPort = InsertTrigger.XOR_SHIFT_RANDOM.nextInt(49152, 55535);
        DatagramSocket datagramSocket = new DatagramSocket(localPort);
        try
        {
          ByteArrayOutputStream output = new ByteArrayOutputStream(64);
          m_build.writeDelimitedTo(output);
          byte buffer[] = output.toByteArray();
          InetAddress ipAddressInet = InetAddress.getByName(m_ipAddress);
          DatagramPacket packet = new DatagramPacket(buffer, buffer.length, ipAddressInet, m_port);
          datagramSocket.send(packet);
        }
        finally
        {
          datagramSocket.disconnect();
          datagramSocket.close();
        }
      }
      catch (IOException e)
      {
        LOG.error("Error: ", e);
      }
    }

  }
}
