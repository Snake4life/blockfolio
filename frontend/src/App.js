import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ResponsiveDrawer from "./ResponsiveDrawer";
import "./App.css";
import { withRouter } from "react-router-dom";
import { createMuiTheme } from "material-ui/styles";
import { blueGrey, green, orange, red } from 'material-ui/colors';
import { CookiesProvider } from "react-cookie";

const theme = createMuiTheme({
    palette: {
        primary: {
            ...blueGrey
        },
        secondary: {
            ...orange
        },
        error: red,
        warning: orange
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
