from flask import g, abort
from flask_restful import Resource, fields, marshal
from .. import db
from .. import auth

# explicitly define which data fields to pass back via marshal()
file_fields = {
    "file_id": fields.Integer,
    "title": fields.String,
    "file_type": fields.String,
    "updated": fields.Integer,
    "size": fields.Integer,
    "starred": fields.Boolean,
    "content": fields.String,
    "parent": fields.Integer,
}


class List(Resource):
    method_decorators = [auth.login_required, auth.user_owns_wrapper]

    def get(self, file_id):
        dbh = db.get_db()
        result = dbh.execute(
            "SELECT * FROM files WHERE parent = ?", (file_id,)
        ).fetchall()
        return [marshal(dict(f), file_fields) for f in result]


class Path(Resource):
    method_decorators = [auth.login_required, auth.user_owns_wrapper]

    def get(self, file_id):
        result = []
        dbh = db.get_db()
        curr_file = file_id

        while curr_file:
            file_data = dbh.execute(
                "SELECT * FROM files WHERE file_id = ?", (curr_file,)
            ).fetchone()
            result.append(marshal(dict(file_data), file_fields))
            curr_file = file_data["parent"]

        return result


class Starred(Resource):
    def get(self):
        """Retrieve list of starred files"""
        dbh = db.get_db()
        if g.user_id is None:
            abort(400)
        else:
            result = dbh.execute(
                "SELECT * FROM files WHERE starred = TRUE AND user_id = ?",
                (g.user_id,)
            ).fetchall()
            return [marshal(dict(f), file_fields) for f in result]


class Recent(Resource):
    def get(self):
        dbh = db.get_db()
        if g.user_id is None:
            abort(400)
        else:
            result = dbh.execute(
                "SELECT * FROM files WHERE user_id = ? ORDER BY updated DESC LIMIT 5",
                (g.user_id,)
            ).fetchall()
            return [marshal(dict(f), file_fields) for f in result]


class Home(Resource):
    def get(self):
        dbh = db.get_db()
        if g.user_id is None:
            abort(400)
        else:
            result = dict(dbh.execute(
                "SELECT home FROM users WHERE user_id = ?",
                (g.user_id,)
            ).fetchone())
            return {'home': result.get('home', None)}