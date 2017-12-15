import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import PersistentDrawer from "./PersistentDrawer";
import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerOpen:false
        }
        this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    }
    handleDrawerOpen = () => {
        this.setState({ drawerOpen: true });
    };
    render() {
        return (
            <MuiThemeProvider>
                <div className="App">
                    <PersistentDrawer/>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
