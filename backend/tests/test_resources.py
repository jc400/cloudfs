import pytest
from flask import g, session
from app.db import get_db


def test_get_vault(client, auth):
    """Retrieve info for a single file. Check that response
    matches what is in DB.
    """
    auth.login()
    response = client.get("/api/vault")
    assert response.status_code == 200
    assert b"testblob" in response.data


def test_put_file(app, client, auth):
    """Update a file. Should test different paths (updating
    title, content, starred, parent) as well as validation.
    Ensure no errors, and that change is in DB.
    """
    auth.login()
    response = client.put("/api/vault", json={"vault":"hello world"})
    assert response.status_code == 200

    with app.app_context():
        dbh = get_db()
        result = dbh.execute(
            """
            SELECT * FROM users WHERE user_id = 1
            """
        ).fetchone()
        assert result["vault"] == "hello world"

