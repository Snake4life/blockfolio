import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import List, { ListItem, ListItemText } from "material-ui/List";
import Menu, { MenuItem } from "material-ui/Menu";

const styles = theme => ({
    root: {
        width: "100%",
        backgroundColor: theme.palette.background.default
    },
    listItem: {
       paddingLeft: theme.spacing.unit * 3
    }
});

const options = [
    "Cards",
    "Table"
];

class InvestmentsView extends React.Component {
    state = {
        anchorEl: null,
        selectedIndex: 1
    };

    button = undefined;

    handleClickListItem = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleMenuItemClick = (event, index) => {
        this.setState({ selectedIndex: index, anchorEl: null });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;

        return (
            <div className={classes.root}>
                <List className={classes.list}>
                    <ListItem
                        button
                        aria-haspopup="true"
                        aria-controls="investments-view-menu"
                        aria-label="Investments view type"
                        onClick={this.handleClickListItem}
                        className={classes.listItem}
                    >
                        <ListItemText
                            primary="Investments view type"
                            secondary={options[this.state.selectedIndex]}
                        />
                    </ListItem>
                    <ListItem
                        button
                        aria-haspopup="true"
                        aria-controls="lock-menu"
                        aria-label="Currency conversion"
                        onClick={this.handleClickListItem}
                        className={classes.listItem}

                    >
                        <ListItemText
                            primary="Currency conversion"
                            secondary={options[this.state.selectedIndex]}
                        />
                    </ListItem>
                </List>
                <Menu
                    id="investments-view-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    {options.map((option, index) => (
                        <MenuItem
                            key={option}
                            
                            selected={index === this.state.selectedIndex}
                            onClick={event =>
                                this.handleMenuItemClick(event, index)
                            }
                        >
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
                <Menu
                    id="currency-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    {options.map((option, index) => (
                        <MenuItem
                            key={option}
                            
                            selected={index === this.state.selectedIndex}
                            onClick={event =>
                                this.handleMenuItemClick(event, index)
                            }
                        >
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        );
    }
}

InvestmentsView.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InvestmentsView);
