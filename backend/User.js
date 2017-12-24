var express = require("express");
var mysql = require("mysql");
var config = require("./config");
var crypto = require("crypto");

var connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    port: 3306
});

module.exports = {
    authenticate: function(username, password) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM users WHERE users.username = ? AND users.password = SHA1(CONCAT(?,users.salt))",
                [username, password],
                (err, rows, fields) => {
                    if (err) {
                        console.error(err);
                        reject(500);
                    }
                    if (rows.length > 0) {
                        resolve(rows[0]);
                    } else reject(401);
                }
            );
        });
    },
    generateToken: function(userId) {
        return new Promise((resolve, reject) => {
            var timestamp = Math.floor(Date.now() / 1000);
            var sessionId = crypto
                .createHash("md5")
                .update(timestamp + "ssecret string")
                .digest("hex");
            var expires = timestamp + config.session.expires;
            connection.query(
                "INSERT INTO sessions(user_id, session_id, expires) VALUES (?, ?, FROM_UNIXTIME(?))",
                [userId, sessionId, expires],
                (err, rows, fields) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        // return the token details to the user
                        var json = {
                            session_id: sessionId,
                            expires: expires
                        };

                        // send JSON back with token details

                        resolve(json);
                    }
                }
            );
        });
    }
};
