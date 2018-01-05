import React from "react";
import InvestmentsTable from "./InvestmentsTable";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import AddIcon from "material-ui-icons/Add";
import { withRouter, Link } from "react-router-dom";
import { Route, Switch } from "react-router";
import { withCookies } from "react-cookie";
import currencyFormatter from "../currencyFormatter";
import { LinearProgress } from "material-ui/Progress";

const styles = () => ({
    table: {
        minWidth: 700
    },
    button: {
        margin: 0,
        top: "auto",
        right: 20,
        bottom: 20,
        left: "auto",
        position: "fixed"
    }
});

class Investments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            investments: [],
            loading: true
        };
        this.getInvestments = this.getInvestments.bind(this);
        this.getInvestmentById = this.getInvestmentById.bind(this);
        this.fetchInvestments = this.fetchInvestments.bind(this);
    }
    componentDidMount() {
        if (!this.props.isSignedIn())
            return this.props.history.push("/profile/signIn");
        this.fetchInvestments();
    }
    // TODO pass this function as props

    fetchInvestments() {
        this.props.setLoading(true);
        fetch("/api/investments", {
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
                this.setState({ investments: responseJson, loading: false });
            })
            .catch(err => {
                this.props.setLoading(false);
                console.error("Unable to fetch investments"); // show error message
            });
    }
    getInvestments() {
        return this.state.investments;
    }
    getInvestmentById(id) {
        const investments = this.state.investments.filter(
            investment => investment.id === id
        );
        if (investments.length > 0) return investments[0];
    }
    calculateTotal() {
        var total = Object.keys(this.state.investments)
            .map(
                (key, index) =>
                    this.state.investments[key].price_usd *
                    this.state.investments[key].amount
            )
            .reduce((total, num) => total + num, 0);
        return total;
    }
    render() {
        const { classes } = this.props;

        

        return (
            <div className={classes.root}>
                {this.state.loading ? (
                    ""
                ) : (
                    <InvestmentsTable data={this.getInvestments()} />
                )}

                <h2>
                    Total value of investments:{" "}
                    {currencyFormatter("USD").format(this.calculateTotal())} ({currencyFormatter(
                        "PLN"
                    ).format(this.calculateTotal() * 3.45)})
                </h2>
                <Button
                    fab
                    color="primary"
                    aria-label="add"
                    className={classes.button}
                    component={Link}
                    to="/investments/add"
                >
                    <AddIcon />
                </Button>
            </div>
        );
    }
}

Investments.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(withCookies(Investments)));
