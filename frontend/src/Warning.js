import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import WarningIcon from "material-ui-icons/Warning";

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        background:theme.palette.warning[200],
    })
});

function Warning(props) {
    const { classes, theme } = props;
    return (
        <div>
            <Paper className={classes.root} elevation={4}>
                <Typography component="p">
                    {" "}
                    {props.message}
                </Typography>
            </Paper>
        </div>
    );
}

Warning.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles, {withTheme:true})(Warning);
