import functools
from flask import (
    Blueprint, g, request, session, abort
)
from psycopg2 import errors

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
    conn = get_db()
    cur = conn.cursor()

    if username and password and vault:
        try:
            hashed_password, salt = get_hashed_password(password)
            cur.execute(
                "INSERT INTO users (username, hashed_password, salt, vault) VALUES (%s, %s, %s, %s)",
                (username, hashed_password, salt, vault),
            )
            conn.commit()
        except errors.UniqueViolation:
            return {"success":False, "message":"User exists already"}
        else:
            return {"success":True, "message":"Registered"}

    return {"success":False, "message":"Missing username, password, or vault"}


@bp.route('/login', methods=['POST'])
def login():
    post_data = request.get_json(cache=False)
    username = post_data['username']
    password = post_data['password']
    conn = get_db()
    cur = conn.cursor()

    if username and password:
        cur.execute(
            'SELECT user_id, hashed_password, salt FROM users WHERE username = %s', 
            (username,)
        )
        user = cur.fetchone()
        if user:
            if check_hashed_password(password, user[1], user[2]):
                session.clear()
                session['user_id'] = user[0]
                return {"success":True, "message":"Logged in"}
            else:
                return {"success":False, "message":"Incorrect credentials"}
        else:
            return {"success":False, "message":"Incorrect credentials"}
    else:
        return {"success":False, "message":"Incorrect credentials"}



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
        g.user_id = None
    else:
        g.user_id = user_id


def login_required(view):
    """Returns new view function that wraps target view. """
    @functools.wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.user_id is None:
            abort(401)

        return view(*args, **kwargs)

    return wrapped_view

