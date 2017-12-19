import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Drawer from "material-ui/Drawer";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import List from "material-ui/List";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import Hidden from "material-ui/Hidden";
import Divider from "material-ui/Divider";
import MenuIcon from "material-ui-icons/Menu";
import MenuList from "./MenuList";

import { withRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import Dashboard from "./Dashboard/Dashboard";
import Investments from "./Investments/Investments";
import AddInvestment from "./Investments/AddInvestment";
import Currencies from "./Currencies/Currencies";

const drawerWidth = 240;

const styles = theme => ({
    root: {
        width: "100%",
        height: 430,
        marginTop: theme.spacing.unit * 3,
        zIndex: 1,
        overflow: "hidden"
    },
    appFrame: {
        position: "relative",
        display: "flex",
        width: "100%",

    },
    appBar: {
        position: "absolute",
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    "appBarShift-left": {
        marginLeft: drawerWidth
    },
    "appBarShift-right": {
        marginRight: drawerWidth
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20
    },
    hide: {
        display: "none"
    },
    drawerPaper: {
        position: "relative",
        height: "100%",
        width: drawerWidth
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 8px",
        ...theme.mixins.toolbar
    },
    content: {
        width: "100%",
        flexGrow: 1,
        overflow: "scroll",
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        height: "calc(100% - 56px)",
        marginTop: 56,
        [theme.breakpoints.up("sm")]: {
            content: {
                height: "calc(100% - 64px)",
                marginTop: 64
            }
        }
    },
    "content-left": {
        marginLeft: -drawerWidth
    },
    "content-right": {
        marginRight: -drawerWidth
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    "contentShift-left": {
        marginLeft: 0
    },
    "contentShift-right": {
        marginRight: 0
    }
});

class PersistentDrawer extends React.Component {
    state = {
        mobileOpen: false
    };

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };

    render() {
        const { classes, theme } = this.props;

        const drawerContent = (
            <div>
                <div className={classes.drawerHeader} />
                <Divider />
                <MenuList onRequestClose={this.handleDrawerToggle} />
            </div>
        );
        const DashboardTitle = () => <div>Dashboard</div>;
        const InvestmentsTitle = () => <div>Investments</div>;
        const CurrenciesTitle = () => <div>Currencies</div>;
        const CurrenciesComponent = () => (
            <Currencies getCurrencies={this.props.getCurrencies} />
        );
        const DashboardComponent = () => (
            <Dashboard getCurrencies={this.props.getCurrencies} />
        );
        const InvestmentsComponent = () => (
            <Investments
                getInvestments={this.props.getInvestments}
                addInvestment={this.props.addInvestment}
                getCurrencyPriceById={this.props.getCurrencyPriceById}
            />
        );
        return (
            <div className={classes.root}>
                <div className={classes.appFrame}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton
                                color="contrast"
                                aria-label="open drawer"
                                onClick={this.handleDrawerToggle}
                                className={classes.navIconHide}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography type="title" color="inherit" noWrap>
                                <Switch>
                                    <Route
                                        exact
                                        path="/"
                                        component={DashboardTitle}
                                    />
                                    <Route
                                        path="/investments"
                                        component={InvestmentsTitle}
                                    />
                                    <Route
                                        path="/currencies"
                                        component={CurrenciesTitle}
                                    />
                                </Switch>
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Hidden mdUp>
                        <Drawer
                            type="temporary"
                            anchor={
                                theme.direction === "rtl" ? "right" : "left"
                            }
                            open={this.state.mobileOpen}
                            classes={{
                                paper: classes.drawerPaper
                            }}
                            onRequestClose={this.handleDrawerToggle}
                            ModalProps={{
                                keepMounted: true // Better open performance on mobile.
                            }}
                        >
                            {drawerContent}
                        </Drawer>
                    </Hidden>
                    <Hidden mdDown implementation="css">
                        <Drawer
                            type="permanent"
                            open
                            classes={{
                                paper: classes.drawerPaper
                            }}
                            className={classes.drawer}
                        >
                            {drawerContent}
                        </Drawer>
                    </Hidden>
                    <main className={classes.content}>
                        <Switch>
                            <Route
                                exact
                                path="/"
                                component={DashboardComponent}
                            />

                            <Route
                                path="/investments"
                                component={InvestmentsComponent}
                            />

                            <Route
                                path="/currencies"
                                component={CurrenciesComponent}
                            />
                        </Switch>
                    </main>
                </div>
            </div>
        );
    }
}

PersistentDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(
    withRouter(PersistentDrawer)
);
