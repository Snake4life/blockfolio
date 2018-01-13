import React from "react";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import Button from "material-ui/Button";
import humanDate from "human-date";
import Tabs, { Tab } from "material-ui/Tabs";
import Typography from "material-ui/Typography";
import AppBar from "material-ui/AppBar";
import LoadingMessage from "../LoadingMessage";
const styles = (theme) => ({
    root: { width: "100%", padding: theme.spacing.unit * 3 }
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
                if (res.status == 401) this.props.signOut();
                else console.error("Unable to load profile data. " + res.error);
            });
    }
    componentDidMount() {
        this.fetchUserData();
    }
    handleTabChange = (event, tabValue) => {
        this.setState({ tabValue });
        this.props.history.push("/profile/" + tabValue);
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                {this.state.loading ? (
                    <LoadingMessage />
                ) : (
                    <div>
                        <Typography type="title" gutterBottom>
                            Welcome, {this.state.user.username}
                        </Typography>

                        <p>
                            <Button
                                onClick={this.props.signOut}
                                raised
                                disabled={this.state.loading}
                                color="primary"
                            >
                                Sign out
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

export default withStyles(styles, { withTheme: true } )(withCookies(withRouter(Profile)));
