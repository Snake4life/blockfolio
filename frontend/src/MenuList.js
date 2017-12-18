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
        height: "100%",
        background: theme.palette.background.paper
    },
    list: {
        height:"100%"
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
        this.props.onRequestClose();
    };
    handleInvestmentsClick() {
        this.props.history.push("/investments");
        this.props.onRequestClose();
    };
    render() {
    const { classes } = this.props;
    return (
        <div className={classes.root}>
            <List className={classes.list}>
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
