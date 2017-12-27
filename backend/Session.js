var express = require("express");
var crypto = require("crypto");
var winston = require("winston");
var mysql = require("./mysql-connection");

module.exports = {
    getSession: function(sessionId) {
        winston.info("getSession(" + sessionId + ")");
        return new Promise((resolve, reject) => {
            mysql.query(
                "SELECT * FROM sessions WHERE session_id = ? AND expires > NOW()",
                [sessionId],
                (err, rows, fields) => {
                    if (err) {
                        winston.error(err);
                        reject(err);
                        return;
                    }
                    if (rows != undefined && rows.length > 0) {
                        winston.info("Found session id " + rows[0].session_id);
                        resolve(rows[0]);
                        return;
                    } else {
                        winston.info("No session found for id " + sessionId);
                        reject(404);
                        return;
                    }
                }
            );
        });
    },
    extend: function(sessionId, expires) {
        winston.info("setExpires(" + sessionId + "," + expires + ")");
        return new Promise((resolve, reject) => {
            mysql.query(
                "UPDATE sessions SET expires = ? WHERE session_id = FROM_UNIXTIME(?)",
                [expires, sessionId],
                (err, rows, fields) => {
                    if (err) {
                        winston.error(err);
                        reject(err);
                        return;
                    } else {
                        this.getSession(sessionId)
                            .then(session => {
                                resolve(session);
                                return;
                            })
                            .catch(err => {
                                reject(err);
                                return;
                            });
                    }
                }
            );
        });
    },
    terminate: function(sessionId) {
        return new Promise((resolve, reject) => {
            mysql.query(
                "DELETE FROM sessions WHERE session_id = ?",
                [sessionId],
                err => {
                    if (err) {
                        winston.error(err);
                        reject(err);
                        return;
                    } else {
                        winston.info(
                            "Session " + sessionId + " succesfully terminated."
                        );
                        resolve();
                        return;
                    }
                }
            );
        });
    }
};
