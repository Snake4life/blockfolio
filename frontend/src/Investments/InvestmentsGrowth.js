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
import InvestmentsLineChart from "./InvestmentsLineChart";
import moment from "moment";

const styles = (theme) => ({
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

class InvestmentsGrowth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            investments: [],
            loading: true,
            chartData: {}
        };
        this.getInvestments = this.getInvestments.bind(this);
        this.fetchInvestments = this.fetchInvestments.bind(this);
    }
    componentDidMount() {
        this.fetchInvestments();
    }
    fetchInvestments() {
        this.props.setLoading(true);
        console.log(this.props.match.params.symbol);
        console.log(this.props.match.params.dateFrom);
        if (this.props.match.params.symbol)
            var url =
                "/api/investments/growth/currency/" +
                this.props.match.params.symbol;
        else var url = "/api/investments/growth";
        fetch(url, {
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
                this.setState({ loading: false });
                this.setState({
                    lineChartData: {
                        labels: Object.keys(responseJson).map(el=>moment(el).format("MM-DD-YY")),
                        datasets: [
                            {
                                label: "Total value of investments",
                                data: Object.values(responseJson),
                                backgroundColor: ["rgba(0, 0, 132, 0.2)"],
                                borderColor: ["rgba(100,100,132,1)"],
                                borderWidth: 1,
                                lineTension: 0,
                                pointStyle: "cross",
                                pointRadius: 0
                            }
                        ]
                    }
                });

            })
            .catch(res => {
                if (res.status == 401) this.props.signOut();
                else
                    console.error(
                        "Unable to load investments data. " + res.error
                    );
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
                        
                        <div className={classes.lineChart}>
                            <InvestmentsLineChart
                                data={this.state.lineChartData}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

InvestmentsGrowth.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles, {withTheme:true})(withRouter(withCookies(InvestmentsGrowth)));
