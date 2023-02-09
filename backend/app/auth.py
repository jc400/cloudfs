import functools
from flask import Blueprint, g, request, session, abort
from flask_jwt_extended import create_access_token, get_jwt, jwt_required, verify_jwt_in_request
from psycopg2 import errors

import time
from datetime import datetime, timezone

from .db import get_db
from .auth_utils import get_hashed_password, check_hashed_password
from .extensions import jwt

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
                access_token = create_access_token(identity=user[0])
                return {
                    "success": True,
                    "message": "Logged in",
                    "access_token": access_token,
                }
            else:
                return {"success":False, "message":"Incorrect credentials"}
        else:
            return {"success":False, "message":"Incorrect credentials"}
    else:
        return {"success":False, "message":"Incorrect credentials"}


@bp.route('/logout', methods=['DELETE'])
@jwt_required()
def logout():
    """Add current JWT to the block list"""
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    conn = get_db()
    conn.cursor().execute(
        "INSERT INTO token_blocklist (jti, created_at) VALUES (%s, %s)",
        (jti, now)
    )
    conn.commit()

    return {"success":True, "message":"Logged out"}


@bp.route('/check_login', methods=['GET'])
@jwt_required()
def check_login():
    return {"logged in": True}
        

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    """JWT callback, returns bool if JWT is in blocklist"""
    jti = jwt_payload["jti"]
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "SELECT token_id FROM token_blocklist WHERE jti = %s",
        (jti, )
    )
    token_id = cur.fetchone()
    return token_id is not None


def load_logged_in_user(view):
    """Wrapper, adds user_id to g object. Should only run after @jwt_required"""
    @functools.wraps(view)
    def wrapped_view(*args, **kwargs):
        verify_jwt_in_request()
        g.user_id = user_id = get_jwt().get('sub', None)
        return view(*args, **kwargs)
    return wrapped_view

