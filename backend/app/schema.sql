DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS users;

CREATE TABLE files (
    file_id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent INTEGER,
    user_id INTEGER,
    file_type CHAR(1),          --'f'=file, 'd'=directory

    title VARCHAR,
    content VARCHAR,
    created INTEGER,
    updated INTEGER,
    size INTEGER,
    starred BOOL DEFAULT false,

    FOREIGN KEY (parent) REFERENCES files (file_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    home INTEGER,

    FOREIGN KEY (home) REFERENCES files (file_id)
);