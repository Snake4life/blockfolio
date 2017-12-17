import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ResponsiveDrawer from "./ResponsiveDrawer";
import "./App.css";
import { withRouter } from "react-router-dom";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }
    render() {
        return (
            <MuiThemeProvider>
                <div className="App">
                    <ResponsiveDrawer/>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withRouter(App);
