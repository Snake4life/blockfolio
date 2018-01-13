import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import currencyFormatter from "../currencyFormatter";
import Divider from "material-ui/Divider";

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginBottom: theme.spacing.unit * 3
    }),
    column: {
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "stretch",
        flexGrow: 1,
        width: "20px"
    },
    iconCell: {
        paddingRight: "1em"
    },
    flexContainer: {
        display: "flex"
    },
    plus: {
        color: "lightgreen"
    },
    minus: {
        color: "red"
    }
});

class Currency extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: this.props.currency,
            cryptocompare: {},
            marketCap: 0,
        };
    }
    componentDidMount() {
        fetch("/api/currencies/fullSnapshot/" + this.state.currency.currency_id)
            .then(res => {
                if (res.ok) return res.json();
                else throw res;
            })
            .then(responseJson => {
                console.log(responseJson["Data"]);
                this.setState({
                    cryptocompare: responseJson,
                    marketCap:
                        this.state.currency.price_usd *
                        responseJson.Data.General.TotalCoinsMined,
                });
            })
            .catch(res => {
                console.error(
                    "Unable to fetch currency from the server: " + res.error
                );
            });
    }
    render() {
        const { classes } = this.props;
        const { currency } = this.state;
        return (
            <div>
                <Paper className={classes.root} elevation={4}>
                    <div className={classes.flexContainer}>
                        <div className={(classes.column, classes.iconCell)}>
                            <img
                                src={
                                    "https://www.cryptocompare.com/" +
                                    currency.image_url
                                }
                                width="64"
                                height="64"
                                alt={currency.symbol}
                            />
                        </div>
                        <div className={classes.column}>
                            <Typography type="headline" component="h3">
                                {currency.symbol}
                            </Typography>
                        </div>
                        <div className={classes.column}>
                            <Typography component="p">
                                {currencyFormatter("USD").format(
                                    currency.price_usd
                                )}{" "}
                                (<span className={classes.plus}>+3.45%</span>)<br />
                                Market cap:{" "}
                                {currencyFormatter("USD").format(
                                    this.state.marketCap
                                )}
                            </Typography>
                        </div>
                    </div>
                    <Divider />
                    
                </Paper>
            </div>
        );
    }
}

Currency.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Currency);
