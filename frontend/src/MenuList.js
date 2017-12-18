import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import DashboardIcon from "material-ui-icons/Dashboard";
import InvestmentsIcon from "material-ui-icons/AccountBalance";
import MoneyIcon from "material-ui-icons/AttachMoney";
import { withRouter, Link} from "react-router-dom";

const styles = theme => ({
    root: {
        width: "100%",
        maxWidth: 360,
        height: "100%",
        background: theme.palette.background.paper
    },
    list: {
        height: "100%"
    }
});

class MenuList extends React.Component {
    handleMenuItemClick() {
        this.props.onRequestClose();
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <List
                    className={classes.list}
                    onClick={this.handleMenuItemClick.bind(this)}
                >
                    <ListItem button  component={Link} to="/">
                        <DashboardIcon /> <ListItemText primary="Dashboard" />
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
    }
}

MenuList.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(MenuList));
