import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router-dom";
import { Route, Switch } from "react-router";

const styles = theme => ({});

class InvestmentDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            investment: {

            }
        }
    }
    componentDidMount() {
        // fetch info for the investment for backend
    }
    getCurrencyPriceById(id) {
        
    }
    render() {
        const { classes, theme } = this.props;

        return (
            <Switch>
                <Route path="/investments/currency/:currency">
                    <div>Investment details for {this.props.investmentId}</div>
                </Route>
            </Switch>
        );
    }
}

InvestmentDetails.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(InvestmentDetails));
