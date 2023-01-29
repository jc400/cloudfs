import functools
from flask import (
    Blueprint, g, request, session, abort
)
from werkzeug.security import check_password_hash, generate_password_hash

import time
from .db import get_db
from .auth_utils import get_hashed_password, check_hashed_password

bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.route('/register', methods=['POST'])
def register():
    post_data = request.get_json(cache=False)
    username = post_data['username']
    password = post_data['password']
    vault = post_data['vault']
    dbh = get_db()
    message = None

    if not username:
        message = 'Username is required.'
    elif not password:
        message = 'Password is required.'
    elif not vault: 
        message = 'Vault is required.'

    if message is None:
        try:
            hashed_password, salt = get_hashed_password(password)
            dbh.execute(
                "INSERT INTO users (username, hashed_password, salt, vault) VALUES (?, ?, ?, ?)",
                (username, hashed_password, salt, vault),
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

    user = dbh.execute(
        'SELECT * FROM users WHERE username = ?', (username,)
    ).fetchone()

    if user is None:
        message = 'Incorrect username.'
    elif not check_hashed_password(password, user['hashed_password'], user['salt']):
        message = 'Incorrect password.'

    if message is None:
        session.clear()
        session['user_id'] = user['user_id']
        return {"success":True, "message":"Logged in"}

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

