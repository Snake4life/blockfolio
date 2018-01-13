import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";

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

    }
});

class Currency extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: this.props.currency
        };
    }
    render() {
        const { classes } = this.props;
        const { currency } = this.state;
        return (
            <div>
                <Paper className={classes.root} elevation={4}>
                    <div className={classes.column}>
                        <Typography type="headline" component="h3">
                            <img
                                src={
                                    "https://www.cryptocompare.com/" +
                                    currency.image_url
                                }
                                width="36"
                                height="36"
                                alt={currency.symbol}
                            />
                            {currency.symbol}
                        </Typography>
                    </div>
                    <div className={classes.column}>
                        <Typography component="p">
                            {currency.price_usd}
                        </Typography>
                    </div>
                </Paper>
            </div>
        );
    }
}

Currency.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Currency);
