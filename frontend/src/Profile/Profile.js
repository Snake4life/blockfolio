import React from "react";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import Button from "material-ui/Button";
import humanDate from "human-date";
import { LinearProgress } from "material-ui/Progress";

const styles = () => ({
    root: { width: "100%" }
});

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
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
        this.props.setLoading(true);
        fetch("/api/auth/info", {
            credentials: "same-origin"
        })
            .then(response => {
                if (response.ok) return response;
                else throw new Error(response.error);
            })
            .then(response => response.json())
            .then(responseJson => {
                this.props.setLoading(false);
                this.setState({
                    user: responseJson.user,
                    session: responseJson.session,
                    loading: false
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
        this.props.setLoading(true);
        fetch("/api/auth/signOut", {
            credentials: "same-origin"
        })
            .then(response => {
                if (response.ok) return response;
                else throw new Error(response.error);
            })
            .then(response => {
                try {
                    this.props.setLoading(false);
                    const { cookies } = this.props;
                    cookies.remove("session");
                    this.props.history.push("/profile/signIn");
                } catch (e) {
                    throw new Error(e);
                }
            })
            .catch(err => {
                this.props.setLoading(false);
                console.error(err);
            });

        // remove cookies
    }
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                {this.state.loading ? (
                    ""
                ) : (
                    <div>
                        <h2>Welcome, {this.state.user.username}</h2>
                        Your session expires:{" "}
                        {humanDate.relativeTime(this.state.session.expires)}
                        <br />
                        <p>
                            <Button
                                onClick={this.signOut}
                                raised
                                disabled={this.state.loading}
                            >
                                Sign out{" "}
                            </Button>
                        </p>
                    </div>
                )}
            </div>
        );
    }
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withCookies(withRouter(Profile)));
