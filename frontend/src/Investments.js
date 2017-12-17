import React from "react";
import BasicTable from "./BasicTable";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import AddIcon from "material-ui-icons/Add";
import { withRouter } from "react-router-dom";
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
    constructor(props) {
        super(props);
        this.state = {
            coins: [
                {
                    name: "BTC",
                    amount: 0.19
                },
                {
                    name: "ETH",
                    amount: 46
                }
            ]
        };
        this.handleAddButton = this.handleAddButton.bind(this);
        this.addCoin = this.addCoin.bind(this);
    };
    getPrice(coin) {
        if(coin=="ETH") return 670;
        if(coin=="BTC") return 18000;
        if(coin=="XMR") return 300;
    };
    addCoin(coin, amount) {
        this.state.coins.push({name:coin, amount:amount});
    };
    handleAddButton() {
        this.props.history.push("/investments/add");
    };
    render() {
        const { classes, theme } = this.props;
        return (
            <Switch>
                <Route exact path="/investments">
                    <div>
                        <BasicTable data={this.state.coins} getPrice={this.getPrice} />
                        <Button
                            fab
                            color="primary"
                            aria-label="add"
                            className={classes.button}
                            onClick={this.handleAddButton}
                        >
                            <AddIcon />
                        </Button>
                    </div>
                </Route>
                <Route path="/investments/add" component={() => <AddInvestment addCoin={this.addCoin}/>} />
            </Switch>
        );
    }
}

Investments.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(Investments));
