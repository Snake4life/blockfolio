import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ResponsiveDrawer from "./ResponsiveDrawer";
import "./App.css";
import { withRouter } from "react-router-dom";

import { createMuiTheme } from "material-ui/styles";
import blue from "material-ui/colors/blue";
import orange from "material-ui/colors/orange";

const theme = createMuiTheme({
    palette: {
        primary: orange,
        secondary: blue,
    }
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div className="App">
                    <ResponsiveDrawer />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withRouter(App);
