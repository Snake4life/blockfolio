import React from "react";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import Button from "material-ui/Button";
import humanDate from "human-date";
import { LinearProgress } from 'material-ui/Progress';

const styles = () => ({
    root: {width:"100%"}
});

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetched: false,
            user: {
                username: ""
            },
            session: {
                expires: ""
            }
        };
        this.fetchUserData = this.fetchUserData.bind(this);
        this.signOut = this.signOut.bind(this);
    }
    fetchUserData() {
        fetch("/api/auth/info", {
            credentials: "same-origin"
        })
            .then(response => {
                if (response.ok) return response;
                else throw new Error(response.error);
            })
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    user: responseJson.user,
                    session: responseJson.session,
                    fetched:true
                });
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
                {this.state.fetched ? "" : <LinearProgress/>}
                <h2>Welcome, {this.state.user.username}</h2>
                Your session expires:{" "}
                {humanDate.relativeTime(this.state.session.expires)}
                <br />
                <p>
                    <Button onClick={this.signOut} raised>
                        Sign out{" "}
                    </Button>
                </p>
            </div>
        );
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withCookies(withRouter(Profile)));
