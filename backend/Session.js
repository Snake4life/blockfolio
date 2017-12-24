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
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM sessions WHERE session_id = ? AND expires > NOW()",
                [sessionId],
                (err, rows, fields) => {
                    if(err) {
                        console.error(err);
                        reject(500);
                    }
                    if(rows.length>0) {
                        resolve(rows[0]);
                    } else reject(401);
                }
            );
        });
    },
    // elongate the expiry date
    elongate: function(sessionId) {

    }
};
