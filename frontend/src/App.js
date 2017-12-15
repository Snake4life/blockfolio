import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Drawer from "material-ui/Drawer";
import "./App.css";

class App extends Component {
    render() {
        return (
            <MuiThemeProvider>
                <div className="App">
                    <Drawer
                        type="permanent"
                        anchor="left">
                        <div>test</div>
                    </Drawer>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
