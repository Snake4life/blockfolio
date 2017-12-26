var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
    if (req.user == null) return res.sendStatus(401);

    res.json({
        username: req.user.username
    });
});

module.exports = router;
