from flask import Blueprint, g, abort, current_app
from flask_restful import Api, Resource, reqparse, fields, marshal
from sys import getsizeof
from .db import get_db
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
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "SELECT vault FROM users WHERE user_id = %s", 
            (g.user_id,)
        )
        return {"vault": cur.fetchone()}

    def put(self):
        """put vault"""
        args = self.reqparse.parse_args()
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "UPDATE users SET vault = %s WHERE user_id = %s", 
            (args['vault'], g.user_id)
        )
        conn.commit()
        return {"success": True, "message": ""}


bp = Blueprint("api", __name__, url_prefix="")
api = Api(bp)
api.add_resource(Vault, "/api/vault")