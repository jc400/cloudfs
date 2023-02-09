import os
import tempfile

import pytest
from app import create_app
from app.db import get_db

with open(os.path.join(os.path.dirname(__file__), 'data.sql'), 'rb') as f:
    _data_sql = f.read().decode('utf8')


@pytest.fixture(scope="session")
def app():

    app = create_app({
        'TESTING': True,
        'DATABASE': os.environ["TEST_DB"],
    })

    with app.app_context():
        conn = get_db()
        cur = conn.cursor()
        cur.execute(_data_sql)
        conn.commit()
        conn.close()

    yield app

    # cleanup by removing test_users table
    with app.app_context():
        conn = get_db()
        cur = conn.cursor()
        cur.execute("DROP TABLE users")
        conn.commit()

        cur = conn.cursor()
        cur.execute("DROP TABLE token_blocklist")
        conn.commit()

        conn.close()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def runner(app):
    return app.test_cli_runner()


@pytest.fixture
def cur(app):
    with app.app_context():
        conn = get_db()
        cur = conn.cursor()
        yield cur 
        conn.close()


@pytest.fixture
def auth(client):
    return AuthActions(client)


class AuthActions(object):
    """Custom fixture to run login/logout actions"""
    def __init__(self, client):
        self._client = client

    def login(self, username='test', password="âsD§\x97ÿ1\x10uñð=R=\x82\x8f·\x1c{~\x9b;\x93\xa0íL\x10ß½Î\xa0\x92"):
        resp = self._client.post(
            '/api/auth/login',
            json={'username': username, 'password': password}
        )
        self._jwt = resp.json.get('access_token', None)                                  
        return resp

    def get(self, *args, **kwargs):
        return self._client.get(
            *args,
            headers={"Authorization": "Bearer {}".format(self._jwt)},
            **kwargs
        )

    def post(self, *args, **kwargs):
        return self._client.post(
            *args,
            headers={"Authorization": "Bearer {}".format(self._jwt)},
            **kwargs
        )
    
    def put(self, *args, **kwargs):
        return self._client.put(
            *args,
            headers={"Authorization": "Bearer {}".format(self._jwt)},
            **kwargs
        )

    def logout(self):
        #self._jwt = None
        return self._client.delete(
            '/api/auth/logout', 
            headers={"Authorization": "Bearer {}".format(self._jwt)}
        )