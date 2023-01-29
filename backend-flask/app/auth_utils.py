import hashlib
import hmac
import secrets

SALT_LENGTH = 16
PBKDF2_ITERATIONS = 500000
PASSWORD_KEY_LENGTH = 64
PBKDF2_DIGEST_ALGO = 'sha256'

def _hash(password, salt):
    """Accepts password/salt as hex strings, returns hash as hex value"""
    password = password.encode('utf-8')
    salt = salt.encode('utf-8')
    return hashlib.pbkdf2_hmac(
        PBKDF2_DIGEST_ALGO, 
        password, 
        salt, 
        PBKDF2_ITERATIONS
    ).hex()

def get_hashed_password(password):
    """Accepts password as string, returns hex password hash + salt"""
    salt = secrets.token_bytes(SALT_LENGTH).hex()
    hashed_password = _hash(password, salt)
    return hashed_password, salt

def check_hashed_password(password_attempt, hashed_password_from_db, salt_from_db):
    """Accepts password attempt as string, hashed_password and salt as hex. Returns bool"""
    hashed_attempt = _hash(password_attempt, salt_from_db)
    return secrets.compare_digest(hashed_attempt, hashed_password_from_db)
