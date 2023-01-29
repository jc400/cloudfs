const express = require('express');
const { login_required } = require('../auth_utils');
const db = require('../db.js');


const router = express.Router();


router.get('/vault', login_required, function (req, res, next){
    const user_id = req.session.user_id;

    db.one(
        "SELECT vault FROM users WHERE user_id = $1",
        [user_id]
    )
    .then(row => {
        res.send({vault: row.vault});
    })
    .catch(err => {
        res.send(err.message);
    });

})

router.put('/vault', login_required, function (req, res, next){
    const vault = req?.body?.vault;
    const user_id = req.session.user_id;

    if (user_id && vault) {
        db.none(
            "UPDATE users SET vault = $1 WHERE user_id = $2",
            [vault, user_id]
        )
        .then(() => {
            res.send({ success: true, message: "" });
        })
        .catch(err => {
            res.send({ success: false, message: err.message });
        });

    } else {
        res.send({ success: false, message: "Something went wrong" });
    }
})

module.exports = router;
