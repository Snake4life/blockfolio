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
        this.handleAddButton = this.handleAddButton.bind(this);
    }
    handleAddButton() {
        this.props.history.push("/investments/add");
    }
    render() {
        const { classes, theme } = this.props;
        return (
            <Switch>
                <Route exact path="/investments">
                    <div>
                        <BasicTable />
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
                <Route path="/investments/add" component={AddInvestment} />
            </Switch>
        );
    }
}

Investments.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(Investments));
