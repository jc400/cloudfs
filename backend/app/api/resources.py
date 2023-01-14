from flask import g, abort, current_app
from flask_restful import Resource, reqparse, fields, marshal
import time
from sys import getsizeof
from .. import db
from .. import auth
from .utils import is_directory, is_file, exceeds_size_allowance, exceeds_file_allowance

# explicitly define which data fields to pass back via marshal()
file_fields = {
    "blob": fields.String
}


class Blob(Resource):
    method_decorators = [auth.login_required]

    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument("blob", type=str, location="json")
        super().__init__()

    def get(self):
        """Retrieve blob"""
        dbh = db.get_db()
        out = dict(
            dbh.execute("SELECT blob FROM users WHERE user_id = ?", (g.user_id,)).fetchone()
        )
        return marshal(out, file_fields)

    def put(self):
        """put blob"""
        args = self.reqparse.parse_args()
        dbh = db.get_db()
        dbh.execute("UPDATE users SET blob = ? WHERE user_id = ?", (args['blob'], g.user_id))
        dbh.commit()
        return {"success": True, "message": ""}


