import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ResponsiveDrawer from "./ResponsiveDrawer";
import "./App.css";
import { withRouter } from "react-router-dom";
import { createMuiTheme } from "material-ui/styles";
import blue from "material-ui/colors/blue";
import green from "material-ui/colors/green";
import red from "material-ui/colors/red";
import { CookiesProvider } from "react-cookie";

const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: {
            ...green,
            A400: "#00e677"
        },
        error: red
    }
});

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <CookiesProvider>
                    <div className="App">
                        <ResponsiveDrawer />
                    </div>
                </CookiesProvider>
            </MuiThemeProvider>
        );
    }
}

export default withRouter(App);
