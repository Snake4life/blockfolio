import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import SwipeableViews from "react-swipeable-views";
import AppBar from "material-ui/AppBar";
import Tabs, { Tab } from "material-ui/Tabs";
import Typography from "material-ui/Typography";
import PieChartIcon from "material-ui-icons/PieChart";
import ShowChartIcon from "material-ui-icons/ShowChart";
import InvestmentsGrowth from "../Investments/InvestmentsGrowth";
import InvestmentsTotal from "../Investments/InvestmentsTotal";
import { withRouter } from "react-router-dom";

function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired
};

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
        width: "100%",
        height: "100%",
        
    },
    appBar: {
        position:"fixed"
    },
    swipeableViews: {
        paddingTop:"48px"
    }
});

class ChartsTabs extends React.Component {
    state = {
        value: 0,
        values: ["total", "growth"]
    };

    handleChange = (event, value) => {
        this.setState({ value });
        this.props.history.push("/charts/" + this.state.values[value]);
    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };
    componentDidMount() {
        if (this.props.match.params.tab)
            this.setState({ value: this.state.values.findIndex(el=>el==this.props.match.params.tab) });
    }
    render() {
        const { classes, theme } = this.props;
        const styles = {
            display: "flex",
            width: "100%"
        };
        return (
            <div className={classes.root}>
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
                        <Tab
                            label="Totals"
                            
                            
                        />
                        <Tab
                            label="Growth"
                            
                            
                        />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    className={classes.swipeableViews}
                    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                    index={this.state.value}
                    onChangeIndex={this.handleChangeIndex}
                >
                    <TabContainer dir={theme.direction}>
                        <InvestmentsTotal setLoading={this.props.setLoading} />
                    </TabContainer>
                    <TabContainer dir={theme.direction}>
                        <InvestmentsGrowth setLoading={this.props.setLoading} />
                    </TabContainer>
                </SwipeableViews>
            </div>
        );
    }
}

ChartsTabs.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(withRouter(ChartsTabs));
