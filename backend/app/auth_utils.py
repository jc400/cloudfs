import hashlib
import hmac
import secrets

SALT_LENGTH = 16
PBKDF2_ITERATIONS = 500000
PASSWORD_KEY_LENGTH = 64
PBKDF2_DIGEST_ALGO = 'sha256'


def _hex_from_bytes(buffer):
    return buffer.hex()

def _bytes_from_hex(string):
    return bytes.fromhex(string)


def _hash(password, salt):
    """Accepts password/salt as byte strings, returns hash as bytes"""
    return hashlib.pbkdf2_hmac(
        PBKDF2_DIGEST_ALGO, 
        password, 
        salt, 
        PBKDF2_ITERATIONS,
        PASSWORD_KEY_LENGTH
    )


def get_hashed_password(password):
    """Accepts password as string, returns password hash + salt as hex"""

    # generate random salt bytes
    salt = secrets.token_bytes(SALT_LENGTH)

    # convert string to byte encoding of that string
    password = password.encode('utf-8')

    # calculate hash from password & salt bytes
    hashed_password = _hash(password, salt)

    # convert to hex and return
    return _hex_from_bytes(hashed_password), _hex_from_bytes(salt)


def check_hashed_password(password_attempt, hashed_password_from_db, salt_from_db):
    """Accepts password attempt as string, hashed_password and salt as hex. Returns bool"""
    
    # convert everything to bytes
    password_attempt = password_attempt.encode('utf-8')
    hashed_password_from_db = _bytes_from_hex(hashed_password_from_db)
    salt_from_db = _bytes_from_hex(salt_from_db)
    
    # calculate hash of attempt from passwrod/salt bytes
    hashed_attempt = _hash(password_attempt, salt_from_db)

    # compare
    return secrets.compare_digest(hashed_attempt, hashed_password_from_db)
