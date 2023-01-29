const crypto = require('crypto');


const SALT_LENGTH = 16;
const PBKDF2_ITERATIONS = 500000;
const PASSWORD_KEY_LENGTH = 64;
const PBKDF2_DIGEST_ALGO = 'sha256';

function _hex_from_bytes(buffer) {
    return [...new Uint8Array(buffer)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}
function _bytes_from_hex(string) {
    let bytes = [];
    string.replace(/../g, function (pair) {
        bytes.push(parseInt(pair, 16));
    });
    return new Uint8Array(bytes).buffer;
}

function _hash(password, salt) {
    return crypto.pbkdf2Sync(
        password,
        salt,
        PBKDF2_ITERATIONS,
        PASSWORD_KEY_LENGTH,
        PBKDF2_DIGEST_ALGO
    );
}

function get_hashed_password(password) {

    const salt_bytes = crypto.randomBytes(SALT_LENGTH);

    // convert password string to byte encoding
    const password_bytes = new TextEncoder().encode(password);

    // calculate hash from password & salt bytes
    const hash_bytes = _hash(password_bytes, salt_bytes);

    // convert to hex and return
    return {
        hashed_password: _hex_from_bytes(hash_bytes),
        salt: _hex_from_bytes(salt_bytes)
    };
}

function check_hashed_password(password_attempt, hashed_password_from_db, salt_from_db) {
    
    // convert everything to bytes
    const password_bytes = new TextEncoder().encode(password_attempt);
    const hash_bytes_from_db = _bytes_from_hex(hashed_password_from_db);
    const salt_bytes_from_db = _bytes_from_hex(salt_from_db);
    
    // calculate hash of attempt with password and salt
    const hash_bytes = _hash(password_bytes, salt_bytes_from_db);

    // compare
    return crypto.timingSafeEqual(hash_bytes, hash_bytes_from_db);
}

function login_required(req, res, next) {
    // kind of like Flask wrapper. Attach to endpoint, gets called before callback
    // router.get('/example', login_required, function (req, res){//code})
    if (req.session.user_id) {
        next();
    } else {
        res.status(401);
        res.send('Access denied');
    }
}

exports.get_hashed_password = get_hashed_password;
exports.check_hashed_password = check_hashed_password;
exports.login_required = login_required;