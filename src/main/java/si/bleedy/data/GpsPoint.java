package si.bleedy.data;

import java.io.Serializable;

/**
 * @author bratwurzt
 */
public class GpsPoint implements Serializable
{
  private float m_latitude;
  private float m_longitude;
  public GpsPoint(float latitude, float longitude)
  {
    m_latitude = latitude;
    m_longitude = longitude;
  }

  public float distTo(GpsPoint otherPoint)
  {
    float lat1 = getLatitude(), lng1 = getLongitude(), lat2 = otherPoint.getLatitude(), lng2 = otherPoint.getLongitude();
    double earthRadius = 6371; //kilometers
    double dLat = Math.toRadians(lat2 - lat1);
    double dLng = Math.toRadians(lng2 - lng1);
    double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (float)(earthRadius * c);
  }

  public boolean isInRadius(GpsPoint otherPoint, Float km)
  {
    return this.distTo(otherPoint) < km;
  }

  public float getLatitude()
  {
    return m_latitude;
  }

  public float getLongitude()
  {
    return m_longitude;
  }
}
