const crypto = require('crypto');


const PBKDF2_ITERATIONS = 500000;
const PASSWORD_KEY_LENGTH = 64;
const PBKDF2_DIGEST_ALGO = 'sha256';


function get_hashed_password(password) {
    const salt = crypto.randomBytes(16);
    const hashed_password = crypto.pbkdf2Sync(
        password,
        salt,
        PBKDF2_ITERATIONS,
        PASSWORD_KEY_LENGTH,
        PBKDF2_DIGEST_ALGO
    );
    return {hashed_password: hashed_password, salt: salt};
}

function check_hashed_password(password_attempt, hashed_password_from_db, salt_from_db) {
    const hashed_attempt = crypto.pbkdf2Sync(
        password_attempt,
        salt_from_db,
        PBKDF2_ITERATIONS,
        PASSWORD_KEY_LENGTH,
        PBKDF2_DIGEST_ALGO
    );
    return crypto.timingSafeEqual(hashed_attempt, hashed_password_from_db);
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