import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import humanDate from "human-date";
import currencyFormatter from "../currencyFormatter";
import { LinearProgress } from "material-ui/Progress";

const styles = () => ({
    root: {}
});

class CurrencyDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: {},
            loading: true
        };
    }
    componentDidMount() {
        this.fetchCurrency();
    }
    fetchCurrency() {
        fetch("/api/currencies/" + this.props.match.params.currencyId, {
            credentials: "same-origin",
            headers: {
                "Cache-Control": "no-cache"
            }
        })
            .then(res => {
                if (!res.ok) throw Error(res.status);
                return res.json();
            })
            .then(responseJson => {
                this.setState({ currency: responseJson, loading: false });
            })
            .catch(err => {
                console.error("Unable to fetch currency details"); // show error message
            });
    }
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                {this.state.loading ? <LinearProgress /> : ""}
                <h2>{this.state.currency.name}</h2>
                Last updated:{" "}
                {humanDate.relativeTime(
                    new Date(this.state.currency.last_updated * 1000)
                )}
                <p>Rank: {this.state.currency.rank}</p>
                <p>Price: {currencyFormatter("USD").format(this.state.currency.price_usd)}</p>
                <p>Market cap: {currencyFormatter("USD").format(this.state.currency.market_cap_usd)}</p>
                <p>24h Volume: {currencyFormatter("USD").format(this.state.currency['24h_volume_usd'])}</p>
            </div>
        );
    }
}

CurrencyDetails.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(CurrencyDetails));
