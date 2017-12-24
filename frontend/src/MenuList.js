import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import DashboardIcon from "material-ui-icons/Dashboard";
import InvestmentsIcon from "material-ui-icons/AccountBalance";
import MoneyIcon from "material-ui-icons/AttachMoney";
import AccountIcon from "material-ui-icons/AccountBox";
import { withRouter, Link } from "react-router-dom";
import { withCookies } from "react-cookie";

const styles = theme => ({
    root: {
        width: "100%",
        maxWidth: 360,
        height: "100%",
        background: theme.palette.background.paper
    }
});

class MenuList extends React.Component {
    handleMenuItemClick() {
        this.props.onRequestClose();
        this.isSignedIn = this.isSignedIn.bind(this);
    }
    isSignedIn() {
        const { cookies } = this.props;
        if (cookies.get("session") != undefined) {
            return true;
        }
    }
    render() {
        const { classes } = this.props;
        if (this.isSignedIn()) {
            return (
                <div className={classes.root}>
                    <List
                        className={classes.list}
                        onClick={this.handleMenuItemClick.bind(this)}
                    >
                        <ListItem button component={Link} to="/">
                            <AccountIcon /> <ListItemText primary="Profile" />
                        </ListItem>
                        <ListItem button component={Link} to="/currencies">
                            <MoneyIcon /> <ListItemText primary="Currencies" />
                        </ListItem>
                        <ListItem button component={Link} to="/investments">
                            <InvestmentsIcon />{" "}
                            <ListItemText primary="My investments" />
                        </ListItem>
                    </List>
                </div>
            );
        } else
            return (
                <div className={classes.root}>
                    <List
                        className={classes.list}
                        onClick={this.handleMenuItemClick.bind(this)}
                    >
                        <ListItem button component={Link} to="/profile/signin">
                            <AccountIcon /> <ListItemText primary="Sign in" />
                        </ListItem>
                    </List>
                </div>
            );
    }
}

MenuList.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(withCookies(MenuList)));
