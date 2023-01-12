from flask import g, abort, current_app
from flask_restful import Resource, reqparse, fields, marshal
import time
from sys import getsizeof
from .. import db
from .. import auth
from .utils import is_directory, is_file, exceeds_size_allowance, exceeds_file_allowance

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


class File(Resource):
    method_decorators = [auth.login_required, auth.user_owns_wrapper]

    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument("title", type=str, location="json")
        self.reqparse.add_argument("content", type=str, location="json")
        self.reqparse.add_argument("file_type", type=str, location="json")
        self.reqparse.add_argument("starred", type=bool, location="json")
        self.reqparse.add_argument("parent", type=int, location="json")
        super().__init__()

    def get(self, file_id):
        """Retrieve info for single file"""
        dbh = db.get_db()
        out = dict(
            dbh.execute("SELECT * FROM files WHERE file_id = ?", (file_id,)).fetchone()
        )
        return marshal(out, file_fields)

    def put(self, file_id):
        """Generic update of a file. Used to modify any editable fields, based on
        POSTed data: title, content, starred, parent (rename/modify/move/star)
        """
        args = self.reqparse.parse_args()
        dbh = db.get_db()

        for k, v in args.items():
            if v is not None:
                if k == "title":
                    dbh.execute(
                        """
                        UPDATE files SET title = ?, updated = ?
                        WHERE file_id = ?
                        """,
                        (v, time.time(), file_id),
                    )
                elif k == "content":
                    if (
                        is_file(file_id) 
                        and not exceeds_size_allowance(g.user_id, getsizeof(v))
                    ):
                        dbh.execute(
                            """
                            UPDATE files SET content = ?, updated = ?, size = ?
                            WHERE file_id = ?
                            """,
                            (v, time.time(), getsizeof(v), file_id),
                        )
                    else:
                        abort(400)
                elif k == "starred":
                    dbh.execute(
                        """
                        UPDATE files SET starred = ?
                        WHERE file_id = ?
                        """,
                        (v, file_id),
                    )
                elif k == "parent":
                    parent_id = v
                    if auth.user_owns(parent_id, g.user_id) and is_directory(parent_id):
                        dbh.execute(
                            """
                            UPDATE files SET parent = ?
                            WHERE file_id = ?
                            """,
                            (parent_id, file_id),
                        )
                    else:
                        abort(400)

        dbh.commit()
        return {"success": True, "message": ""}

    def delete(self, file_id):
        """Delete given file"""
        dbh = db.get_db()
        if file_id == g.user_data['home']:
            abort(400)
        else:
            dbh.execute("DELETE FROM files WHERE file_id = ?;", (file_id,))
            dbh.commit()
            return {"success": True, "message": ""}


class FileList(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument("parent", type=int, location="json", required=True)
        self.reqparse.add_argument(
            "file_type", type=str, location="json", required=True
        )
        self.reqparse.add_argument(
            "title", type=str, location="json", default="Untitled document"
        )
        self.reqparse.add_argument("content", type=str, location="json", default="")
        self.reqparse.add_argument("starred", type=bool, location="json", default=False)
        super().__init__()

    def post(self):
        """Add new file to DB"""
        args = self.reqparse.parse_args()
        dbh = db.get_db()
        now = time.time()

        if not auth.user_owns(args["parent"], g.user_id):
            abort(401)
        elif exceeds_file_allowance(g.user_id) or exceeds_size_allowance(g.user_id, getsizeof(args["content"])):
            abort(400)
        else:
            dbh.execute(
                "INSERT INTO files (title, created, updated, size, file_type, content, parent, user_id)"
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    args["title"],
                    now,
                    now,
                    getsizeof(args["content"]),
                    args["file_type"],
                    args["content"],
                    args["parent"],
                    g.user_id,
                ),
            )
            dbh.commit()

            result = dbh.execute(
                "SELECT * FROM files WHERE created = ?", (now,)
            ).fetchone()
            return {
                "success": True,
                "message": "",
                "file": marshal(dict(result), file_fields),
            }
