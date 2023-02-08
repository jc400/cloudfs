DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS token_blocklist;

CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    salt VARCHAR, 
    hashed_password VARCHAR,
    vault VARCHAR
);

CREATE TABLE token_blocklist (
    token_id BIGSERIAL PRIMARY KEY,
    jti CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL
);
CREATE INDEX tok_jti_idx ON token_blocklist (jti);