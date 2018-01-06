var mysql = require("mysql");
var config = require("../config");
var request = require("request");

var connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    port: 3306
});

// fetches currency data from cryptocurrency API and returns an array
function fetchAll() {
    return new Promise((resolve, reject) => {
        console.log("Fetching currencies from cryptocompare API...");

        request("https://min-api.cryptocompare.com/data/all/coinlist", function(
            error,
            response,
            body
        ) {
            try {
                var data = JSON.parse(body).Data;
                var coins = [];

                Object.keys(data).forEach(function(key) {
                    coins.push(data[key]);
                });

                resolve(coins);
                return;
            } catch (err) {
                console.error(err);
                reject(err);
                return;
            }
        });
    });
}

function fetchPrices() {
    return new Promise((resolve, reject) => {
        console.log("Fetching prices from cryptocompare API...");

        var fsyms = [];

        connection.query(
            "SELECT symbol FROM currencies_cryptocompare WHERE 1",
            (err, rows, fields) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                for (el in rows) {
                    fsyms.push(rows[el].symbol);
                }

                for (var i = 0; i < fsyms.length; i += 50) {
                    let fsymsSlice = fsyms.slice(i, i + 50);

                    var url =
                        "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" +
                        fsymsSlice.join() +
                        "&tsyms=USD,EUR,BTC";

                    console.log(
                        "fetching prices from " + i + " to " + (i + 50)
                    );

                    request(url, function(error, response, body) {
                        try {
                            if (error) throw err;
                            var data = JSON.parse(body);
                            for (el in data) {
                                console.log("Updating price for " + el);

                                connection.query(
                                    "UPDATE currencies_cryptocompare SET price_usd = ?, price_eur = ?, price_btc = ?, price_last_updated=CURRENT_TIMESTAMP WHERE symbol = ?",
                                    [
                                        data[el].USD,
                                        data[el].EUR,
                                        data[el].BTC,
                                        el
                                    ]
                                );
                            }

                            resolve();
                        } catch (err) {
                            console.error(err);
                        }
                    });
                }
            }
        );

        /*
*/
    });
}

/*fetchAll()
    .then(response => {
        connection.beginTransaction(function(err) {
            if (err) {
                throw err;
            }

            for (el in response) {
                let id = response[el].Id;
                let url = response[el].Url;
                let image_url = response[el].ImageUrl;
                let name = response[el].Name;
                let symbol = response[el].Symbol;
                let coin_name = response[el].CoinName;
                let full_name = response[el].FullName;
                let algorithm = response[el].Algorithm;
                let proof_type = response[el].ProofType;
                let fully_premined = response[el].FullyPremined;
                let total_coin_supply = response[el].TotalCoinSupply;
                let premined_value = response[el].PreMinedValue;
                let total_coins_free_float = response[el].TotalCoinsFreeFloat;
                let sort_order = response[el].SortOrder;
                let sponsored = response[el].Sponsored;

                connection.query(
                    "INSERT IGNORE INTO currencies_cryptocompare (currency_id, url, image_url, name, symbol, coin_name, full_name, \
                    algorithm, proof_type, fully_premined, total_coin_supply, premined_value, total_coins_free_float, sort_order, sponsored) \
                    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        id,
                        url,
                        image_url,
                        name,
                        symbol,
                        coin_name,
                        full_name,
                        algorithm,
                        proof_type,
                        fully_premined,
                        total_coin_supply,
                        premined_value,
                        total_coins_free_float,
                        sort_order,
                        sponsored
                    ],
                    (err, rows, fields) => {
                        if (err) {
                            return connection.rollback(function() {
                                throw err;
                            });
                        }
                        console.log("Added " + name + " to the transaction.");
                    }
                );
            }

            connection.commit(function(err) {
                if (err) {
                    return connection.rollback(function() {
                        throw err;
                    });
                }
                console.log("success!");
                connection.end();
            });
        });
    })
    .catch(err => {
        console.error(err);
    });
*/

fetchPrices()
    .then(response => {
        //console.log(response);
    })
    .catch(err => {
        console.error(err);
    });
