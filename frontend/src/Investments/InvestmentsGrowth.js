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
import Tabs, { Tab } from "material-ui/Tabs";
import Typography from "material-ui/Typography";
import SwipeableViews from "react-swipeable-views";
import AppBar from "material-ui/AppBar";

function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired
};

const styles = theme => ({
    table: {
        minWidth: 700
    },
    root: {
        backgroundColor: theme.palette.background.default,
        width: "100%",
        height: "100%"
    },
    appBar: {
        position: "fixed"
    },
    tabsView: {
        paddingTop: "48px",
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
    lineChart: {
        height:"calc(100vh - 122px)",
        marginTop:"10px"
    }
});

class InvestmentsGrowth extends React.Component {
    handleChange = (event, value) => {
        this.setState({ value });
        //this.props.history.push("/charts/" + this.state.values[value]);
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };
    constructor(props) {
        super(props);
        this.state = {
            investments: [],
            loading: true,
            chartData: {},
            value: 0,
            values: ["7 days", "30 days", "All time", "Custom"]
        };
        this.getInvestments = this.getInvestments.bind(this);
        this.fetchInvestments = this.fetchInvestments.bind(this);
        this.getChartData = this.getChartData.bind(this);
    }
    componentDidMount() {
        this.fetchInvestments();
    }
    fetchInvestments() {
        this.props.setLoading(true);

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
                    data: responseJson
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
    getChartData(days) {
        if (this.state.data)
            return {
                labels: Object.keys(this.state.data)
                    .slice(-days)
                    .map(el => moment(el).format("MM-DD-YY")),
                datasets: [
                    {
                        label: "Total value of investments",
                        data: Object.values(this.state.data).slice(-days),
                        backgroundColor: ["rgba(0, 0, 132, 0.2)"],
                        borderColor: ["rgba(100,100,132,1)"],
                        borderWidth: 1,
                        lineTension: 0,
                        pointStyle: "point",
                        pointRadius: 0
                    }
                ]
            };
        return {};
    }
    getInvestments() {
        return this.state.investments;
    }
    render() {
        const { classes, theme } = this.props;

        return (
            <div className={classes.root}>
                <div>
                    <AppBar
                        position="static"
                        color="default"
                        className={classes.appBar}
                    >
                        <Tabs
                            value={this.state.value}
                            onChange={this.handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            fullWidth
                        >
                            <Tab label="7 days" />
                            <Tab label="30 days" />
                            <Tab label="All time" />
                            <Tab label="Custom" />
                        </Tabs>
                    </AppBar>
                    <div className={classes.tabsView}>
                        {this.state.value==0 ? (
                        <TabContainer dir={theme.direction}>
                            <div className={classes.lineChart}>
                                {this.state.loading ? (
                                    <LoadingMessage withPadding/>
                                ) : (
                                    <InvestmentsLineChart
                                        className={classes.lineChart}
                                        data={this.getChartData(7)}
 
                                    />
                                )}
                            </div>
                        </TabContainer>) : ""}
                        {this.state.value==1 ? (
                        <TabContainer dir={theme.direction}>
                            <div className={classes.lineChart}>
                                {this.state.loading ? (
                                    <LoadingMessage withPadding />
                                ) : (
                                    <InvestmentsLineChart
                                        data={this.getChartData(30)}

                                    />
                                )}
                            </div>
                        </TabContainer>) : ""}
                        {this.state.value==2 ? (
                        <TabContainer dir={theme.direction}>
                            <div className={classes.lineChart}>
                                {this.state.loading ? (
                                    <LoadingMessage withPadding />
                                ) : (
                                    <InvestmentsLineChart
                                        data={this.getChartData(0)}

                                    />
                                )}
                            </div>
                        </TabContainer>) : ""}
                    </div>
                </div>
            </div>
        );
    }
}

InvestmentsGrowth.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(
    withRouter(withCookies(InvestmentsGrowth))
);
