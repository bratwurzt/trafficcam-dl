package eu.fistar.sdcs.runnable;

import java.io.IOException;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.SecureRandom;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLServerSocket;
import javax.net.ssl.SSLServerSocketFactory;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.TrustManagerFactory;

import com.datastax.driver.core.BoundStatement;
import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.PreparedStatement;
import com.datastax.driver.core.Session;
import eu.fistar.sdcs.TestSaveZephyr;

/**
 * @author bratwurzt
 */
public class ReceiveZephyrServerRunnable implements Runnable
{
  protected int m_serverPort;
  private SSLServerSocket m_serverSocket;
  protected boolean m_isStopped = false;
  protected SSLServerSocketFactory m_socketFactory;
  protected ExecutorService m_clientThreadPool = Executors.newSingleThreadExecutor();
  protected Session m_session;
  protected BoundStatement m_boundStatement;

  public ReceiveZephyrServerRunnable()
  {
    m_serverPort = 8099;
  }

  public void run()
  {
    openServerSocket();
    try (Cluster cluster = Cluster.builder()
        .withPort(9042)
        .addContactPoint("192.168.1.2")
        .build())
    {
      m_session = cluster.connect("zephyrkeyspace");
      PreparedStatement statement = m_session.prepare("INSERT INTO observations(name, unit, timestamp, value) VALUES (?,?,?,?);");
      m_boundStatement = new BoundStatement(statement);

      while (!isStopped())
      {
        SSLSocket clientSocket;
        try
        {
          try
          {
            clientSocket = (SSLSocket)m_serverSocket.accept();
          }
          catch (IOException e)
          {
            if (isStopped())
            {
              return;
            }
            throw new RuntimeException("Error accepting client connection", e);
          }
          m_clientThreadPool.execute(new ReceiveZephyrWorkerRunnable(clientSocket, m_session, m_boundStatement));
        }
        catch (Exception e)
        {
        }
      }
    }
  }

  private void openServerSocket()
  {
    try
    {
      TrustManagerFactory tmf = TrustManagerFactory.getInstance("PKIX");
      KeyStore keystore = KeyStore.getInstance(KeyStore.getDefaultType());
      InputStream keystoreStream = TestSaveZephyr.class.getClassLoader().getResourceAsStream("server.jks");
      keystore.load(keystoreStream, "ena1dva2".toCharArray());
      tmf.init(keystore);
      KeyManagerFactory kmf = KeyManagerFactory.getInstance("PKIX");
      kmf.init(keystore, "ena1dva2".toCharArray());

      SSLContext sc = SSLContext.getInstance("TLS");
      sc.init(kmf.getKeyManagers(), tmf.getTrustManagers(), new SecureRandom());

      m_socketFactory = sc.getServerSocketFactory();
      try
      {
        m_serverSocket = (SSLServerSocket)m_socketFactory.createServerSocket(m_serverPort);
      }
      catch (IOException e)
      {
        throw new RuntimeException("Cannot open port " + m_serverPort, e);
      }
    }
    catch (Exception e)
    {
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
