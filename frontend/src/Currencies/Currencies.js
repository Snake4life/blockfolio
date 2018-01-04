import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import CurrenciesTable from "./CurrenciesTable";

import { LinearProgress } from "material-ui/Progress";

const styles = () => ({
    root: {}
});

class Currencies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currencies: [],
            loading: true
        };
        this.getCurrencies = this.getCurrencies.bind(this);
        this.fetchCurrencies = this.fetchCurrencies.bind(this);
    }
    componentDidMount() {
        if (!this.props.isSignedIn())
            return this.props.history.push("/profile/signIn");
        this.fetchCurrencies();
    }
    getCurrencies() {
        return this.state.currencies;
    }
    fetchCurrencies() {
        fetch("/api/currencies/list", {
            credentials: "same-origin",
            headers: {
                "Cache-Control": "no-cache"
            }
        })
            .then(res => {
                if (!res.ok) throw Error(res.statusText);
                return res.json();
            })
            .then(responseJson => {
                this.setState({ currencies: responseJson, loading: false });
            })
            .catch(e => {
                console.error(
                    "Unable to fetch currencies from the server: " + e
                );
            });
    }
    render() {
        const { classes } = this.props;



        return (
            <div className={classes.root}>
                {this.state.loading ? (
                    <LinearProgress />
                ) : (
                    <CurrenciesTable data={this.getCurrencies()} />
                )}
            </div>
        );
    }
}

Currencies.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(Currencies));
