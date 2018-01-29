\c fuzzy_yellow
DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS magic_hour;

CREATE TABLE magic_hour (
  id SERIAL PRIMARY KEY,
  location_name VARCHAR NOT NULL,
  last_updated VARCHAR NOT NULL,
  sunrise VARCHAR NOT NULL,
  sunset VARCHAR NOT NULL
);

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  current_location VARCHAR,
  email VARCHAR NOT NULL UNIQUE,
  phone VARCHAR NOT NULL,
  zip VARCHAR NOT NULL,
  password_digest VARCHAR NOT NULL
);

