var express = require("express");
var mysql = require("mysql");
var config = require("./config");
var crypto = require("crypto");
var winston = require("winston");
var mysql = require("./mysql-connection");

module.exports = {
    authenticate: function(username, password) {
        return new Promise((resolve, reject) => {
            mysql.query(
                "SELECT * FROM users WHERE users.username = ? AND users.password = SHA1(CONCAT(?,users.salt))",
                [username, password],
                (err, rows, fields) => {
                    if (err) {
                        winston.error(err);
                        reject(500);
                        return;
                    }
                    if (rows != undefined && rows.length > 0) {
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
            mysql.query(
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
            mysql.query(
                "SELECT * FROM sessions WHERE session_id = ? AND expires > NOW()",
                [sessionId],
                (err, rows, fields) => {
                    if (err) {
                        winston.error(err);
                        reject(500);
                        return;
                    }
                    if (rows.length > 0) {
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
            mysql.query(
                "SELECT * FROM users WHERE user_id = ?",
                [userId],
                (err, rows, fields) => {
                    if (err) {
                        winston.error(err);
                        reject(err);
                        return;
                    }
                    if (rows != undefined && rows.length > 0) {
                        resolve(rows[0]);
                        return;
                    } else {
                        reject(404);
                        return;
                    }
                }
            );
        });
    },
    updateSettings: function(userId, settings) {
        return new Promise((resolve, reject) => {
            let values = Object.keys(settings).map(el=>{
                return mysql.escapeId(el)+"="+mysql.escape(settings[el]);
            }).join();
            winston.info(values.toString());
            mysql.query(
                "UPDATE users SET " + values + " WHERE user_id = ?",
                [userId],
                (err, rows, fields) => {
                    if (err) {
                        winston.error(err);
                        reject(err);
                        return;
                    } else resolve();
                }
            );
        });
    }
};
