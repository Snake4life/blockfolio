import React from "react";
import InvestmentsTable from "./InvestmentsTable";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import AddIcon from "material-ui-icons/Add";
import { withRouter, Link } from "react-router-dom";
import { withCookies } from "react-cookie";
import currencyFormatter from "../currencyFormatter";
import LoadingMessage from "../LoadingMessage";
import InvestmentsPieChart from "./InvestmentsPieChart";

import InvestmentsList from "./InvestmentsList";

const styles = theme => ({
    root: {
        width: "100%",
        padding: theme.spacing.unit * 3
    },
    button: {
        margin: 0,
        top: "auto",
        right: 20,
        bottom: 20,
        left: "auto",
        position: "fixed"
    },

});

var dynamicColors = function() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
};

class Investments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            investments: [],
            chartData: {}
        };
        this.getInvestmentById = this.getInvestmentById.bind(this);
        this.fetchInvestments = this.fetchInvestments.bind(this);
    }
    componentDidMount() {
        this.fetchInvestments();
    }
    fetchInvestments() {
        this.props.setLoading(true);

        fetch("/api/investments", {
            credentials: "same-origin",
            headers: {
                "Cache-Control": "no-cache"
            }
        })
            .then(res => {
                if (res.ok) return res.json();
                else throw res;
            })
            .then(responseJson => {
                this.props.setLoading(false);
                this.setState({
                    investments: responseJson.reverse(),
                });
            })
            .catch(res => {
                if (res.status == 401) this.props.signOut();
                else console.error("Unable to fetch investments. " + res.error); // show error message
            });
    }
    getInvestmentById(id) {
        const investments = this.state.investments.filter(
            investment => investment.id === id
        );
        if (investments.length > 0) return investments[0];
    }
    render() {
        const { classes } = this.props;

        if (this.props.isLoading())
            return (
                <div className={classes.root}>
                    <LoadingMessage />
                </div>
            );
        else return <InvestmentsTable data={this.state.investments} />;
    }
}

Investments.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(
    withRouter(withCookies(Investments))
);
