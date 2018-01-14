import React from "react";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import { CircularProgress } from 'material-ui/Progress';

const styles = theme => ({});

class LoadingMessage extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <CircularProgress className={classes.progress} />
        );
    }
}

export default withStyles(styles, { withTheme: true })(LoadingMessage);
