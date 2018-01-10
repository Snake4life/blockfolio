import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { FormControl } from "material-ui/Form";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import { withRouter } from "react-router-dom";
import CurrencyAutosuggest from "../CurrencyAutosuggestComponent";
import currentDate from "current-date";
import LoadingMessage from "../LoadingMessage";

const styles = theme => ({
    root: {
        width: "100%"
    },
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
            symbol: "",
            amount: 0,
            currencies: [],
            loading: true,
            isValid: false,
            datetime: currentDate("date") + "T00:00"
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.fetchCurrencies = this.fetchCurrencies.bind(this);
        this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
        this.isValid = this.isValid.bind(this);
        this.handleDatetimeChange = this.handleDatetimeChange.bind(this);
        this.isDatetimeValid = this.isDatetimeValid.bind(this);
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
    handleAmountChange(event) {
        this.setState({ amount: event.target.value });
    }
    handleAdd() {
        this.props.setLoading(true);
        fetch("/api/investments/add", {
            credentials: "same-origin",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                symbol: this.state.symbol,
                amount: this.state.amount,
                datetime: this.state.datetime
            })
        })
            .then(res => {
                if (!res.ok) {
                    if (res.status == 401) this.props.signOut();
                    else throw Error(res.statusText);
                }
                this.props.setLoading(true);
                this.props.history.push("/investments");
            })
            .catch(e => {
                console.error("Unable to add investment: " + e);
            });
    }
    componentDidMount() {
        this.fetchCurrencies();
    }
    fetchCurrencies() {
        this.props.setLoading(true);
        fetch("/api/currencies/list", { credentials: "same-origin" })
            .then(res => {
                if (res.ok) return res.json();
                else if (res.status == 401) this.props.signOut();
                else throw res;
            })
            .then(responseJson => {
                this.props.setLoading(false);
                this.setState({ currencies: responseJson, loading: false });
            })
            .catch(e => {
                this.props.setLoading(false);
                console.error(
                    "Unable to fetch currencies from the server: " + e
                );
            });
    }

    handleCurrencyChange(symbol) {
        this.setState({ symbol: symbol });
    }
    handleDatetimeChange(event) {
        this.setState({ datetime: event.target.value });
    }
    isValid() {
        if (
            this.state.symbol &&
            this.state.amount !== 0 &&
            this.isDatetimeValid()
        ) {
            return true;
        }
        return false;
    }
    isDatetimeValid() {
        console.log(this.state.datetime);
        var d = new Date(this.state.datetime);
        var cd = new Date();
        var fd = new Date("17 Mar 2010");
        if (this.state.datetime != "" && d <= cd && d >= fd) return true;
        else return false;
    }
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                {this.props.isLoading() ? (
                    <LoadingMessage />
                ) : (
                    <div>
                        <form className={classes.container} autoComplete="off">
                            <FormControl className={classes.formControl}>
                                <CurrencyAutosuggest
                                    currencies={this.state.currencies}
                                    handleChange={this.handleCurrencyChange}
                                />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    id="amount"
                                    label="Amount"
                                    value={this.state.amount}
                                    onChange={this.handleAmountChange}
                                    type="number"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    margin="normal"
                                />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    id="datetime"
                                    type="datetime-local"
                                    className={classes.textField}
                                    onChange={this.handleDatetimeChange}
                                    label="Date and time of the trade"
                                    defaultValue={
                                        currentDate("date") + "T00:00"
                                    }
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    error={!this.isDatetimeValid()}
                                />
                            </FormControl>
                            <div>
                                <FormControl className={classes.formControl}>
                                    <Button
                                        raised
                                        className={classes.button}
                                        onClick={this.handleAdd}
                                        disabled={!this.isValid()}
                                    >
                                        Add to portfolio
                                    </Button>
                                </FormControl>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        );
    }
}

AddInvestment.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(
    withRouter(AddInvestment)
);
