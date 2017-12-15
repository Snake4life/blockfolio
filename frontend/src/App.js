import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Drawer from "material-ui/Drawer";
import IconButton from "material-ui/IconButton";
import AppBar from 'material-ui/AppBar';
import MenuIcon from 'material-ui-icons/Menu';
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';
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
                    <AppBar>
                    <Toolbar disableGutters={!this.state.drawerOpen}>
                      <IconButton
                        color="contrast"
                        aria-label="open drawer"
                        onClick={this.handleDrawerOpen}
                      >
                        <MenuIcon />
                      </IconButton>
                      <Typography type="title" color="inherit" noWrap>
                        Persistent drawer
                      </Typography>
                    </Toolbar>
                  </AppBar>
                    <Drawer
                        type="persistent"
                        anchor="left"
                        open={this.state.drawerOpen}>
                        <div>Drawer</div>
                    </Drawer>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
