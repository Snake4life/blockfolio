import React from "react";
import InvestmentsTable from "./InvestmentsTable";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import AddIcon from "material-ui-icons/Add";
import { withRouter, Link } from "react-router-dom";
import { Route, Switch } from "react-router";
import AddInvestment from "./AddInvestment";
import InvestmentDetails from "./InvestmentDetails";
const styles = theme => ({
    table: {
        minWidth: 700
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

var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
    // the default value for minimumFractionDigits depends on the currency
    // and is usually already 2
});

class Investments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            investments: []
        };
        this.getInvestments = this.getInvestments.bind(this);
        this.addInvestment = this.addInvestment.bind(this);
        this.getInvestmentById = this.getInvestmentById.bind(this);
        this.fetchInvestments = this.fetchInvestments.bind(this);
    }
    componentDidMount() {
        this.fetchInvestments();
    }
    fetchInvestments() {
        fetch("/api/investments", { credentials: "same-origin" })
            .then(res => {
                if (!res.ok) throw Error(res.status);
                return res.json();
            })
            .then(responseJson => {
                this.setState({ investments: responseJson });
            })
            .catch(err => {
                console.error("Unable to fetch investments"); // show error message
            });
    }
    getInvestments() {
        return this.state.investments;
    }
    addInvestment(currencyId, amount) {
        this.state.investments.push({ id: currencyId, amount: amount });
    }
    getInvestmentById(id) {
        const investments = this.state.investments.filter(
            investment => investment.id == id
        );
        if (investments.length > 0) return investments[0];
    }
    calculateTotal() {
        var total = Object.keys(this.state.investments)
            .map((key, index) => this.state.investments[key].price_usd)
            .reduce((total, num) => total + num, 0);
        return total;
    }
    render() {
        const { classes, theme } = this.props;

        const AddInvestmentComponent = () => (
            <AddInvestment addInvestment={this.addInvestment} />
        );

        const Details = props => {
            return <InvestmentDetails investmentId={props.match.params.id} />;
        };

        return (
            <Switch>
                <Route exact path="/investments">
                    <div>
                        <InvestmentsTable data={this.getInvestments()} />
                        <div>
                            Total value of investments:{" "}
                            {formatter.format(this.calculateTotal())}
                        </div>
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
                </Route>
                <Route
                    path="/investments/add"
                    component={AddInvestmentComponent}
                />
                <Route path="/investments/currency/:id" component={Details} />
            </Switch>
        );
    }
}

Investments.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(Investments));
