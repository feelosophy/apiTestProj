DROP TABLE IF EXISTS peoples;
CREATE DATABASE users;

\c users;

CREATE TYPE status AS ENUM ('active','blocked','deleted');

CREATE TABLE peoples (
  user_id SERIAL PRIMARY KEY,
  name varchar(30),
  last_name varchar(30),
  phone_number varchar(13),
  email varchar(30),
  login varchar(20) UNIQUE,
  password varchar(80),
  state status DEFAULT 'active',
  avatar varchar(30) DEFAULT '/default.png'
);

INSERT INTO peoples (name,last_name,phone_number,email,login,password)
  VALUES ('Иван','Иванов','89152312343','mail@,mail.com','newLogin','secretCode');