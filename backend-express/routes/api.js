const express = require('express');
const { login_required } = require('../auth_utils');
const { get_db } = require('../db.js');


const router = express.Router();


router.get('/vault', login_required, function (req, res, next){
    const user_id = req.session.user_id;
    const dbh = get_db();
    dbh.get(
        "SELECT vault FROM users WHERE user_id = ?",
        user_id,
        function (err, row) {
            if (err === null){
                res.send({vault: row.vault});
            } else {
                res.send(err.message);
            }
        }
    )
})

router.put('/vault', login_required, function (req, res, next){
    const vault = req?.body?.vault;
    const user_id = req.session.user_id;
    const dbh = get_db();
    if (user_id && vault) {
        dbh.run(
            "UPDATE users SET vault = ? WHERE user_id = ?",
            [vault, user_id],
            function (e) {
                if (e === null) {
                    res.send({ success: true, message: "" });
                } else {
                    res.send({ success: false, message: e.message });
                }
            }
        )
    } else {
        res.send({ success: false, message: "Something went wrong" });
    }
})

module.exports = router;
