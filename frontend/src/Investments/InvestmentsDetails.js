import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { withRouter, Link } from "react-router-dom";
import { Route, Switch } from "react-router";
import EditIcon from "material-ui-icons/Edit";
import Button from "material-ui/Button";
import currencyFormatter from "../currencyFormatter";
import { LinearProgress } from "material-ui/Progress";
import dateformat from "dateformat";
import InvestmentsDetailsTable from "./InvestmentsDetailsTable";
import InvestmentChart from "./InvestmentChart";
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

class InvestmentsDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            investments: []
        };
    }
    componentDidMount() {
        this.fetchInvestment();
    }
    fetchInvestment() {
        this.props.setLoading(true);
        fetch(
            "/api/investments/details/" + this.props.match.params.currencyId,
            {
                credentials: "same-origin",
                headers: {
                    "Cache-Control": "no-cache"
                }
            }
        )
            .then(res => {
                if (!res.ok) throw Error(res.status);
                return res.json();
            })
            .then(responseJson => {
                this.props.setLoading(false);
                this.setState({ investments: responseJson });
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
                        <h2>{this.props.match.params.currencyId}</h2>
                        <p>Trades: {this.state.investments.length}</p>
                        <InvestmentsDetailsTable
                            data={this.state.investments}
                        />
                        <InvestmentChart />
                    </div>
                )}
            </div>
        );
    }
}

InvestmentsDetails.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(InvestmentsDetails));
