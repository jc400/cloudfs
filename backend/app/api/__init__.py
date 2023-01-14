from flask import Blueprint
from flask_restful import Api
from .resources import Blob

bp = Blueprint("api", __name__, url_prefix="")
api = Api(bp)

api.add_resource(Blob, "/api/blob")
