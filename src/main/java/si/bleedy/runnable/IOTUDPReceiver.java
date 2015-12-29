package si.bleedy.runnable;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.Serializable;
import java.net.DatagramPacket;
import java.net.DatagramSocket;

import org.apache.spark.storage.StorageLevel;
import org.apache.spark.streaming.receiver.Receiver;

import eu.fistar.sdcs.pa.ZephyrProtos;
import si.bleedy.data.ObservationData;

/**
 * @author bratwurzt
 */
public class IOTUDPReceiver extends Receiver<ObservationData> implements Serializable
{
  private static final long serialVersionUID = 1840376582814772051L;
  private DatagramSocket m_serverSocket;
  protected boolean m_isStopped = false;
  protected int m_serverPort;

  public IOTUDPReceiver(StorageLevel storageLevel, int port)
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
      byte[] buffer = new byte[64];
      DatagramPacket receivePacket = new DatagramPacket(buffer, buffer.length);

      while (!isStopped())
      {
        try
        {
          m_serverSocket.receive(receivePacket);
        }
        catch (IOException e)
        {
          m_serverSocket.close();
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
              parseAndStoreObservations(receivePacket.getData());
            }
            catch (IOException e)
            {
              restart(e.getMessage());
            }
            finally
            {
              m_serverSocket.disconnect();
            }
          }
        }.start();
      }
    }
    catch (Exception e)
    {
      m_serverSocket.close();
      restart(e.getMessage());
    }
  }

  private void parseAndStoreObservations(byte[] buffer) throws IOException
  {
    ByteArrayInputStream input = new ByteArrayInputStream(buffer);
    ZephyrProtos.ObservationPB entry = ZephyrProtos.ObservationPB.parseDelimitedFrom(input);
    store(new ObservationData(entry.getName(), entry.getUnit(), entry.getTime(), entry.getValues(0)));
  }

  public synchronized boolean isStopped()
  {
    return m_isStopped;
  }

  @Override
  public void onStop()
  {
  }

  private void createServerSocket()
  {
    try
    {
      m_serverSocket = new DatagramSocket(m_serverPort);
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
