package si.bleedy.runnable;

import java.io.IOException;
import java.io.Serializable;
import java.net.ServerSocket;
import java.net.Socket;
import javax.net.ServerSocketFactory;

import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.receiver.Receiver;

import eu.fistar.sdcs.pa.ZephyrProtos;
import si.bleedy.data.ObservationData;

/**
 * @author bratwurzt
 */
public class CassandraTCPReceiver extends Receiver<ObservationData> implements Serializable
{
  private static final long serialVersionUID = 1840376582814772051L;
  private ServerSocket m_serverSocket;
  protected boolean m_isStopped = false;
  protected int m_serverPort;

  public CassandraTCPReceiver(StorageLevel storageLevel, int port)
  {
    super(storageLevel);
    m_serverPort = port;
  }

  @Override
  public void onStart()
  {
    new Thread()
    {
      @Override
      public void run()
      {
        createServerSocket();
        receive();
      }
    }.start();
  }

  private void receive()
  {
    try
    {
      while (!isStopped())
      {
        Socket m_clientSocket;
        try
        {
          m_clientSocket = m_serverSocket.accept();
        }
        catch (IOException e)
        {
          if (isStopped())
          {
            return;
          }
          throw new RuntimeException("Error accepting client connection", e);
        }
        new Thread()
        {
          @Override
          public void run()
          {
            try
            {
              parseAndStoreObservations(m_clientSocket);
            }
            catch (IOException e)
            {
              restart(e.getMessage());
            }
          }
        }.start();
      }
    }
    catch (Exception e)
    {
      restart(e.getMessage());
    }
  }

  private void parseAndStoreObservations(Socket m_clientSocket) throws IOException
  {
    ZephyrProtos.ObservationsPB observationsPB;
    while ((observationsPB = ZephyrProtos.ObservationsPB.parseFrom(m_clientSocket.getInputStream())) != null)
    {
      for (ZephyrProtos.ObservationPB entry : observationsPB.getObservationsList())
      {
        store(new ObservationData(entry.getName(), entry.getUnit(), entry.getTime(), entry.getValues(0)));
      }
    }
  }

  public synchronized boolean isStopped()
  {
    return m_isStopped;
  }

  @Override
  public void onStop()
  {
//    m_isStopped = true;
//    try
//    {
//      m_serverSocket.close();
//    }
//    catch (IOException e)
//    {
//      throw new RuntimeException("Error closing server", e);
//    }
  }

  private void createServerSocket()
  {
    try
    {
      m_serverSocket = ServerSocketFactory.getDefault().createServerSocket(m_serverPort);
      m_serverSocket.setReuseAddress(true);
      //m_serverSocket.bind(new InetSocketAddress(m_serverPort));
    }
    catch (IOException e)
    {
      throw new RuntimeException("Cannot open port " + m_serverPort, e);
    }
  }

  @Override
  public StorageLevel storageLevel()
  {
    return StorageLevel.MEMORY_ONLY();
  }
}
