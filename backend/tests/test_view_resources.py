def test_get_list(client, auth):
    auth.login()
    response = client.get("/list/1")
    assert response.status_code == 200
    assert b"f1 title" in response.data
    assert b"d4 title" in response.data


def test_get_path(client, auth):
    auth.login()
    response = client.get("/path/4")
    assert response.status_code == 200
    assert b"d4 title" in response.data
    assert b"Home" in response.data


def test_get_starred(client, auth):
    auth.login()
    response = client.get("/starred")
    assert response.status_code == 200
    assert b"d4 title" in response.data
    assert b"f6 title" in response.data
    assert b"f5 title" not in response.data


def test_get_recent(client, auth):
    auth.login()
    response = client.get("/recent")
    assert response.status_code == 200
