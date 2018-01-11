import React from "react";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import { FormControl, FormHelperText } from "material-ui/Form";
import TextField from "material-ui/TextField";

import Button from "material-ui/Button";
import { withRouter } from "react-router-dom";
import { withCookies } from "react-cookie";

const styles = () => ({
    root: {}
});

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            referrer: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };
    componentDidMount() {
        const { cookies } = this.props;

        // redirect to user profile if already signedin
        if (cookies.get("session") !== undefined) {
            this.props.history.replace("/profile");
        }
    }
    onFormSubmit(e) {
        e.preventDefault();
        this.signIn(
            { username: this.state.username, password: this.state.password },
            res => {
                this.setState({ error: false });
                const { cookies } = this.props;
                cookies.set("session", res.session, {
                    path: "/"
                });
                const { location } = this.props;
                if(location.pathname == "/profile/signIn") {
                    this.props.history.replace("/");
                }
                else {
                    this.props.history.replace(location.pathname);
                }

            },
            err => {
                this.setState({ error: true });
            }
        );
    }
    signIn(credentials, successCallback, errorCallback) {
        this.props.setLoading(true);
        fetch("/api/auth/signIn", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: credentials.username,
                password: credentials.password
            })
        })
            .then(response => {
                if (response.ok) return response;
                else throw new Error(response.error);
            })
            .then(response => response.json())
            .then(responseJson => {
                this.props.setLoading(false);
                successCallback(responseJson);
            })
            .catch(err => {
                this.props.setLoading(false);
                errorCallback(err);
            });
    }
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <form onSubmit={this.onFormSubmit}>
                    
                    <FormControl className={classes.formControl}>
                        <FormHelperText>
                        {this.props.requiresLoginInfo ? "The page you are trying to access requires signing in." : ""}
                        </FormHelperText>
                        <TextField
                            id="username"
                            label="Username"
                            className={classes.textField}
                            value={this.state.username}
                            onChange={this.handleChange("username")}
                            required
                            margin="normal"
                        />
                        <TextField
                            id="password"
                            label="Password"
                            className={classes.textField}
                            type="password"
                            autoComplete="current-password"
                            margin="normal"
                            onChange={this.handleChange("password")}
                            required
                        />
                        <Button
                            type="submit"
                            id="submitField"
                            name="submitField"
                        >
                            Sign in
                        </Button>
                        {this.state.error ? "Invalid credentials" : ""}
                    </FormControl>
                </form>
            </div>
        );
    }
}

SignIn.propTypes = {
    classes: PropTypes.object.isRequired
};
SignIn.defaultProps = {
    requiresLoginInfo: false
}

export default withStyles(styles)(withRouter(withCookies(SignIn)));
