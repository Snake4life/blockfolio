import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router-dom";
import CurrenciesTable from "./CurrenciesTable";
import LoadingMessage from "../LoadingMessage";

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
        this.fetchCurrencies();
    }
    getCurrencies() {
        return this.state.currencies;
    }
    fetchCurrencies() {
        this.props.setLoading(true);
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
                this.props.setLoading(false);
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
                    <LoadingMessage/>
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
