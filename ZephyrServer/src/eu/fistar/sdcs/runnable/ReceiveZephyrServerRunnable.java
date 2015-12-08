package eu.fistar.sdcs.runnable;

import java.io.IOException;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import javax.net.ServerSocketFactory;
import javax.net.ssl.SSLSocket;

import com.datastax.driver.core.BoundStatement;
import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.PreparedStatement;
import com.datastax.driver.core.Session;

/**
 * @author bratwurzt
 */
public class ReceiveZephyrServerRunnable implements Runnable
{
  protected int m_serverPort;
  private ServerSocket m_serverSocket;
  protected boolean m_isStopped = false;
  protected ServerSocketFactory m_socketFactory;
  protected ExecutorService m_clientThreadPool = Executors.newSingleThreadExecutor();
  protected Session m_session;
  protected BoundStatement m_boundStatement;

  public ReceiveZephyrServerRunnable(int arg)
  {
    m_serverPort = arg;
  }

  public void run()
  {
    openServerSocket();

    try (Cluster cluster = Cluster.builder()
        .withPort(9042)
        .addContactPoints(InetAddress.getAllByName("cassandra.marand.si"))
        .build())
    {
      m_session = cluster.connect("obskeyspace");
      PreparedStatement statement = m_session.prepare("INSERT INTO observations(name, unit, timestamp, value) VALUES (?,?,?,?);");
      m_boundStatement = new BoundStatement(statement);

      while (!isStopped())
      {
        try
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
          m_clientThreadPool.execute(new ReceiveZephyrWorkerRunnable(m_clientSocket, m_session, m_boundStatement));
        }
        catch (Exception e)
        {
          System.out.println();
        }
      }
    }
    catch (UnknownHostException e)
    {
      e.printStackTrace();
    }
  }

  private void openServerSocket()
  {
    try
    {
      createServerSocket();
    }
    catch (Exception e)
    {
    }
  }

  private void createServerSocket()
  {
    m_socketFactory = ServerSocketFactory.getDefault();
    try
    {
      m_serverSocket = m_socketFactory.createServerSocket(m_serverPort);
    }
    catch (IOException e)
    {
      throw new RuntimeException("Cannot open port " + m_serverPort, e);
    }
  }

  public synchronized boolean isStopped()
  {
    return m_isStopped;
  }

  public synchronized void stop()
  {
    m_isStopped = true;
    try
    {
      m_serverSocket.close();
    }
    catch (IOException e)
    {
      throw new RuntimeException("Error closing server", e);
    }
  }
}
