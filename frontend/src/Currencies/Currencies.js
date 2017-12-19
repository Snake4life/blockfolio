import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import AddIcon from "material-ui-icons/Add";
import { withRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import CurrenciesTable from "./CurrenciesTable";
import Coin from "../Coin";
import Typography from "material-ui/Typography";

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

class Currencies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currencies: []
        };
    }
    componentDidMount() {
        this.getCurrencies();
    }
    getCurrencies() {
        fetch("/api/currencies")
            .then(res => {
                if (!res.ok) throw Error(res.statusText);
                return res.json();
            })
            .then(responseJson => {
                console.log(responseJson);
                this.setState({ currencies: responseJson });
            });
    }

    render() {
        const { classes, theme } = this.props;
        return (
            <Switch>
                <Route exact path="/currencies">
                    <div>
                        <CurrenciesTable
                            data={this.state.currencies}
                        />
                    </div>
                </Route>
            </Switch>
        );
    }
}

Currencies.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(Currencies));
