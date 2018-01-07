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
        maxWidth: "600px"
    },
    lineChart: {}
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
            chartData: {},
            lineChartDataLoading: true
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
    fetchInvestments() {
        this.props.setLoading(true);

        var api1 = fetch("/api/investments", {
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

                this.setState({ investments: responseJson, loading: false });
            })
            .catch(err => {
                console.error("Unable to fetch investments. " + err); // show error message
            });

        var api2 = fetch("/api/investments/growth", {
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
                this.setState({ lineChartDataLoading: false });
                console.log(responseJson);
                this.setState({
                    lineChartData: {
                        labels: Object.keys(responseJson),
                        datasets: [
                            {
                                data: Object.values(responseJson)
                            }
                        ]
                    }
                });

                console.log(this.state.lineChartData);
            })
            .catch(err => {
                console.err(err);
            });

        var api3 = fetch("/api/investments/total", {
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
                //console.log(responseJson);
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
                console.err(err);
            });

        Promise.all([api1, api2, api3])
            .then(responses => {
                this.props.setLoading(false);
            })
            .catch(err => {
                this.props.setLoading(false);
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
                            Total current value of investments:{" "}
                            {currencyFormatter("USD").format(this.state.total)}{" "}
                            ({currencyFormatter("PLN").format(
                                this.state.total * 3.45
                            )})
                        </h2>

                        <div className={classes.pieChart}>
                            <InvestmentsPieChart data={this.state.chartData} />
                        </div>
                        <h2>Growth of value over time</h2>
                        <div className={classes.lineChart}>
                            {this.state.lineChartDataLoading ? (
                                "Line chart data here"
                            ) : (
                                <InvestmentsLineChart
                                    data={this.state.lineChartData}
                                />
                            )}
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
