import sqlite3
import click
from flask import current_app, g


def init_db():
    dbh = get_db()
    with current_app.open_resource("schema.sql") as f:
        dbh.executescript(f.read().decode("utf8"))


@click.command("init-db")
def init_db_command():
    init_db()
    click.echo("Database initialized")


def get_db():
    if "dbh" not in g:
        g.dbh = sqlite3.connect(
            current_app.config["DATABASE"], detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.dbh.row_factory = sqlite3.Row
    return g.dbh


def close_db(e=None):
    dbh = g.pop("dbh", None)
    if dbh is not None:
        dbh.close()
