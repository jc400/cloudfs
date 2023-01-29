DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR UNIQUE NOT NULL,
    salt VARCHAR, 
    hashed_password VARCHAR,
    vault VARCHAR
);