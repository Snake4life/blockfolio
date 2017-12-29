import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import CurrenciesTable from "./CurrenciesTable";
import CurrencyDetails from "./CurrencyDetails";
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

        const Details = props => {
            return (
                <CurrencyDetails currencyId={props.match.params.currencyId} />
            );
        };

        return (
            <Switch>
                <Route exact path="/currencies">
                    <div className={classes.root}>
                        {this.state.loading ? (
                            <LinearProgress />
                        ) : (
                            <CurrenciesTable data={this.getCurrencies()} />
                        )}
                    </div>
                </Route>
                <Route
                    path="/currencies/details/:currencyId"
                    component={Details}
                />
            </Switch>
        );
    }
}

Currencies.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(Currencies));
