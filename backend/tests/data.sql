INSERT INTO users (user_id, username, password, home)
VALUES (
    1, 
    "test", 
    "pbkdf2:sha256:260000$koBl2gDdyT2Uscza$2eeacb8215f2781d351a4790ba9e8b0f1238993b0cfc728ee33d1dd7bfbad10c",
    1
);

INSERT INTO files (file_id, parent, user_id, title, file_type, content, starred, size)
VALUES 
    (1, 0, 1, "Home", "d", NULL, FALSE, NULL),
    (2, 1, 1, "f1 title", "f", "f1 content hello world", FALSE, 35),
    (3, 1, 1, "f2 title", "f", "f2 content hello world", FALSE, 35),
    (4, 1, 1, "d4 title", "d", NULL, TRUE, NULL),
    (5, 4, 1, "f5 title", "f", "f5 content hello world", FALSE, 35),
    (6, 4, 1, "f6 title", "f", "f6 content hello world", TRUE, 35);