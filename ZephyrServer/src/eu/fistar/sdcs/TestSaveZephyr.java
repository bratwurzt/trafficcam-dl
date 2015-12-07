package eu.fistar.sdcs;

import eu.fistar.sdcs.runnable.ReceiveZephyrServerRunnable;

/**
 * @author bratwurzt
 */
public class TestSaveZephyr
{
  public static void main(String[] args)
  {
    new Thread(new ReceiveZephyrServerRunnable(8099)).start(); //zephyr
    new Thread(new ReceiveZephyrServerRunnable(8100)).start(); //muse
  }
}
