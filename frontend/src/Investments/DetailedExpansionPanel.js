import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import classNames from "classnames";
import ExpansionPanel, {
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    ExpansionPanelActions
} from "material-ui/ExpansionPanel";
import Typography from "material-ui/Typography";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";
import Chip from "material-ui/Chip";
import Divider from "material-ui/Divider";
import moment from "moment";
import { Link, withRouter } from "react-router-dom";
import Button from "material-ui/Button";
import AddIcon from "material-ui-icons/Add";
import currencyFormatter from "../currencyFormatter";
import Warning from "../Warning";

const styles = theme => ({
    root: {
        padding: theme.spacing.unit * 3,
        paddingBottom: "90px"
    },
    heading: {
        fontSize: theme.typography.pxToRem(15)
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary
    },
    icon: {
        verticalAlign: "bottom",
        height: 20,
        width: 20
    },
    iconColumn: {
        width: "50px"
    },
    details: {
        alignItems: "center"
    },
    column: {
        flexBasis: "33.3%",
        display: "flex",
        alignItems: "center"
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.text.lightDivider}`,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
    },
    link: {
        color: theme.palette.primary[500],
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline"
        }
    },
    plus: {
        color: "lightgreen"
    },
    minus: {
        color: "red"
    },
    button: {
        margin: 0,
        top: "auto",
        right: 20,
        bottom: 20,
        left: "auto",
        position: "fixed"
    }
});

class DetailedExpansionPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
        };
        this.deleteItem = this.deleteItem.bind(this);
    }
    deleteItem(investmentId) {
        return event => {
            this.props.setLoading(true);
            fetch("/api/investments/delete/" + investmentId, {
                credentials: "same-origin",
                headers: {
                    "Cache-Control": "no-cache"
                }
            })
                .then(res => {
                    if (!res.ok) throw res;
                    this.props.setLoading(false);
                    this.setState({
                        data: this.state.data.filter(
                            el => el.investment_id != investmentId
                        )
                    });
                    this.props.fetchInvestments();
                    this.props.checkPrices();
                })
                .catch(res => {
                    this.props.setLoading(false);
                    if (res.status == 401) this.props.signOut();
                    console.error("Unable to delete investment: " + res.error);
                });
        };
    }
    render() {
        const { classes, theme } = this.props;

        return (
            <div className={classes.root}>
                {this.props.outdatedPrices.length>0 ? (
                    <Warning message={"We are still missing price history for some of the coins in your portfolio: "+this.props.outdatedPrices.map(el=>el.symbol).join(", ")+". Some values may be inaccurate."} />
                ) : (
                    ""
                )}
                {this.props.outdatedPrices.length>0 && this.props.outdatedPrices.filter(currency => currency.no_market_data == 1).length>0 ? (
                    <Warning message={"There is no market data for some of the coins in your portfolio: "+this.props.outdatedPrices.filter(currency => currency.no_market_data = 1).map(el=>el.symbol).join(", ")} />
                ) : (
                    ""
                )}
                {this.state.data.map((n, index) => {
                    return (
                        <ExpansionPanel>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <div className={classes.iconColumn}>
                                    <img
                                        src={
                                            "https://www.cryptocompare.com/" +
                                            n.image_url
                                        }
                                        width="36"
                                        height="36"
                                        alt={n.symbol}
                                    />
                                </div>
                                <div className={classes.column}>
                                    <Typography type="body1">
                                        {moment(n.datetime).format(
                                            "DD-MM-YYYY HH:SS"
                                        )}
                                    </Typography>
                                </div>
                                <div className={classes.column}>
                                    <Typography
                                        className={
                                            n.amount > 0
                                                ? classes.plus
                                                : classes.minus
                                        }
                                        type="body1"
                                    >
                                        {(n.amount > 0
                                            ? "+" + n.amount
                                            : n.amount) +
                                            " " +
                                            n.symbol}
                                    </Typography>
                                </div>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className={classes.details}>
                                <div className={classes.iconColumn} />
                                <div
                                    className={classes.column}
                                    style={{
                                        justifyContent: "flex-end",
                                        alignSelf: "flex-start"
                                    }}
                                >
                                    <Typography
                                        type="body1"
                                        style={{
                                            paddingRight: "1em",
                                            textAlign: "right"
                                        }}
                                    >
                                        Balance:<br />Price at the time:<br />Value:<br /><br />Type:
                                    </Typography>
                                </div>
                                <div className={classes.column}>
                                    <Typography type="body1">
                                        {n.balance} {n.symbol}
                                        <br />
                                        {currencyFormatter("USD").format(
                                            n.price_usd
                                        )}
                                        <br />
                                        <span
                                            className={
                                                n.amount > 0
                                                    ? classes.plus
                                                    : classes.minus
                                            }
                                        >
                                            {" "}
                                            {(n.amount > 0 ? "+" : "") +
                                                currencyFormatter("USD").format(
                                                    n.price_usd * n.amount
                                                )}
                                        </span>
                                        <br />
                                        {"=" +
                                            currencyFormatter("USD").format(
                                                n.balance * n.price_usd
                                            )}<br/>Trade
                                    </Typography>
                                </div>
                            </ExpansionPanelDetails>

                            <Divider />
                            <ExpansionPanelActions>
                                <Button
                                    dense
                                    color="primary"
                                    onClick={this.deleteItem(n.investment_id)}
                                >
                                    Delete
                                </Button>
                            </ExpansionPanelActions>
                        </ExpansionPanel>
                    );
                })}
                <Button
                    fab
                    color="primary"
                    aria-label="add"
                    className={classes.button}
                    component={Link}
                    to="/investments/add"
                >
                    <AddIcon />
                </Button>
            </div>
        );
    }
}

DetailedExpansionPanel.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(
    withRouter(DetailedExpansionPanel)
);
