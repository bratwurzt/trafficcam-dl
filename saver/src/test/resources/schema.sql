CREATE TABLE counter (
  id          SMALLINT PRIMARY KEY,
  code        TEXT NOT NULL,
  description        TEXT NOT NULL
);
GRANT ALL PRIVILEGES ON TABLE counter to bleedah;
SELECT AddGeometryColumn('counter','location','4326','POINT',2);
CREATE SEQUENCE counter_seq START 1;

CREATE TABLE counter_timeline (
  id          SERIAL PRIMARY KEY,
  time        TIMESTAMPTZ NOT NULL,
  counter_id  SMALLINT REFERENCES counter (id),
  avg_sec_gap FLOAT           NULL,
  speed       INTEGER         NULL,
  cars_per_sec INTEGER         NULL
);

GRANT ALL PRIVILEGES ON TABLE counter_timeline to bleedah;

CREATE TABLE weather_timeline (
  id          SERIAL PRIMARY KEY,
  time        TIMESTAMPTZ NOT NULL,
  counter_id  SMALLINT REFERENCES counter (id),
  hailprob_level SMALLINT NOT NULL,
  rain_mmph FLOAT NOT NULL
);
GRANT ALL PRIVILEGES ON TABLE weather_timeline to bleedah;

CREATE TABLE car (
  id          SERIAL PRIMARY KEY,
  brand      TEXT NOT NULL,
  model      TEXT NOT NULL,
  colour      TEXT NOT NULL
);

CREATE TABLE street (
  id        SERIAL PRIMARY KEY,
  name      TEXT NOT NULL
);

CREATE TABLE tow_timeline (
  id          SERIAL PRIMARY KEY,
  car_id      BIGINT NOT NULL REFERENCES car(id),
  street_id   BIGINT NOT NULL REFERENCES street(id),
  day_towed   DATE NOT NULL,
  created     TIMESTAMP NOT NULL,
  time_picked_up TIMESTAMP
);

GRANT ALL PRIVILEGES ON TABLE tow_timeline to bleedah;
GRANT ALL PRIVILEGES ON TABLE car to bleedah;
GRANT ALL PRIVILEGES ON TABLE street to bleedah;
