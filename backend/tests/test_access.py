import pytest
from app.db import get_db

def test_get_access(client):
    assert client.get("/list/1").status_code == 404
    assert client.get("/path/4").status_code == 404
    assert client.get("/files/2").status_code == 404
    assert client.get("/starred").status_code == 400
    assert client.get("/recent").status_code == 400


@pytest.mark.parametrize(
    "json",
    (
        {"title": "new title"},
        {"content": "new content"},
        {"starred": True},
        {"parent": 4},
    ),
)
def test_put_file_unauth(app, client, json):
    """Update a file. Should test different paths (updating
    title, content, starred, parent) as well as validation.
    Ensure no errors, and that change is in DB.
    """
    response = client.put("/files/2", json=json)
    assert response.status_code == 404

    with app.app_context():
        dbh = get_db()
        result = dbh.execute(
            """
            SELECT * FROM files WHERE file_id = 2
            """
        ).fetchone()
        k = list(json.keys())[0]
        assert result[k] != json[k]


def test_delete_file_unauth(app, client):
    """Ensure file disappears from DB"""
    response = client.delete("/files/2")
    assert response.status_code == 404

    with app.app_context():
        dbh = get_db()
        result = dbh.execute("SELECT * FROM files WHERE file_id = 2").fetchone()
        assert result != None


def test_post_filelist_unauth(app, client):
    newfile = {
        "title": "My new file",
        "content": "My new content",
        "parent": 4,
        "file_type": "f",
    }
    with client:
        response = client.post("/files", json=newfile)
        assert response.status_code == 401

    with app.app_context():
        dbh = get_db()
        result = dbh.execute(
            "SELECT * FROM files WHERE title = 'My new file'"
        ).fetchone()
        assert result == None
