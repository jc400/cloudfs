const express = require('express');
const router = express.Router();
const session = require('express-session');
const path = require('path');
const hash = require('pbkdf2-password')({
    saltLength: 16,
    iterations: 260000,
    // keyLength (length of generated key)
    digest: 'sha256'
})
const { get_db } = require('../db.js');


// session config
router.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret'
}));


function _get_hashed_password(password) {
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

function _check_hashed_password(password_attempt, hash_from_db) {
    /*
    const salt = hash_from_db.split('$')[1];

    hash({ password: password_attempt, salt: salt}, function (err, pass, salt, hash) {
        if (err) throw err;

        return assert.deepEqual(hash, hash_from_db.split('$')[2]);
    });
    */
    return password_attempt === hash_from_db;
}


router.post('/register', function (req, res, next) {
    const username = req?.body?.username;
    const password = req?.body?.password;
    const vault = req?.body?.vault;
    const dbh = get_db();

    if (username && password && vault) {
        // https://github.com/TryGhost/node-sqlite3/wiki/API#runsql--param---callback
        dbh.run(
            "INSERT INTO users (username, password, vault) VALUES (?, ?, ?)",
            [username, _get_hashed_password(password), vault],
            function (e) {
                if (e === null) {
                    res.send({ success: true, message: "Registered" });
                } else {
                    res.send({ success: false, message: e.message });
                }
            }
        )
    } else {
        res.send({ success: false, message: "Something went wrong" });
    }
});

router.post('/login', function (req, res, next) {
    const username = req?.body?.username;
    const password = req?.body?.password;
    const dbh = get_db();
    if (username && password) {
        dbh.get(
            "SELECT user_id, username, password, vault FROM users WHERE username = ?",
            [username],
            function (err, row) {
                if (err === null) {
                    if (_check_hashed_password(password, row.password)) {
                        req.session.regenerate(function () {
                            req.session.user_id = row.user_id;
                            res.send({ success: true, message: "Logged in" });
                        });
                    } else {
                        res.send({ success: false, message: "Password issue" });
                    }
                } else {
                    res.send({ success: false, message: err.message });
                }
            }
        )
    } else {
        res.send({ success: false, message: "missinge user/pass" });
    }
});


module.exports = router;