import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ResponsiveDrawer from "./ResponsiveDrawer";
import "./App.css";
import { withRouter } from "react-router-dom";

import { createMuiTheme } from "material-ui/styles";
import blue from "material-ui/colors/blue";
import orange from "material-ui/colors/orange";

const theme = createMuiTheme({
    palette: {
        primary: orange,
        secondary: blue
    }
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currencies: [],
            investments: [
                {
                    id: "bitcoin",
                    name: "Bitcoin",
                    amount: 0.19
                },
                {
                    id: "ethereum",
                    name: "Ethereum",
                    amount: 46
                }
            ]
        };
        this.getCurrencies = this.getCurrencies.bind(this);
        this.getInvestments = this.getInvestments.bind(this);
        this.getCurrencyPriceById = this.getCurrencyPriceById.bind(this);
        this.addInvestment = this.addInvestment.bind(this);
    }
    componentDidMount() {
        this.fetchCurrencies();
    }
    fetchCurrencies() {
        fetch("/api/currencies")
            .then(res => {
                if (!res.ok) throw Error(res.statusText);
                return res.json();
            })
            .then(responseJson => {
                this.setState({ currencies: responseJson });
            });
    }
    getCurrencies() {
        return this.state.currencies;
    }

    getInvestments() {
        return this.state.investments;
    }
    addInvestment(currencyId, amount) {
        this.state.investments.push({id:currencyId, amount:amount});
    };
    getCurrencyPriceById(id) {
        const currency = this.state.currencies.filter(currency => currency.id == id);
        console.log(currency);
        if(currency.length>0) return currency[0].price_usd;
    }
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div className="App">
                    <ResponsiveDrawer
                        getCurrencies={this.getCurrencies}
                        getInvestments={this.getInvestments}
                        getCurrencyPriceById={this.getCurrencyPriceById}
                        addInvestment={this.addInvestment}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withRouter(App);
