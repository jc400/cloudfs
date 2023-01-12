from app import create_app


def test_config():
    """ Checks that testing property does NOT exist for default app,
        but does exist if explicitly passed to factory method.
    """
    assert not create_app().testing
    assert create_app({'TESTING': True}).testing


def test_404(client):
    """ Check that app is up and serving 404s"""
    response = client.get('/fake/endpoint')
    assert response.status_code == 404