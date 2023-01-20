from flask import Blueprint, g, abort, current_app
from flask_restful import Api, Resource, reqparse, fields, marshal
from sys import getsizeof
from . import db
from . import auth


# explicitly define which data fields to pass back via marshal()
file_fields = {
    "vault": fields.String
}

class Vault(Resource):
    method_decorators = [auth.login_required]

    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument("vault", type=str, location="json")
        super().__init__()

    def get(self):
        """Retrieve vault"""
        dbh = db.get_db()
        out = dict(
            dbh.execute("SELECT vault FROM users WHERE user_id = ?", (g.user_id,)).fetchone()
        )
        return marshal(out, file_fields)

    def put(self):
        """put vault"""
        args = self.reqparse.parse_args()
        dbh = db.get_db()
        dbh.execute("UPDATE users SET vault = ? WHERE user_id = ?", (args['vault'], g.user_id))
        dbh.commit()
        return {"success": True, "message": ""}


bp = Blueprint("api", __name__, url_prefix="")
api = Api(bp)
api.add_resource(Vault, "/api/vault")