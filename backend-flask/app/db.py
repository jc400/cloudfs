import psycopg2
from flask import current_app, g
import os


def get_db():
    if "dbh" not in g:
        g.dbh = psycopg2.connect(os.environ['POSTGRES_DSN'])
    return g.dbh


def close_db(e=None):
    dbh = g.pop("dbh", None)
    if dbh is not None:
        dbh.close()
