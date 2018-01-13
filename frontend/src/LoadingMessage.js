import React from "react";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";

const styles = theme => ({});

class LoadingMessage extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <Typography type="body1" gutterBottom>
                Please wait while we load stuff...
            </Typography>
        );
    }
}

export default withStyles(styles, { withTheme: true })(LoadingMessage);
