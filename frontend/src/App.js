import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ResponsiveDrawer from "./ResponsiveDrawer";
import "./App.css";
import { withRouter } from "react-router-dom";
import { createMuiTheme } from "material-ui/styles";
import blue from "material-ui/colors/blue";
import orange from "material-ui/colors/orange";
import { CookiesProvider } from "react-cookie";

const theme = createMuiTheme({
    palette: {
        primary: orange,
        secondary: blue
    }
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signedIn: false
        }
        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
        this.isSignedIn = this.isSignedIn.bind(this);
    }
    signIn() {
        this.setState({signedIn: true});
    }
    signOut() {
        this.setState({signedIn: false});
    }
    isSignedIn() {
        return this.state.signedIn;
    }
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <CookiesProvider>
                    <div className="App">
                        <ResponsiveDrawer/>
                    </div>
                </CookiesProvider>
            </MuiThemeProvider>
        );
    }
}

export default withRouter(App);
