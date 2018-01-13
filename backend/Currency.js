var express = require("express");
var mysql = require("./mysql-connection");
var winston = require("winston");
var request = require("request");

module.exports = {
    getById: function(currencyId) {
        return new Promise((resolve, reject) => {
            mysql.query(
                "SELECT * FROM currencies_cryptocompare WHERE currency_id = ?",
                [currencyId],
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
    getBySymbol: function(symbol) {
        return new Promise((resolve, reject) => {
            mysql.query(
                "SELECT * FROM currencies_cryptocompare WHERE symbol = ?",
                [symbol],
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
    getByUser: function(userId) {
        return new Promise((resolve, reject) => {
            mysql.query(
                "SELECT * FROM investments as i LEFT JOIN currencies_cryptocompare as cc on i.currency_id = cc.currency_id WHERE i.user_id = ? GROUP BY i.currency_id ",
                [userId],
                (err, rows, fields) => {
                    if (err) {
                        winston.error(err);
                        reject(err);
                        return;
                    }
                    if (rows != undefined && rows.length > 0) {
                        resolve(rows);
                        return;
                    } else {
                        reject(404);
                        return;
                    }
                }
            );
        });
    },
    getAll: function() {
        return new Promise((resolve, reject) => {
            winston.debug("Querying database for the list of currencies.");
            mysql.query(
                "SELECT * FROM currencies_cryptocompare ORDER BY sort_order ASC",
                (err, rows, fields) => {
                    if (err) {
                        winston.error(err);
                        reject(err);
                        return;
                    } else {
                        resolve(rows);
                        return;
                    }
                }
            );
        });
    }
};
