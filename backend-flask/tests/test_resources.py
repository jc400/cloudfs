import pytest
from flask import g, session
from app.db import get_db


def test_get_vault(client, auth):
    """Retrieve info for a single file. Check that response
    matches what is in DB.
    """
    auth.login()
    response = auth.get("/api/vault")
    assert response.status_code == 200
    assert b"testblob" in response.data


def test_put_file(app, client, auth, cur):
    """Update a file. Should test different paths (updating
    title, content, starred, parent) as well as validation.
    Ensure no errors, and that change is in DB.
    """
    auth.login()
    response = auth.put("/api/vault", json={"vault":"hello world"})
    assert response.status_code == 200

    cur.execute("SELECT vault FROM users WHERE user_id = 1")
    assert cur.fetchone()[0] == "hello world"

