import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl, FormHelperText } from "material-ui/Form";
import Select from "material-ui/Select";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import { withRouter } from "react-router-dom";

const styles = theme => ({
    container: {
        display: "flex",
        flexWrap: "wrap"
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2
    },
    button: {},
    textField: {
        marginTop: "0px"
    }
});

class AddInvestment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currencyId: "bitcoin",
            amount: 0
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeAmount = this.handleChangeAmount.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
    }
    handleChange (event) {
        this.setState({ [event.target.name]: event.target.value });
    };
    handleChangeAmount (event) {
        this.setState({ amount: event.target.value });
    };
    handleAdd() {
        this.props.addInvestment(this.state.currencyId, this.state.amount);
        this.props.history.push("/investments");
    }
    render() {
        const { classes } = this.props;

        return (
            <form className={classes.container} autoComplete="off">
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="currency">Currency</InputLabel>
                    <Select
                        value={this.state.currencyId}
                        onChange={this.handleChange}
                        input={<Input name="currency" id="currency" />}
                    >
                        <MenuItem value="bitcoin">BTC</MenuItem>
                        <MenuItem value="ethereum">ETH</MenuItem>
                        <MenuItem value="monero">XMR</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <TextField
                        id="amount"
                        label="Amount"
                        value={this.state.amount}
                        onChange={this.handleChangeAmount}
                        type="number"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true
                        }}
                        margin="normal"
                    />
                </FormControl>
                <div>
                    <FormControl className={classes.formControl}>
                        <Button
                            raised
                            className={classes.button}
                            onClick={this.handleAdd}
                        >
                            Add to portfolio
                        </Button>
                    </FormControl>
                </div>
            </form>
        );
    }
}

AddInvestment.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(AddInvestment));
