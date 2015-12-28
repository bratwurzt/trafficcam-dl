package triggers;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.Socket;
import java.util.Enumeration;
import java.util.concurrent.BlockingQueue;
import javax.net.SocketFactory;

import eu.fistar.sdcs.pa.ZephyrProtos;

/**
 * @author bratwurzt
 */
public class RemoteClientSaveWorker implements Runnable
{
  private Socket m_socket;
  private String m_ipAddress;
  private Integer m_port;
  protected final BlockingQueue<ZephyrProtos.ObservationPB> m_observations;
  protected OutputStream m_outputStream;

  public RemoteClientSaveWorker(BlockingQueue<ZephyrProtos.ObservationPB> observations, Socket socket, String ipAddress, Integer port)
  {
    m_observations = observations;
    m_socket = socket;
    m_ipAddress = ipAddress;
    m_port = port;
  }

  @Override
  public void run()
  {
    try
    {
      try (OutputStream outputStream = getOutputStream())
      {
        ZephyrProtos.ObservationsPB.Builder builder = ZephyrProtos.ObservationsPB.newBuilder();
        synchronized (m_observations)
        {
          if (m_observations.size() > 0)
          {
            synchronized (m_observations)
            {
              builder.addAllObservations(m_observations);
            }
          }
        }

        builder.build().writeTo(outputStream);
      }
      catch (Exception e)
      {
        return;
      }
      finally
      {
        if (m_outputStream != null)
        {
          m_outputStream.close();
        }
      }

      synchronized (m_observations)
      {
        m_observations.clear();
      }
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
  }

  public OutputStream getOutputStream() throws IOException
  {
    if (m_outputStream == null)
    {
      if (m_socket == null/* || !m_socket.isConnected() || m_socket.isClosed()*/)
      {
        try
        {
          m_socket = createSocket(m_port, m_ipAddress);
        }
        catch (IOException e)
        {
          e.printStackTrace();
        }
      }

      m_outputStream = m_socket.getOutputStream();
    }
    return m_outputStream;
  }

  private Socket createSocket(int serverPort, String serverIPAddress) throws IOException
  {
    XORShiftRandom xorShiftRandom = new XORShiftRandom();
    int localPort = xorShiftRandom.nextInt(49152, 55535);
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
