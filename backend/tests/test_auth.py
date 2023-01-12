import pytest
from flask import g, session
from app.db import get_db


def test_login(auth):
    response = auth.login()
    assert response.status_code == 200
    assert response.json["message"] == "Logged in"
    assert response.json["home"] == 1


def test_session_cookie(client, auth):
    auth.login()
    with client:
        response = client.get("/auth/check_login")
        assert response.json["logged in"] == True
        assert session["user_id"] == 1


def test_logout(client, auth):
    with client:
        auth.login()
        assert "user_id" in session
        auth.logout()
        assert "user_id" not in session


def test_register(app, client):
    creds = {"username":"Jimmy", "password":"beans"}
    response = client.post("/auth/register", json=creds)
    assert response.status_code == 200
    assert response.json['success'] == True

    with app.app_context():
        dbh = get_db()
        result = dbh.execute(
            "SELECT * FROM users WHERE username = ?", (creds['username'],)
        ).fetchone()
        assert result != None