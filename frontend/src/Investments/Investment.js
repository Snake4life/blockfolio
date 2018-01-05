import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { withRouter, Link } from "react-router-dom";
import { Route, Switch } from "react-router";
import EditIcon from "material-ui-icons/Edit";
import Button from "material-ui/Button";
import currencyFormatter from "../currencyFormatter";
import { LinearProgress } from "material-ui/Progress";
import dateformat from "dateformat";
import LoadingMessage from "../LoadingMessage";

const styles = () => ({
    root: {},
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
                if (!res.ok) throw Error(res.status);
                return res.json();
            })
            .then(responseJson => {
                this.props.setLoading(false);
                this.setState({ investment: responseJson, loading: false });
            })
            .catch(err => {
                this.props.setLoading(false);
                console.error("Unable to fetch investment"); // show error message
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
                if (!res.ok) throw Error(res.status);
                return this.props.history.push("/investments");
            })
            .catch(err => {
                console.error("Unable to delete investment");
            });
    }
    render() {
        const { classes } = this.props;

        const render = (
            <div className={classes.root}>
                {this.props.isLoading() ? (
                    <LoadingMessage/>
                ) : (
                    <div>
                        <h2>{this.state.investment.name}</h2>
                        <p>Amount: {this.state.investment.amount}</p>
                        <p>
                            Price:{" "}
                            {currencyFormatter("USD").format(
                                this.state.investment.price_usd
                            )}
                        </p>
                        <p>
                            Date of the trade:{" "}
                            {this.state.investment.date ? dateformat(this.state.investment.date, "isoDate") : ""}
                        </p>
                        <Button
                            id="delete"
                            onClick={this.deleteInvestment}
                            raised
                            disabled={this.state.loading}
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

export default withStyles(styles)(withRouter(Investment));
