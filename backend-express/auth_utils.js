const path = require('path');
const hash = require('pbkdf2-password')({
    saltLength: 16,
    iterations: 260000,
    // keyLength (length of generated key)
    digest: 'sha256'
})


function get_hashed_password(password) {
    // we're imitating werkzeug.security.get_password_hash, which returns
    // a string including algorithm:iterations$salt$hash
    //'pbkdf2:sha256:260000$ILEmY6640NoY2yx0$f519a5567ba3a09949257d02f791bb877790f6a1c7636795768321ae5f6046a8'

    /*
    hash({ password: password }, function (err, pass, salt, hash) {
        if (err) throw err;
        
        // format output to match werkzeug's
        return `pbkdf2:sha256:260000$${salt}$${hash}`;
      });
    */
    return password;
}

function check_hashed_password(password_attempt, hash_from_db) {
    /*
    const salt = hash_from_db.split('$')[1];

    hash({ password: password_attempt, salt: salt}, function (err, pass, salt, hash) {
        if (err) throw err;

        return assert.deepEqual(hash, hash_from_db.split('$')[2]);
    });
    */
    return password_attempt === hash_from_db;
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