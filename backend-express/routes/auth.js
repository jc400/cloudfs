const express = require('express');
const session = require('express-session');
const { get_hashed_password, check_hashed_password } = require('../auth_utils');
const { get_db } = require('../db.js');

// init router, configure session
const router = express.Router();
router.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret'
}));


router.post('/register', function (req, res, next) {
    const username = req?.body?.username;
    const password = req?.body?.password;
    const vault = req?.body?.vault;
    const dbh = get_db();

    if (username && password && vault) {
        // https://github.com/TryGhost/node-sqlite3/wiki/API#runsql--param---callback
        dbh.run(
            "INSERT INTO users (username, password, vault) VALUES (?, ?, ?)",
            [username, get_hashed_password(password), vault],
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
                    if (check_hashed_password(password, row.password)) {
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

router.get('/logout', function (req, res, next) {
    req.session.destroy(function () {
        res.send({ success: true, message: "Logged out" });
    });
})

router.get('/check_login', function (req, res, next) {
    if (req.session.user_id) {
        res.send({ "logged in": true })
    } else {
        res.send({ "logged in": false })
    }
})


module.exports = router;