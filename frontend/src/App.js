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
                    id: 0,
                    name: "BTC",
                    amount: 0.19
                },
                {
                    id: 1,
                    name: "ETH",
                    amount: 46
                }
            ]
        };
        this.getCurrencies = this.getCurrencies.bind(this);
        this.getInvestments = this.getInvestments.bind(this);
        this.getCurrencyPrice = this.getCurrencyPrice.bind(this);
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
    addInvestment(cryptocurrency, amount) {
        this.state.investments.push({name:cryptocurrency, amount:amount});
    };
    getCurrencyPrice(coin) {
        if(coin=="ETH") return 670;
        if(coin=="BTC") return 18000;
        if(coin=="XMR") return 300;
    }
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div className="App">
                    <ResponsiveDrawer
                        getCurrencies={this.getCurrencies}
                        getInvestments={this.getInvestments}
                        getCurrencyPrice={this.getCurrencyPrice}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withRouter(App);
