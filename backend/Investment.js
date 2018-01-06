var express = require("express");
var winston = require("winston");
var request = require("request");
var mysql = require("./mysql-connection");

module.exports = {
    getByUser: function(userId) {
        return new Promise((resolve, reject) => {
            winston.info("Getting investments for user " + userId);
            mysql.query(
                "SELECT * FROM `investments`  LEFT JOIN currencies_cryptocompare ON currencies_cryptocompare.currency_id = investments.currency_id WHERE user_id = ? ORDER BY investments.date",
                [userId],
                (err, rows, fields) => {
                    if (err) {
                        winston.error(
                            "Error while retrieving investments. " + err
                        );
                        return reject(err);
                    } else {
                        winston.info(
                            "Retrieved investments: " + rows.length + " row(s)."
                        );
                        return resolve(rows);
                    }
                }
            );
        });
    },

    getByUserAndSymbol: function(userId, symbol) {
        return new Promise((resolve, reject) => {
            winston.info(
                "Getting investments of " + symbol + " for user " + userId
            );
            mysql.query(
                "SELECT * FROM `investments` LEFT JOIN currencies_cryptocompare ON currencies_cryptocompare.currency_id = investments.currency_id WHERE investments.user_id = ? AND currencies_cryptocompare.symbol = ? ORDER BY investments.date",
                [userId, symbol],
                (err, rows, fields) => {
                    if (err) {
                        winston.error(
                            "Error while retrieving investments. " + err
                        );
                        return reject(err);
                    } else {
                        if (rows.length > 0) {
                            winston.info("Retrieved investments.");
                            return resolve(rows);
                        } else {
                            winston.info("No investments found.");
                            return reject(404);
                        }
                    }
                }
            );
        });
    },

    getByUserAndInvestment: function(userId, investmentId) {
        return new Promise((resolve, reject) => {
            winston.info("Getting investment "+investmentId+" for user "+userId);

            mysql.query("SELECT * FROM `investments` LEFT JOIN currencies_cryptocompare ON currencies_cryptocompare.currency_id = investments.currency_id WHERE investments.user_id = ? AND investment_id = ?", [userId, investmentId], (err, rows, fields)=>{
                if(err) {
                    winston.error("Error while retrieving investment. "+err);
                    return reject(err);
                }
                else {
                    if(rows.length > 0) {
                        winston.info("Retrieved investment "+investmentId);
                        return resolve(rows[0]);
                    }
                    else {
                        winston.info("No investment found with id "+investmentId + " for user "+userId);
                        return reject(404);
                    }
                }
            });
        });
    },

    add: function(userId, currencyId, amount, date) {
        return new Promise((resolve, reject) => {
            winston.info(
                "Adding investment of " +
                    amount +
                    " amount of " +
                    currencyId +
                    " for user " +
                    userId + 
                    " date " + 
                    date
            );

            mysql.query(
                "INSERT INTO investments (user_id, currency_id, amount, date) VALUES (?, ?, ?, ?)",
                [userId, currencyId, amount, date],
                (err, rows, fields) => {
                    if (err) {
                        winston.error("Error while adding investment. " + err);
                        return reject(err);
                    } else {
                        winston.info("Added investment.");
                        return resolve();
                    }
                }
            );
        });
    },
    delete: function(investmentId, userId) {
        return new Promise((resolve, reject)=> {
            winston.info("Deleting investment "+investmentId+" for user "+userId);

            mysql.query("DELETE FROM investments WHERE investment_id = ? AND user_id = ?", [investmentId, userId], (err, rows, fields)=>{
                if(err) {
                    winston.error("Error while deleting an investment");
                } else {
                    return resolve();
                }
            });

       });
    }
};
