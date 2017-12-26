import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import CurrenciesTable from "./CurrenciesTable";

const styles = () => ({
    root: {

    }
});

class Currencies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currencies: []
        };
        this.getCurrencies = this.getCurrencies.bind(this);
    }
    componentDidMount() {
        if(!this.props.isSignedIn()) return this.props.history.push("/profile/signIn");
        this.fetchCurrencies();
    }
    getCurrencies() {
        return this.state.currencies;
    }
    fetchCurrencies() {
        fetch("/api/currencies", {credentials:"same-origin"})
            .then(res => {
                if (!res.ok) throw Error(res.statusText);
                return res.json();
            })
            .then(responseJson => {
                this.setState({ currencies: responseJson });
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
            <Switch>
                <Route exact path="/currencies">
                    <div className={classes.root}>
                        <CurrenciesTable data={this.getCurrencies()} />
                    </div>
                </Route>
            </Switch>
        );
    }
}

Currencies.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(Currencies));
