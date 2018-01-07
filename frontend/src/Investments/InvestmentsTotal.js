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
import InvestmentsLineChart from "./InvestmentsLineChart";

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
        
    },
    lineChart: {}
});

var dynamicColors = function() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
};

class InvestmentsTotal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            investments: [],
            loading: true,
            chartData: {},
            lineChartDataLoading: true
        };
        this.getInvestments = this.getInvestments.bind(this);
        this.fetchInvestments = this.fetchInvestments.bind(this);
    }
    componentDidMount() {
        if (!this.props.isSignedIn())
            return this.props.history.push("/profile/signIn");
        this.fetchInvestments();
    }
    fetchInvestments() {
        this.props.setLoading(true);
        fetch("/api/investments/total", {
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

                var currencies = {};
                var total = 0;
                responseJson.forEach(el => {
                    currencies[el.coin_name] = el.sum_usd;

                    total += el.sum_usd;
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
                    loading:false,
                    total: total,
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
                console.err(err);
            });
    }
    getInvestments() {
        return this.state.investments;
    }
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                {this.state.loading ? (
                    <LoadingMessage />
                ) : (
                    <div>
                        <h2>
                            Total current value of investments:{" "}
                            {currencyFormatter("USD").format(this.state.total)}{" "}
                            ({currencyFormatter("PLN").format(
                                this.state.total * 3.45
                            )})
                        </h2>
                        <div className={classes.pieChart}>
                            <InvestmentsPieChart data={this.state.chartData} />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

InvestmentsTotal.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(withCookies(InvestmentsTotal)));
