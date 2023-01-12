from flask import Blueprint
from flask_restful import Api
from .file_resources import File, FileList, List, Path, Starred, Recent, Home


bp = Blueprint("api", __name__, url_prefix="")
api = Api(bp)

api.add_resource(File, "/api/files/<int:file_id>")
api.add_resource(FileList, "/api/files")
api.add_resource(List, "/api/list/<int:file_id>")
api.add_resource(Path, "/api/path/<int:file_id>")
api.add_resource(Starred, "/api/starred")
api.add_resource(Recent, "/api/recent")
api.add_resource(Home, "/api/home")
