import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";

const styles = theme => ({
    root: { padding: theme.spacing.unit * 3 }
});

class NotFound extends React.Component {
    render() {
        const { classes } = this.props;

        return(<div className={classes.root}>
            <Typography type="headline">404</Typography>
            <Typography type="body2">Not found</Typography>
        </div>);
    }
}

NotFound.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles,{withTheme:true})(NotFound);
