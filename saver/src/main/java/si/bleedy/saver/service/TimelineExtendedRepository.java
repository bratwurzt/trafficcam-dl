package si.bleedy.saver.service;

import org.joda.time.DateTime;

import java.util.Map;

/**
 * @author bratwurzt
 */
public interface TimelineExtendedRepository
{
  Map<String, DateTime> findLastModified();
}
