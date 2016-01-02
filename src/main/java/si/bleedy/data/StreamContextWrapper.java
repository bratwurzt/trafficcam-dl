package si.bleedy.data;

import java.io.Serializable;

import org.apache.spark.streaming.api.java.JavaStreamingContext;

/**
 * @author bratwurzt
 */
public class StreamContextWrapper implements Serializable
{
  private final JavaStreamingContext m_jsc;

  public StreamContextWrapper(JavaStreamingContext jsc)
  {
    m_jsc = jsc;
  }

  public final JavaStreamingContext getJsc()
  {
    return m_jsc;
  }
}

