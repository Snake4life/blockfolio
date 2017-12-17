import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import DashboardIcon from "material-ui-icons/Dashboard";
import InvestmentsIcon from "material-ui-icons/AccountBalance";
import { withRouter } from "react-router-dom";

const styles = theme => ({
    root: {
        width: "100%",
        maxWidth: 360,
        background: theme.palette.background.paper
    }
});

class SimpleList extends React.Component {
    constructor(props) {
        super(props);
        this.handleDashboardClick = this.handleDashboardClick.bind(this);
        this.handleInvestmentsClick = this.handleInvestmentsClick.bind(this);
    };
    handleDashboardClick() {
        this.props.history.push("/");
    };
    handleInvestmentsClick() {
        this.props.history.push("/investments");
    };
    render() {
    const { classes } = this.props;
    return (
        <div className={classes.root}>
            <List>
                <ListItem button onClick={this.handleDashboardClick}>
                    <DashboardIcon/> <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button onClick={this.handleInvestmentsClick}>
                    <InvestmentsIcon/> <ListItemText primary="My investments" />
                </ListItem>
            </List>
        </div>
    );
    }
}

SimpleList.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(SimpleList));
