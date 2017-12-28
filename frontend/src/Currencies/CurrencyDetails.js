 import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import humanDate from "human-date";

const styles = () => ({
    root: {}
});

class CurrencyDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: {}
        };
    }
    componentDidMount() {
        this.fetchCurrency();
    }
   fetchCurrency() {
        fetch("/api/currencies/"+this.props.currencyId, { credentials: "same-origin" })
            .then(res => {
                if (!res.ok) throw Error(res.status);
                return res.json();
            })
            .then(responseJson => {
                this.setState({ currency: responseJson });
            })
            .catch(err => {
                console.error("Unable to fetch currencies"); // show error message
            });
    }
    render() {
        const { classes } = this.props;

        return (
            <Switch>
                <Route path="/currencies/:currencyId">
                    <div className={classes.root}>
                        <h2>{this.state.currency.name}</h2>
                        Last updated: {humanDate.relativeTime(new Date(this.state.currency.last_updated*1000))}
                    </div>
                </Route>
            </Switch>
        );
    }
}

CurrencyDetails.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(CurrencyDetails));

