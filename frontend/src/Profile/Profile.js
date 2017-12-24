import React from "react";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import { withCookies } from "react-cookie";
import { withRouter, Link } from "react-router-dom";
import Button from "material-ui/Button";

const styles = theme => ({
    root: {},
});

class Profile extends React.Component {
    constructor(props) {
        super(props);
        const { cookies } = this.props;
        var session = cookies.get("session");
        this.state = {
            user: {}
        }
        this.fetchUserData = this.fetchUserData.bind(this);
        this.signOut = this.signOut.bind(this);
    }
    fetchUserData() {
        fetch("/api/profile", {
            credentials: "same-origin"
        })
            .then(response => {
                if (response.ok) return response;
                else throw "There was an error " + response.error;
            })
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
            })
            .catch(err => {
                console.error(err);
            });
    }
    componentDidMount() {
        this.fetchUserData();
    }
    signOut() {
        const { cookies } = this.props;
        cookies.remove("session");
        this.props.history.push("/profile/signIn");
    }
    render() {
        const { classes, theme } = this.props;

        return (
            <div className={classes.root}>
                    Your profile here
                    <Button onClick={this.signOut}>
                    Sign out </Button>
            </div>
        );
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(withCookies(withRouter(Profile)));
