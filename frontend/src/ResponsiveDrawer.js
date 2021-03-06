import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Drawer from "material-ui/Drawer";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import Hidden from "material-ui/Hidden";
import Divider from "material-ui/Divider";
import MenuIcon from "material-ui-icons/Menu";
import MenuList from "./MenuList";
import { withRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import Investments from "./Investments/Investments";
import Currencies from "./Currencies/Currencies";
import SignIn from "./Profile/SignIn";
import Profile from "./Profile/Profile";
import { withCookies } from "react-cookie";
import AddInvestment from "./Investments/AddInvestment";
import InvestmentsCurrency from "./Investments/InvestmentsCurrency";
import CurrencyDetails from "./Currencies/CurrencyDetails";
import { LinearProgress } from "material-ui/Progress";
import Investment from "./Investments/Investment";
import InvestmentsTotal from "./Investments/InvestmentsTotal";
import InvestmentsGrowth from "./Investments/InvestmentsGrowth";
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
        height: "100vh"
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
        marginTop: 56,
        [theme.breakpoints.up("sm")]: {
            marginTop: 64
        }
    }
});

class ResponsiveDrawer extends React.PureComponent {
    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };
    constructor(props) {
        super(props);
        this.isSignedIn = this.isSignedIn.bind(this);
        this.setLoading = this.setLoading.bind(this);
        this.isLoading = this.isLoading.bind(this);
        this.state = {
            mobileOpen: false,
            loading: false
        };
        this.requiresLogin = this.requiresLogin.bind(this);
    }
    setLoading(loading) {
        this.setState({ loading: loading });
    }
    isLoading() {
        return this.state.loading;
    }
    isSignedIn() {
        const { cookies } = this.props;
        if (cookies.get("session") !== undefined) {
            return true;
        }
    }
    requiresLogin() {
        if (!this.isSignedIn()) {
            console.log("user not signed in");
        } else console.log("user signed in");
    }
    render() {
        const { classes, theme } = this.props;

        const drawerContent = (
            <div>
                <div className={classes.drawerHeader} />
                <Divider />
                <MenuList onRequestClose={this.handleDrawerToggle} />
            </div>
        );
        const InvestmentsTitle = () => <div>Investments</div>;
        const CurrenciesTitle = () => <div>Currencies</div>;
        const ProfileTitle = () => <div>Profile</div>;
        const SignInTitle = () => <div>Sign in</div>;
        const ErrorTitle = () => <div>Error</div>;

        const commonProps = {
            setLoading: this.setLoading,
            isLoading: this.isLoading
        };

        const SignInComponent = requiresLoginInfo => {
            return () => (
                <SignIn
                    {...commonProps}
                    requiresLoginInfo={requiresLoginInfo}
                />
            );
        };

        const RequiresLogin = component => {
            if (this.isSignedIn()) return component;
            else return SignInComponent(true);
        };

        const CurrenciesComponent = () => <Currencies {...commonProps} />;
        const InvestmentsComponent = () => <Investments {...commonProps} />;
        const InvestmentComponent = () => <Investment {...commonProps} />;
        const InvestmentsCurrencyComponent = () => (
            <InvestmentsCurrency {...commonProps} />
        );
        const InvestmentsTotalComponent = () => (
            <InvestmentsTotal {...commonProps} />
        );
        const InvestmentsGrowthComponent = () => (
            <InvestmentsGrowth {...commonProps} />
        );
        const AddInvestmentComponent = () => <AddInvestment {...commonProps} />;

        const ProfileComponent = () => <Profile {...commonProps} />;
        const CurrencyDetailsComponent = () => (
            <CurrencyDetails {...commonProps} />
        );
        const NotFoundComponent = () => (
            <div>
                <h2>404</h2>Not found
            </div>
        );

        return (
            <div className={classes.root}>
                {this.state.loading ? <LinearProgress /> : ""}
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
                                        component={ProfileTitle}
                                    />
                                    <Route
                                        path="/investments"
                                        component={InvestmentsTitle}
                                    />
                                    <Route
                                        path="/currencies"
                                        component={CurrenciesTitle}
                                    />
                                    <Route
                                        exact
                                        path="/profile/signIn"
                                        component={SignInTitle}
                                    />
                                    <Route component={ErrorTitle} />
                                </Switch>
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Hidden mdUp>
                        <Drawer
                            type="temporary"
                            anchor="left"
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
                                    path="/investments"
                                    render={RequiresLogin(InvestmentsComponent)}
                                />
                                <Route
                                    exact
                                    path="/investments/add"
                                    render={RequiresLogin(AddInvestmentComponent)}
                                />
                                <Route
                                    exact
                                    path="/investments/currency/:symbol"
                                    render={RequiresLogin(InvestmentsCurrencyComponent)}
                                />
                                <Route
                                    exact
                                    path="/investments/investment/:investmentId"
                                    render={RequiresLogin(InvestmentComponent)}
                                />
                                <Route
                                    exact
                                    path="/investments/total"
                                    render={RequiresLogin(InvestmentsTotalComponent)}
                                />
                                <Route
                                    path="/investments/growth/:symbol?"
                                    render={RequiresLogin(InvestmentsGrowthComponent)}
                                />

                                <Route
                                    exact
                                    path="/currencies"
                                    render={RequiresLogin(CurrenciesComponent)}
                                />
                                <Route
                                    path="/currencies/currency/:symbol"
                                    render={RequiresLogin(CurrencyDetailsComponent)}
                                />
                                <Route
                                    exact
                                    path="/profile/signIn"
                                    render={SignInComponent(false)}
                                />

                                <Route
                                    exact
                                    path="/"
                                    render={RequiresLogin(ProfileComponent)}
                                />
                                <Route component={NotFoundComponent} />
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
    withRouter(withCookies(ResponsiveDrawer))
);
