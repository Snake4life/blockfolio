import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router-dom";
import InvestmentsCurrencyTable from "./InvestmentsCurrencyTable";
import LoadingMessage from "../LoadingMessage";

const styles = () => ({
    root: {},
    button: {
        margin: 0,
        top: "auto",
        right: 20,
        bottom: 20,
        left: "auto",
        position: "fixed"
    }
});

class InvestmentsCurrency extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: {},
            investments: []
        };
    }
    componentDidMount() {
        this.fetchInvestment();
    }
    fetchInvestment() {
        this.props.setLoading(true);
        fetch("/api/investments/currency/" + this.props.match.params.symbol, {
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
                this.props.setLoading(false);
                this.setState({
                    investments: responseJson.investments,
                    currency: responseJson.currency
                });
            })
            .catch(err => {
                this.props.setLoading(false);
                console.error(err);
            });
    }
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                {this.props.isLoading() ? (
                    <LoadingMessage />
                ) : (
                    <div>
                        <h2>{this.state.currency.name}</h2>
                        <p>Trades: {this.state.investments.length}</p>
                        <InvestmentsCurrencyTable
                            data={this.state.investments}
                        />
                    </div>
                )}
            </div>
        );
    }
}

InvestmentsCurrency.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(InvestmentsCurrency));
