import psycopg2
from flask import current_app, g


def get_db():
    if "dbh" not in g:
        g.dbh = psycopg2.connect(current_app.config['DATABASE'],)
    return g.dbh


def close_db(e=None):
    dbh = g.pop("dbh", None)
    if dbh is not None:
        dbh.close()
