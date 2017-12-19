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
        height: "100%",
        marginTop: 0,
        zIndex: 1,
        overflow: "hidden"
    },
    appFrame: {
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100vw"
    },
    appBar: {
        position: "absolute",
        marginLeft: drawerWidth,
        [theme.breakpoints.up("md")]: {
            width: `calc(100% - ${drawerWidth}px)`
        }
    },
    navIconHide: {
        [theme.breakpoints.up("md")]: {
            display: "none"
        }
    },
    drawerHeader: theme.mixins.toolbar,
    drawerPaper: {
        width: 250,
        overflow: "scroll",
        [theme.breakpoints.up("md")]: {
            width: drawerWidth,
            position: "relative",
            overflow: "scroll"
        },
        paddingBottom: 100
    },
    content: {
        backgroundColor: theme.palette.background.default,
        width: "100%",
        overflow: "scroll",
        padding: theme.spacing.unit * 3,
        height: "100%",
        marginTop: 56,
        paddingBottom: 400,
        [theme.breakpoints.up("sm")]: {
            height: "calc(100% - 64px)",
            marginTop: 64
        }
    },
    contentWrapper: {
        paddingBottom: 400
    }
});

class ResponsiveDrawer extends React.Component {
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
                        <div className={classes.contentWrapper}>
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
                        </div>
                    </main>
                </div>
            </div>
        );
    }
}

ResponsiveDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(
    withRouter(ResponsiveDrawer)
);
