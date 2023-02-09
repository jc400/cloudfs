import pytest
from flask import g, session
from app.db import get_db
import time


def test_login(auth):
    response = auth.login()
    assert response.status_code == 200
    assert response.json["message"] == "Logged in"
    assert "access_token" in response.json


def test_jwt(client, auth):
    auth.login()
    response = auth.get("/api/auth/check_login")
    assert response.json["logged in"] == True


def test_logout(client, auth):
    with client:
        auth.login()
        assert auth.get("/api/auth/check_login").json["logged in"] == True
        resp = auth.logout()
        assert resp.status_code == 200
        assert resp.json['message'] == "Logged out"
        assert auth.get("/api/auth/check_login").status_code == 401


def test_register(app, client, cur):
    creds = {"username":"Jimmy", "password":"beans", "vault":"vault"}
    response = client.post("/api/auth/register", json=creds)
    assert response.status_code == 200
    assert response.json['success'] == True

    cur.execute(
        "SELECT * FROM users WHERE username = %s", 
        (creds['username'],)
    )
    assert cur.fetchone() != None