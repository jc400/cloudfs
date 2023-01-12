import pytest
from flask import g, session
from app.db import get_db


def test_get_file(client, auth):
    """Retrieve info for a single file. Check that response
    matches what is in DB.
    """
    auth.login()
    response = client.get("/api/files/2")
    assert response.status_code == 200
    assert b"f1 title" in response.data
    assert b"f1 content" in response.data


@pytest.mark.parametrize(
    "json",
    (
        {"title": "new title"},
        {"content": "new content"},
        {"starred": True},
        {"parent": 4},
    ),
)
def test_put_file(app, client, auth, json):
    """Update a file. Should test different paths (updating
    title, content, starred, parent) as well as validation.
    Ensure no errors, and that change is in DB.
    """
    auth.login()
    response = client.put("/api/files/2", json=json)
    assert response.status_code == 200

    with app.app_context():
        dbh = get_db()
        result = dbh.execute(
            """
            SELECT * FROM files WHERE file_id = 2
            """
        ).fetchone()
        k = list(json.keys())[0]
        assert result[k] == json[k]


@pytest.mark.parametrize(
    "json",
    (
        {"content": "new content"},
        {"parent": 375849},
    ),
)
def test_put_file_invalid(app, client, auth, json):
    auth.login()
    response = client.put("/api/files/4", json=json)
    assert response.status_code != 200

    with app.app_context():
        dbh = get_db()
        result = dbh.execute(
            """
            SELECT * FROM files WHERE file_id = 4
            """
        ).fetchone()
        k = list(json.keys())[0]
        assert result[k] != json[k]


def test_put_constraints(app, client, auth):
    app.config['SIZE_ALLOWANCE'] = 200
    auth.login()
    response = client.put("/api/files/3", json={"content":"hello world"*100})
    assert response.status_code == 400


def test_delete_file(app, client, auth):
    """Ensure file disappears from DB"""
    auth.login()
    response = client.delete("/api/files/2")
    assert response.status_code == 200

    with app.app_context():
        dbh = get_db()
        result = dbh.execute("SELECT * FROM files WHERE file_id = 2").fetchone()
        assert result == None


def test_delete_file_home(app, client, auth):
    auth.login()
    response = client.delete("/api/files/1")
    assert response.status_code == 400

    with app.app_context():
        dbh = get_db()
        result = dbh.execute("SELECT * FROM files WHERE file_id = 1").fetchone()
        assert result != None


def test_post_filelist(app, client, auth):
    """Test that new file and dir can be added"""
    auth.login()
    newfile = {
        "title": "My new file",
        "content": "My new content",
        "parent": 4,
        "file_type": "f",
    }
    response = client.post("/api/files", json=newfile)
    assert response.status_code == 200

    with app.app_context():
        dbh = get_db()
        result = dbh.execute(
            "SELECT * FROM files WHERE title = 'My new file'"
        ).fetchone()
        assert result["title"] == "My new file"
        assert result["content"] == "My new content"
        assert result["file_type"] == "f"


def test_post_filelist_constraints(app, client, auth):
    app.config['FILE_ALLOWANCE'] = 6
    newfile = {
        "title": "My new file",
        "content": "My new content",
        "parent": 4,
        "file_type": "f",
    }
    auth.login()
    response = client.post("/api/files", json=newfile)
    assert response.status_code == 400