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

    });
}

fetchPrices()
    .then(response => {
        //console.log(response);
    })
    .catch(err => {
        console.error(err);
    });
