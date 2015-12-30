package triggers;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.NetworkInterface;
import java.net.Socket;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import javax.net.SocketFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import data.PriorityBlockingDeque;
import eu.fistar.sdcs.pa.ZephyrProtos;

/**
 * @author bratwurzt
 */
public class RemoteClientSaveWorker implements Runnable
{
  private static final Logger LOG = LoggerFactory.getLogger(RemoteClientSaveWorker.class);
  private Socket m_socket;
  private String m_ipAddress;
  private Integer m_port;
  protected OutputStream m_outputStream;
  protected final PriorityBlockingDeque<ZephyrProtos.ObservationPB> m_observations;

  public RemoteClientSaveWorker(PriorityBlockingDeque<ZephyrProtos.ObservationPB> obs, String ipAddress, Integer port)
  {
    m_observations = obs;
    m_ipAddress = ipAddress;
    m_port = port;
  }

  @Override
  public void run()
  {
    while (true)
    {
      try
      {
        trySendingData();
        Thread.sleep(InsertTrigger.BATCH_MILLIS / 3);
      }
      catch (IOException | InterruptedException e)
      {
        LOG.error("Error: ", e);
      }
    }
  }

  private void trySendingData() throws IOException
  {
    synchronized (m_observations)
    {
      ZephyrProtos.ObservationPB lastBatchObservation = getLastBatchObservation();
      if (lastBatchObservation != null)
      {
        List<ZephyrProtos.ObservationPB> tempList = new ArrayList<>();
        ZephyrProtos.ObservationsPB.Builder builder = ZephyrProtos.ObservationsPB.newBuilder();
        ZephyrProtos.ObservationPB obs;
        while ((obs = m_observations.pollFirst()) != null)
        {
          tempList.add(obs);
          if (lastBatchObservation.equals(obs))
          {
            break;
          }
        }
        builder.addAllObservations(tempList);
        long millis = tempList.get(0).getTime() - tempList.get(tempList.size() - 1).getTime();
        LOG.info("Sending " + millis + " millis worth of data.");
        try (OutputStream outputStream = getOutputStream())
        {
          builder.build().writeTo(outputStream);
        }
        catch (Exception e)
        {
          LOG.error("Error: ", e);
          synchronized (m_observations)
          {
            m_observations.addAll(tempList);
          }
        }
      }
    }
  }

  private ZephyrProtos.ObservationPB getLastBatchObservation()
  {
    ZephyrProtos.ObservationPB o1 = m_observations.peekFirst();
    Iterator<ZephyrProtos.ObservationPB> iter = m_observations.iterator();
    ZephyrProtos.ObservationPB lastInBatch = null;
    int i = 0;
    ZephyrProtos.ObservationPB lastElement = null;
    while (iter.hasNext())
    {
      ZephyrProtos.ObservationPB o = iter.next();
      if (((int)(o1.getTime() - o.getTime())) / InsertTrigger.BATCH_MILLIS > i)
      {
        lastInBatch = lastElement;
        i++;
      }
      lastElement = o;
    }
    return lastInBatch;
  }

  public OutputStream getOutputStream() throws IOException
  {
    if (m_socket == null || m_socket.isClosed())
    {
      LOG.info("Creating socket to " + m_ipAddress + ":" + m_port);
      m_socket = createSocket(m_port, m_ipAddress);
    }
    else if (!m_socket.isConnected())
    {
      LOG.info("Connecting socket to " + m_ipAddress + ":" + m_port);
      m_socket.connect(new InetSocketAddress(InetAddress.getByName(m_ipAddress), m_port));
    }

    m_outputStream = m_socket.getOutputStream();
    return m_outputStream;
  }

  private Socket createSocket(int serverPort, String serverIPAddress) throws IOException
  {
    int localPort = InsertTrigger.XOR_SHIFT_RANDOM.nextInt(49152, 55535);
    Enumeration e = NetworkInterface.getNetworkInterfaces();
    InetAddress localInetAddress = InetAddress.getByName("localhost");
    outerLoop:
    while (e.hasMoreElements())
    {
      NetworkInterface n = (NetworkInterface)e.nextElement();
      Enumeration ee = n.getInetAddresses();
      while (ee.hasMoreElements())
      {
        InetAddress i = (InetAddress)ee.nextElement();

        if (i.isSiteLocalAddress())
        {
          localInetAddress = i;
          break outerLoop;
        }
      }
    }
    return SocketFactory.getDefault().createSocket(InetAddress.getByName(serverIPAddress), serverPort, localInetAddress, localPort);
  }
}
