import React from "react";
import InvestmentsTable from "./InvestmentsTable";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import AddIcon from "material-ui-icons/Add";
import { withRouter, Link } from "react-router-dom";
import { Route, Switch } from "react-router";
import AddInvestment from "./AddInvestment";

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

class Investments extends React.Component {
    render() {
        const { classes, theme } = this.props;

        const AddInvestmentComponent = () => (
            <AddInvestment addInvestment={this.props.addInvestment} />
        );

        return (
            <Switch>
                <Route exact path="/investments">
                    <div>
                        <InvestmentsTable
                            data={this.props.getInvestments()}
                            getCurrencyPriceById={this.props.getCurrencyPriceById}
                        />
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
            </Switch>
        );
    }
}

Investments.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(Investments));
