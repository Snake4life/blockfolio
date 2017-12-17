import React from "react";
import BasicTable from "./BasicTable";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import AddIcon from "material-ui-icons/Add";

const styles = theme => ({
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
    }
});

class Investments extends React.Component {
    render() {
        const { classes, theme } = this.props;
        return (
            <div>
                <BasicTable />
                <Button
                    fab
                    color="primary"
                    aria-label="add"
                    className={classes.button}
                >
                    <AddIcon />
                </Button>
            </div>
        );
    }
}

Investments.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Investments);
