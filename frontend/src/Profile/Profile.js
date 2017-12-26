import React from "react";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import Button from "material-ui/Button";

const styles = () => ({
    root: {}
});

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                username: ""
            }
        };
        this.fetchUserData = this.fetchUserData.bind(this);
        this.signOut = this.signOut.bind(this);
    }
    fetchUserData() {
        fetch("/api/profile", {
            credentials: "same-origin"
        })
            .then(response => {
                if (response.ok) return response;
                else throw new Error(response.error);
            })
            .then(response => response.json())
            .then(responseJson => {
                this.setState({ user: responseJson });
            })
            .catch(err => {
                console.error(err);
            });
    }
    componentDidMount() {
        if (!this.props.isSignedIn())
            return this.props.history.push("/profile/signIn");
        this.fetchUserData();
    }
    signOut() {
        fetch("/api/auth/signOut", {
            credentials: "same-origin"
        })
            .then(response => {
                if (response.ok) return response;
                else throw new Error(response.error);
            })
            .then(response => {
                const { cookies } = this.props;
                cookies.remove("session");
                this.props.history.push("/profile/signIn");
            })
            .catch(err => {
                console.error(err);
            });

        // remove cookies
    }
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                Your profile here<br />
                Username: {this.state.user.username}
                <br />
                <Button onClick={this.signOut}>Sign out </Button>
            </div>
        );
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withCookies(withRouter(Profile)));
