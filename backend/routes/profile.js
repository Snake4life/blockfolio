var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
    res.json({
        username: req.user.username
    });
});


module.exports = router;
