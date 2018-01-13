import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router-dom";
import Button from "material-ui/Button";
import currencyFormatter from "../currencyFormatter";
import dateformat from "dateformat";
import LoadingMessage from "../LoadingMessage";
import humanDate from "human-date";
const styles = (theme) => ({
    root: {
        width: "100%",
        padding: theme.spacing.unit * 3
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

class Investment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: {},
            investment: {},
            loading: true
        };
        this.deleteInvestment = this.deleteInvestment.bind(this);
    }
    componentDidMount() {
        this.fetchInvestment();
    }
    fetchInvestment() {
        this.props.setLoading(true);
        fetch(
            "/api/investments/investment/" +
                this.props.match.params.investmentId,
            {
                credentials: "same-origin",
                headers: {
                    "Cache-Control": "no-cache"
                }
            }
        )
            .then(res => {
                if (res.ok) return res.json();
                else throw res;
            })
            .then(responseJson => {
                this.props.setLoading(false);
                this.setState({
                    currency: responseJson.currency,
                    investment: responseJson.investment,
                    loading: false
                });
            })
            .catch(res => {
                this.props.setLoading(false);
                if (res.status == 401) this.props.signOut();
                console.error("Unable to fetch investment: " + res.error);
            });
    }
    deleteInvestment() {
        this.setState({ loading: true });
        fetch(
            "/api/investments/delete/" + this.state.investment.investment_id,
            {
                credentials: "same-origin",
                headers: {
                    "Cache-Control": "no-cache"
                }
            }
        )
            .then(res => {
                if (!res.ok) throw res;
                return this.props.history.push("/investments");
            })
            .catch(res => {
                this.props.setLoading(false);
                if (res.status == 401) this.props.signOut();
                console.error("Unable to delete investment: " + res.error);
            });
    }
    render() {
        const { classes } = this.props;

        const render = (
            <div className={classes.root}>
                {this.props.isLoading() ? (
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
                        <h2>{this.state.investment.name}</h2>
                        <p>Amount: {this.state.investment.amount}</p>
                        <p>
                            Current price:{" "}
                            {currencyFormatter("USD").format(
                                this.state.currency.price_usd
                            )}{" "}
                            (last updated{" "}
                            {humanDate.relativeTime(
                                this.state.currency.price_last_updated
                            )})
                        </p>
                        <p>
                            Price at the time:{" "}
                            {currencyFormatter("USD").format(
                                this.state.investment.price_usd
                            )}
                        </p>
                        <p>
                            Date of the trade:{" "}
                            {this.state.investment.date
                                ? dateformat(
                                      this.state.investment.date,
                                      "isoDate"
                                  )
                                : ""}
                        </p>
                        <Button
                            id="delete"
                            onClick={this.deleteInvestment}
                            raised
                            disabled={this.state.loading}
                            color="primary"
                        >
                            Delete investment
                        </Button>
                    </div>
                )}
            </div>
        );
        return render;
    }
}

Investment.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles, {withTheme:true})(withRouter(Investment));
