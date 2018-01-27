\c fuzzy_yellow
DROP TABLE IF EXISTS magic_hour;

CREATE TABLE magic_hour (
  id SERIAL PRIMARY KEY,
  today VARCHAR NOT NULL,
  sunrise VARCHAR NOT NULL,
  sunset VARCHAR NOT NULL
);

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  phone VARCHAR NOT NULL,
  zip INTEGER NOT NULL,
  password_digest VARCHAR NOT NULL,
  magicHour_id INTEGER REFERENCES magic_hour
);

