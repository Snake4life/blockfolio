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
    },
    pieChart: {
        maxWidth: "600px"
    }
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
            loading: true,
            chartData: {}
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

                var currencies = {};
                var total = 0;

                responseJson.forEach(el => {
                    if (currencies[el.coin_name])
                        currencies[el.coin_name] += el.price_usd * el.amount;
                    else currencies[el.coin_name] = el.price_usd * el.amount;
                    total += el.price_usd * el.amount;
                });

                var data = [];
                var labels = [];
                var backgroundColors = [];

                Object.keys(currencies).forEach(key => {
                    data.push(currencies[key] / total * 100);
                    labels.push(key);
                    backgroundColors.push(dynamicColors());
                });

                this.setState({
                    chartData: {
                        datasets: [
                            {
                                backgroundColor: backgroundColors,
                                data: data
                            }
                        ],
                        labels: labels
                    }
                });
            })
            .catch(err => {
                this.props.setLoading(false);
                console.error("Unable to fetch investments. " + err); // show error message
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
                    <LoadingMessage />
                ) : (
                    <div>
                        <InvestmentsTable data={this.getInvestments()} />
                        <h2>
                            Total value of investments:{" "}
                            {currencyFormatter("USD").format(
                                this.calculateTotal()
                            )}{" "}
                            ({currencyFormatter("PLN").format(
                                this.calculateTotal() * 3.45
                            )})
                        </h2>

                        <div className={classes.pieChart}>
                            <InvestmentsPieChart data={this.state.chartData} />
                        </div>

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
                )}
            </div>
        );
    }
}

Investments.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(withCookies(Investments)));
