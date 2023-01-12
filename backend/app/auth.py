import functools
from flask import (
    Blueprint, g, request, session, abort
)
from werkzeug.security import check_password_hash, generate_password_hash
import time
from .db import get_db

bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.route('/register', methods=['POST'])
def register():
    post_data = request.get_json(cache=False)
    username = post_data['username']
    password = post_data['password']
    now = time.time()
    dbh = get_db()
    message = None

    if not username:
        message = 'Username is required.'
    elif not password:
        message = 'Password is required.'

    if message is None:
        try:
            dbh.execute(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                (username, generate_password_hash(password)),
            )
            dbh.execute(
                "INSERT INTO files (title, created, updated, file_type, parent, user_id)"
                "VALUES ( 'Home', ?, ?, 'd', 0, LAST_INSERT_ROWID() )",
                (now, now),
            )
            dbh.execute(
                "UPDATE users SET home = LAST_INSERT_ROWID()"
            )
            dbh.commit()
        except dbh.IntegrityError:
            message = f"User {username} is already registered."
        else:
            return {"success":True, "message":"Registered"}

    return {"success":False, "message":message}


@bp.route('/login', methods=['POST'])
def login():
    post_data = request.get_json(cache=False)
    username = post_data['username']
    password = post_data['password']
    dbh = get_db()
    message = None
    home = None
    user = dbh.execute(
        'SELECT * FROM users WHERE username = ?', (username,)
    ).fetchone()

    if user is None:
        message = 'Incorrect username.'
    elif not check_password_hash(user['password'], password):
        message = 'Incorrect password.'

    if message is None:
        session.clear()
        session['user_id'] = user['user_id']
        return {"success":True, "message":"Logged in", "home":user['home']}

    return {"success":False, "message":message}


@bp.route('/logout')
def logout():
    session.clear()
    return {"success":True, "message":"Logged out"}


@bp.route('/check_login')
def check_login():
    if g.user_id is None:
        return {"logged in": False}
    else:
        return {"logged in": True}
        

@bp.before_app_request
def load_logged_in_user():
    """Runs before every request, stores user data on g object"""
    user_id = session.get('user_id')

    if user_id is None:
        g.user_id = g.user_data = None
    else:
        g.user_id = user_id
        g.user_data = get_db().execute(
            'SELECT * FROM users WHERE user_id = ?', (user_id,)
        ).fetchone()


def login_required(view):
    """Returns new view function that wraps target view. """
    @functools.wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.user_id is None:
            abort(401)

        return view(*args, **kwargs)

    return wrapped_view


def user_owns(file_id, user_id):
    """Determines access to a file. Return true if user owns (and can manipulate)
    the file, false if not. Implement as wrapper (and grab file_id from args)??
    """
    dbh = get_db()
    result = dbh.execute(
        "SELECT * FROM files WHERE file_id = ?", 
        (file_id,)
    ).fetchone()
    return result and user_id == result['user_id']


def user_owns_wrapper(view):
    """Returns new view function that wraps target view. """
    @functools.wraps(view)
    def wrapped_view(*args, **kwargs):
        file_id = kwargs.get("file_id", None)
        if not user_owns(file_id, g.user_id):
            abort(404)
        return view(*args, **kwargs)
    return wrapped_view