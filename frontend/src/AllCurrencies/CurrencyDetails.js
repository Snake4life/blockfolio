import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router-dom";
import humanDate from "human-date";
import currencyFormatter from "../currencyFormatter";
import LoadingMessage from "../LoadingMessage";

const styles = () => ({
    root: {}
});

class CurrencyDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: {},
            loading: true
        };
    }
    componentDidMount() {
        this.fetchCurrency();
    }
    fetchCurrency() {
        this.props.setLoading(true);
        fetch("/api/currencies/currency/" + this.props.match.params.symbol, {
            credentials: "same-origin",
            headers: {
                "Cache-Control": "no-cache"
            }
        })
            .then(res => {
                if (res.ok) return res.json();
                else throw res;
            })
            .then(responseJson => {
                this.props.setLoading(false);
                this.setState({ currency: responseJson, loading: false });
            })
            .catch(res => {
                this.props.setLoading(false);
                if (res.status == 401) this.props.signOut();
                else console.error("Unable to fetch currency details." +res.error); // show error message
            });
    }
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                {this.state.loading ? (
                    <LoadingMessage />
                ) : (
                    <div>
                        <img
                            src={
                                "https://www.cryptocompare.com/" +
                                this.state.currency.image_url
                            }
                            width="128"
                            height="128"
                            alt={this.state.currency.symbol}
                        />
                        <h2>{this.state.currency.name}</h2>
                        <p>
                            Price:{" "}
                            {currencyFormatter("USD").format(
                                this.state.currency.price_usd
                            )}{" "}
                            (last updated{" "}
                            {humanDate.relativeTime(
                                this.state.currency.price_last_updated
                            )})
                        </p>
                    </div>
                )}
            </div>
        );
    }
}

CurrencyDetails.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(CurrencyDetails));
