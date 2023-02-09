import pytest
from app.db import get_db

def test_get_access(client):
    assert client.get("/api/vault").status_code == 401


def test_put_file_unauth(app, client, cur):
    """Update a file. Should test different paths (updating
    title, content, starred, parent) as well as validation.
    Ensure no errors, and that change is in DB.
    """
    response = client.put("/api/vault", json={"vault":"hello"})
    assert response.status_code == 401

    cur.execute("SELECT vault FROM users WHERE user_id = 1")
    assert cur.fetchone()[0] != "hello"

