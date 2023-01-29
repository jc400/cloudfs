DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR UNIQUE NOT NULL,
    salt BLOB, 
    hashed_password BLOB,
    vault VARCHAR
);