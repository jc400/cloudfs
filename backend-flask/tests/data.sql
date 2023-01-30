CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    salt VARCHAR, 
    hashed_password VARCHAR,
    vault VARCHAR
);
INSERT INTO users (username, hashed_password, salt, vault)
VALUES (
    'test', 
    'bc7060506bfbea3f59116fbcf503a93195df9505c6a357054ac96bb24de8cef689a2521abc94685435f8de1d90d28a077356d0c6cea93ede558ff7e7ff455a26',
    '4d9621dcf62abc6d860e3554eef37e38',
    'testblob'
);

