import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import DashboardIcon from "material-ui-icons/Dashboard";
import InvestmentsIcon from "material-ui-icons/AccountBalance";

const styles = theme => ({
    root: {
        width: "100%",
        maxWidth: 360,
        background: theme.palette.background.paper
    }
});

function SimpleList(props) {
    const { classes } = props;
    return (
        <div className={classes.root}>
            <List>
                <ListItem button>
                    <DashboardIcon/> <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button>
                    <InvestmentsIcon/> <ListItemText primary="My investments" />
                </ListItem>
            </List>
        </div>
    );
}

SimpleList.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleList);
