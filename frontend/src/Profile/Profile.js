import React from "react";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import Button from "material-ui/Button";
import humanDate from "human-date";

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
    }
    fetchUserData() {
        this.props.setLoading(true);
        fetch("/api/auth/info", {
            credentials: "same-origin"
        })
            .then(res => {
                if (res.ok) return res.json();
                else throw res;
            })
            .then(responseJson => {
                this.props.setLoading(false);
                this.setState({
                    user: responseJson.user,
                    session: responseJson.session,
                    loading: false
                });
            })
            .catch(res => {
                this.props.setLoading(false);
                if( res.status == 401) this.props.signOut();
                else console.error("Unable to load profile data. "+res.error);
            });
    }
    componentDidMount() {
        this.fetchUserData();
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
                                onClick={this.props.signOut}
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
