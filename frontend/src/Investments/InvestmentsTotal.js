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
import Typography from "material-ui/Typography";

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
    pieChart: {},
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
                if (res.ok) return res.json();
                else throw res;
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
                    loading: false,
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
            .catch(res => {
                this.props.setLoading(false);
                if (res.status == 401) this.props.signOut();
                else console.error("Unable to fetch data. " + res.error);
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
                        <Typography type="headline">
                            
                            {currencyFormatter("USD").format(this.state.total)}{" "}
                            ({currencyFormatter("PLN").format(
                                this.state.total * 3.51
                            )})
                        </Typography>

                        <div>{this.state.currencies}</div>
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
