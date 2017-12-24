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
    getSession: function(sessionId) {
        console.log("getSession(" + sessionId + ")");
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM sessions WHERE session_id = ? AND expires > NOW()",
                [sessionId],
                (err, rows, fields) => {
                    if (err) {
                        console.error(err);
                        reject(500);
                    }
                    if (rows.length > 0) {
                        console.log("Found session id " + rows[0].session_id);
                        resolve(rows[0]);
                    } else {
                        console.log("No session found for id " + sessionId);
                        reject(401);
                    }
                }
            );
        });
    },
    extend: function(sessionId, expires) {
        console.log("setExpires(" + sessionId + "," + expires + ")");
        return new Promise((resolve, reject) => {
            connection.query(
                "UPDATE sessions SET expires = ? WHERE session_id = FROM_UNIXTIME(?)",
                [expires, sessionId],
                (err, rows, fields) => {
                    if (err) {
                        console.error(err);
                        reject(500);
                    }
                    else {
                        this.getSession(sessionId)
                            .then(session => {
                                resolve(session);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    }
                }
            );
        });
    }
};
