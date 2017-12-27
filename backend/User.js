var express = require("express");
var mysql = require("mysql");
var config = require("./config");
var crypto = require("crypto");
var winston = require("winston");

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
                        winston.error(err);
                        reject(500);
                        return;
                    }
                    if (rows !=undefined && rows.length > 0) {
                        resolve(rows[0]);
                        return;
                    } else {
                        reject(401);
                        return;
                    }
                }
            );
        });
    },
    generateToken: function(userId) {
        return new Promise((resolve, reject) => {
            var timestamp = Math.floor(Date.now() / 1000);
            var sessionId = crypto
                .createHash("md5")
                .update(timestamp + config.session.secret)
                .digest("hex");
            var expires = timestamp + config.session.expires;
            connection.query(
                "INSERT INTO sessions(user_id, session_id, expires) VALUES (?, ?, FROM_UNIXTIME(?))",
                [userId, sessionId, expires],
                (err, rows, fields) => {
                    if (err) {
                        winston.error(err);
                        reject(err);
                        return;
                    } else {
                        // return the token details to the user
                        var json = {
                            session_id: sessionId,
                            expires: expires
                        };

                        // send JSON back with token details

                        resolve(json);
                        return;
                    }
                }
            );
        });
    },
    isAuthenticated: function(sessionId) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM sessions WHERE session_id = ? AND expires > NOW()",
                [sessionId],
                (err, rows, fields) => {
                    if(err) {
                        winston.error(err);
                        reject(500);
                        return;
                    }
                    if(rows.length>0) {
                        resolve(rows[0]);
                        return;
                    } else {
                        reject(401);
                        return;
                    }
                }
            );
        });
    },
    findOne: function(userId) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM users WHERE user_id = ?",
                [userId],
                (err, rows, fields) => {
                    if(err) {
                        winston.error(err);
                        reject(err);
                        return;
                    }
                    if(rows !=undefined && rows.length>0) {
                        resolve(rows[0]);
                        return;
                    } else {
                        reject(404);
                        return;
                    }
                }
            );
        });
    }
};
