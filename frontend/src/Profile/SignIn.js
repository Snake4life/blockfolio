import React from "react";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import { FormControl } from "material-ui/Form";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import { withRouter } from "react-router-dom";
import { withCookies } from "react-cookie";

const styles = theme => ({
    root: {}
});

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        const { cookies } = this.props;
        this.state.session = cookies.get("session");
    }
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };
    componentDidMount() {
        // redirect to user profile if already signedin
        if(this.state.session!=undefined) this.props.history.push("/profile");
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
                this.props.history.push("/profile");
            },
            err => {
                this.setState({ error: true });
            }
        );
    }
    signIn(credentials, successCallback, errorCallback) {
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
                else throw "There was an error " + response.error;
            })
            .then(response => response.json())
            .then(responseJson => {
                successCallback(responseJson);
            })
            .catch(err => {
                errorCallback(err);
            });
    }
    render() {
        const { classes, theme } = this.props;

        return (
            <div className={classes.root}>
                <div>
                    <h2>Login</h2>
                </div>
                <form onSubmit={this.onFormSubmit}>
                    <FormControl className={classes.formControl}>
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

export default withStyles(styles)(withRouter(withCookies(SignIn)));
