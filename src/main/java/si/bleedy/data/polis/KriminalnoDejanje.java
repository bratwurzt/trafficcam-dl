package si.bleedy.data.polis;

import java.io.Serializable;
import java.util.ArrayList;

import com.google.common.collect.Lists;

/**
 * @author DusanM
 */
public class KriminalnoDejanje implements Serializable
{
  private static final long serialVersionUID = 1078881964010014656L;
  private int m_id;
  private String m_month;
  private String m_time;
  private String m_day;
  private String m_polUprava;
  private Boolean m_povratnik;
  private String m_klasifikacijaKaznDejanja;
  private String m_poglavjeZakonika;
  private String m_vrstaKriminaliteteGospodarska;
  private Boolean m_vrstaKriminaliteteOrganizirana;
  private Boolean m_vrstaKriminaliteteMladoletniska;
  private Boolean m_dokoncnostKaznDejanja;
  private String m_kriminalnaOznacba;
  private String m_upSredstvoInSifra;
  private int m_upravnaEnotaId;
  private String m_podrobniOpisPriz;
  private int m_letoZakljDokumenta;
  private String m_vrstaZakljDokumenta;

  public KriminalnoDejanje(ArrayList<String> s)
  {
    if (s.size() == 23)
    {
      m_id = Integer.parseInt(s.get(0));
      m_month = s.get(1);
      m_time = s.get(2);
      m_day = s.get(3);
      m_polUprava = s.get(4);
      m_povratnik = "D".equals(s.get(5));
      m_klasifikacijaKaznDejanja = s.get(6);
      m_poglavjeZakonika = s.get(7);
      m_vrstaKriminaliteteGospodarska = s.get(8);
      m_vrstaKriminaliteteOrganizirana = "ORGANIZIRANA".equals(s.get(9));
      m_vrstaKriminaliteteMladoletniska = "MLADOLETNIŠKA".equals(s.get(10));
      m_dokoncnostKaznDejanja = "D".equals(s.get(11));
      m_kriminalnaOznacba = s.get(12);
      m_upSredstvoInSifra = s.get(15);
      m_upravnaEnotaId = Integer.parseInt(s.get(19));
      m_podrobniOpisPriz = s.get(20);
      m_letoZakljDokumenta = Integer.parseInt(s.get(21));
      m_vrstaZakljDokumenta = s.get(22);
    }
    else {
      throw new IllegalArgumentException("AAAAA") ;
    }
  }

  public int getId()
  {
    return m_id;
  }

  public String getMonth()
  {
    return m_month;
  }

  public String getTime()
  {
    return m_time;
  }

  public String getDay()
  {
    return m_day;
  }

  public String getPolUprava()
  {
    return m_polUprava;
  }

  public Boolean getPovratnik()
  {
    return m_povratnik;
  }

  public String getKlasifikacijaKaznDejanja()
  {
    return m_klasifikacijaKaznDejanja;
  }

  public String getPoglavjeZakonika()
  {
    return m_poglavjeZakonika;
  }

  public String getVrstaKriminaliteteGospodarska()
  {
    return m_vrstaKriminaliteteGospodarska;
  }

  public Boolean getVrstaKriminaliteteOrganizirana()
  {
    return m_vrstaKriminaliteteOrganizirana;
  }

  public Boolean getVrstaKriminaliteteMladoletniska()
  {
    return m_vrstaKriminaliteteMladoletniska;
  }

  public Boolean getDokoncnostKaznDejanja()
  {
    return m_dokoncnostKaznDejanja;
  }

  public String getKriminalnaOznacba()
  {
    return m_kriminalnaOznacba;
  }

  public String getUpSredstvoInSifra()
  {
    return m_upSredstvoInSifra;
  }

  public int getUpravnaEnotaId()
  {
    return m_upravnaEnotaId;
  }

  public String getPodrobniOpisPriz()
  {
    return m_podrobniOpisPriz;
  }

  public int getLetoZakljDokumenta()
  {
    return m_letoZakljDokumenta;
  }

  public String getVrstaZakljDokumenta()
  {
    return m_vrstaZakljDokumenta;
  }
}
