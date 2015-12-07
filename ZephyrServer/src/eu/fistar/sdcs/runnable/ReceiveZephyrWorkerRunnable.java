package eu.fistar.sdcs.runnable;

import java.io.IOException;
import java.net.Socket;

import com.datastax.driver.core.BoundStatement;
import com.datastax.driver.core.Session;
import eu.fistar.sdcs.pa.ZephyrProtos;

/**
 * @author bratwurzt
 */
public class ReceiveZephyrWorkerRunnable implements Runnable
{
  protected Socket m_clientSocket;
  protected Session m_session;
  protected BoundStatement m_boundStatement;

  public ReceiveZephyrWorkerRunnable(Socket clientSocket, Session session, BoundStatement boundStatement)
  {
    m_clientSocket = clientSocket;
    m_session = session;
    m_boundStatement = boundStatement;
  }

  public void run()
  {
    try
    {
      ZephyrProtos.ObservationsPB observationsPB = ZephyrProtos.ObservationsPB.parseFrom(m_clientSocket.getInputStream());
      for (ZephyrProtos.ObservationPB data : observationsPB.getObservationsList())
      {
        if (data.getDuration() == 0)
        {
          m_session.execute(m_boundStatement.bind(data.getName(), data.getUnit(), data.getTime(), data.getValues(0)));
        }
        else
        {
          int oneStepDur = data.getDuration() / data.getValuesCount();
          for (int i = 0; i < data.getValuesCount(); i++)
          {
            String value = data.getValues(i);
            long timestamp = data.getTime() + i * oneStepDur;
            m_session.execute(m_boundStatement.bind(data.getName(), data.getUnit(), timestamp, value));
          }
        }
      }
    }
    catch (IOException e)
    {
      e.printStackTrace();
    }
  }
}
