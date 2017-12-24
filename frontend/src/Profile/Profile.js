import React from "react";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import { withCookies } from "react-cookie";

const styles = theme => ({
    root: {},
});

class Profile extends React.Component {
    constructor(props) {
        super(props);
        const { cookies } = this.props;
        var session = cookies.get("session");
    }
    render() {
        const { classes, theme } = this.props;

        return (
            <div className={classes.root}>
                    Your profile here
            </div>
        );
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(withCookies(Profile));
