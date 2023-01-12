from flask import current_app
from .. import db


def is_directory(file_id):
    dbh = db.get_db()
    result = (
        dbh.execute(
            "SELECT file_type FROM files WHERE file_id = ?", (file_id,)
        ).fetchone()["file_type"]
        == "d"
    )
    return result


def is_file(file_id):
    dbh = db.get_db()
    result = (
        dbh.execute(
            "SELECT file_type FROM files WHERE file_id = ?", (file_id,)
        ).fetchone()["file_type"]
        == "f"
    )
    return result


def exceeds_size_allowance(user_id, size):
    if "SIZE_ALLOWANCE" not in current_app.config:
        return False
    else:
        dbh = db.get_db()
        result = dbh.execute(
            "SELECT SUM(size) FROM files WHERE user_id = ?",
            (user_id,)
        ).fetchone()['SUM(size)']
        return result + size > current_app.config["SIZE_ALLOWANCE"]


def exceeds_file_allowance(user_id):
    if "FILE_ALLOWANCE" not in current_app.config:
        return False
    else:
        dbh = db.get_db()
        result = dbh.execute(
            "SELECT COUNT(*) FROM files WHERE user_id = ?",
            (user_id,)
        ).fetchone()['COUNT(*)']
        return result + 1 > current_app.config["FILE_ALLOWANCE"]
