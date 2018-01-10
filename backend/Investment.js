var express = require("express");
var winston = require("winston");
var request = require("request");
var mysql = require("./mysql-connection");
var Currency = require("./Currency");
var dateFormat = require("dateformat");

module.exports = {
    getByUser: function(userId) {
        return new Promise((resolve, reject) => {
            winston.info("Getting investments for user " + userId);
            mysql.query(
                "SELECT i1.*, currencies_cryptocompare.* , ( SELECT SUM( amount )  FROM investments AS i2 WHERE i2.datetime <= i1.datetime AND i2.user_id = ? AND i1.currency_id = i2.currency_id ) AS balance, ph.price_usd as price_usd, ph.price_btc as price_btc, ph.price_eur as price_eur FROM `investments` AS i1 LEFT JOIN currencies_cryptocompare ON currencies_cryptocompare.currency_id = i1.currency_id LEFT JOIN prices_history AS ph ON ph.date=DATE(i1.datetime) AND ph.currency_id = i1.currency_id WHERE user_id = ? ORDER BY i1.datetime",
                [userId, userId],
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

    getSummaryForUser: function(userId) {
        return new Promise((resolve, reject) => {
            winston.info("Getting investments for user " + userId);
            mysql.query(
                "SELECT symbol, coin_name, SUM( amount * price_usd ) AS sum_usd FROM  `investments` LEFT JOIN currencies_cryptocompare ON investments.currency_id = currencies_cryptocompare.currency_id WHERE user_id = ? GROUP BY investments.currency_id",
                [userId],
                (err, rows, fields) => {
                    if (err) {
                        winston.error(
                            "Error while retrieving investment summary. " + err
                        );
                        return reject(err);
                    } else {
                        winston.info(
                            "Retrieved investments summary: " +
                                rows.length +
                                " row(s)."
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
                "SELECT * FROM `investments` LEFT JOIN currencies_cryptocompare ON currencies_cryptocompare.currency_id = investments.currency_id WHERE investments.user_id = ? AND currencies_cryptocompare.symbol = ? ORDER BY investments.datetime",
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

    getByUserAndCurrencyIdWithBalance: function(userId, currencyId) {
        return new Promise((resolve, reject) => {
            winston.info(
                "Getting investments of currency " +
                    currencyId +
                    " for user " +
                    userId +
                    " with balance"
            );
            mysql.query(
                "SELECT ph.price_usd, i1.investment_id,i1.currency_id, i1.datetime, i1.amount, ( SELECT SUM( amount )  FROM investments AS i2 WHERE i2.datetime <= i1.datetime AND i1.user_id = i2.user_id AND i1.currency_id = i2.currency_id ) AS balance \
                FROM  `investments` AS i1 \
                JOIN prices_history as ph ON i1.currency_id = ph.currency_id AND DATE(i1.datetime) = ph.date \
                WHERE i1.user_id = ? AND i1.currency_id = ? \
                GROUP BY DATE \
                ORDER BY DATE ASC ",
                [userId, currencyId],
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
            winston.info(
                "Getting investment " + investmentId + " for user " + userId
            );

            mysql.query(
                "SELECT * FROM `investments` as i LEFT JOIN prices_history as ph ON i.currency_id = ph.currency_id AND DATE(i.datetime) = ph.date  WHERE i.user_id = ? AND i.investment_id = ?",
                [userId, investmentId],
                (err, rows, fields) => {
                    if (err) {
                        winston.error(
                            "Error while retrieving investment. " + err
                        );
                        return reject(err);
                    } else {
                        if (rows.length > 0) {
                            winston.info(
                                "Retrieved investment " + investmentId
                            );
                            return resolve(rows[0]);
                        } else {
                            winston.info(
                                "No investment found with id " +
                                    investmentId +
                                    " for user " +
                                    userId
                            );
                            return reject(404);
                        }
                    }
                }
            );
        });
    },

    add: function(userId, symbol, amount, datetime) {
        return new Promise((resolve, reject) => {
            winston.info(
                "Adding investment of " +
                    amount +
                    " amount of " +
                    symbol +
                    " for user " +
                    userId +
                    " datetime " +
                    datetime
            );

            Currency.getBySymbol(symbol)
                .then(currency => {
                    winston.debug(currency);
                    mysql.query(
                        "INSERT INTO investments (user_id, currency_id, amount, datetime) VALUES (?, ?, ?, ?)",
                        [userId, currency.currency_id, amount, datetime],
                        (err, rows, fields) => {
                            if (err) {
                                winston.error(
                                    "Error while adding investment. " + err
                                );
                                return reject(err);
                            } else {
                                winston.info("Added investment.");
                                return resolve();
                            }
                        }
                    );
                })
                .catch(err => {
                    winston.error(
                        "Could not find currency for symbol " + symbol
                    );
                });
        });
    },
    delete: function(investmentId, userId) {
        return new Promise((resolve, reject) => {
            winston.info(
                "Deleting investment " + investmentId + " for user " + userId
            );

            mysql.query(
                "DELETE FROM investments WHERE investment_id = ? AND user_id = ?",
                [investmentId, userId],
                (err, rows, fields) => {
                    if (err) {
                        winston.error("Error while deleting an investment");
                    } else {
                        return resolve();
                    }
                }
            );
        });
    },
    getGrowthOverTime: function(userId,currency_id) {
        return new Promise((resolve, reject) => {
            if(!currency_id) currency_id="inv.currency_id";
            mysql.query(
                "SELECT inv.currency_id, cc.symbol, ph.date, ph.price_usd, SUM(inv.amount)*ph.price_usd as sum_value_usd \
                FROM `investments` AS inv \
                LEFT JOIN prices_history AS ph ON ph.currency_id = inv.currency_id \
                LEFT JOIN currencies_cryptocompare as cc ON inv.currency_id = cc.currency_id \
                WHERE inv.user_id = ? AND ph.date>=DATE(inv.datetime) AND inv.currency_id = "+currency_id+" \
                GROUP BY currency_id,ph.date \
                ORDER BY `ph`.`date` ASC",
                [userId],
                (err, rows, fields) => {
                    if (err) return reject(err);

                    var output = {};
                    rows.forEach(row => {
                        if (output[dateFormat(row.date, "isoDate")])
                            output[dateFormat(row.date, "isoDate")] +=
                                row.sum_value_usd;
                        else
                            output[dateFormat(row.date, "isoDate")] =
                                row.sum_value_usd;
                    });
                    return resolve(output);
                }
            );
        });
    }
};
