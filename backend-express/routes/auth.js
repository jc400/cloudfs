const express = require('express');
const { get_hashed_password, check_hashed_password } = require('../auth_utils');
const db = require('../db.js');


const router = express.Router();


router.post('/register', function (req, res, next) {
    const username = req?.body?.username;
    const password = req?.body?.password;
    const vault = req?.body?.vault;

    if (username && password && vault) {
        const {hashed_password, salt} = get_hashed_password(password);

        db.none(
            "INSERT INTO users(username, hashed_password, salt, vault) VALUES($1, $2, $3, $4)",
            [username, hashed_password, salt, vault]
        )
        .then(() => {
            res.send({ success: true, message: "Registered" });
        })
        .catch(err => {
            res.send({ success: false, message: err.message });
        });

    } else {
        res.send({ success: false, message: "Something went wrong" });
    }
});

router.post('/login', function (req, res, next) {
    const username = req?.body?.username;
    const password = req?.body?.password;

    if (username && password) {
        db.one(
            "SELECT * FROM users WHERE username = $1",
            [username],
        )
        .then(row => {
            if (row?.user_id){
                if (check_hashed_password(password, row.hashed_password, row.salt)) {
                    req.session.regenerate(function () {
                        // if everything checks out, generate a session
                        req.session.user_id = row.user_id;
                        res.send({ success: true, message: "Logged in" });
                    });
                } else {
                    res.send({ success: false, message: "Incorrect credentials"})
                }
            } else {
                res.send({ success: false, message: "Incorrect credentials"});
            }
        })
        .catch(err => {
            res.send({ success: false, message: err.message });
        });

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