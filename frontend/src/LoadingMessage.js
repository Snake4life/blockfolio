import React from "react";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import { CircularProgress } from 'material-ui/Progress';

const styles = theme => ({
    padding: {
        padding: theme.spacing.unit*3
    }
});

class LoadingMessage extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <CircularProgress className={classes.progress} className={this.props.withPadding ? classes.padding : ""}/>
        );
    }
}

export default withStyles(styles, { withTheme: true })(LoadingMessage);
