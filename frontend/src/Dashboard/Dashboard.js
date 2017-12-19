import React from "react";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import Typography from "material-ui/Typography";
import SimpleCard from "./SimpleCard";

const styles = theme => ({
    root: {},
});

class Dashboard extends React.Component {
    render() {
        const { classes, theme } = this.props;

        return (
            <div className={classes.root}>
                    <SimpleCard  style={{ display: 'flex' }}/>
                    <SimpleCard  style={{ display: 'flex' }}/>
            </div>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Dashboard);
