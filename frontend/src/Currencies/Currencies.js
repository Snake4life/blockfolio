import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { withRouter } from "react-router-dom";
import LoadingMessage from "../LoadingMessage";
import Currency from "./Currency";

const styles = theme => ({
    root: { padding: theme.spacing.unit * 3 }
});

class Currencies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currencies: []
        };
        this.fetchCurrencies = this.fetchCurrencies.bind(this);
    }
    componentDidMount() {
        this.fetchCurrencies();
    }
    fetchCurrencies() {
        this.props.setLoading(true);
        fetch("/api/currencies/mine", {
            credentials: "same-origin",
            headers: {
                "Cache-Control": "no-cache"
            }
        })
            .then(res => {
                if (res.ok) return res.json();
                else throw res;
            })
            .then(responseJson => {
                this.props.setLoading(false);
                this.setState({ currencies: responseJson });
            })
            .catch(res => {
                if (res.status == 401) this.props.signOut();
                this.props.setLoading(false);
                console.error(
                    "Unable to fetch currencies from the server: " + res.error
                );
            });
    }
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                {this.props.isLoading() ? (
                    <LoadingMessage />
                ) : (
                    this.state.currencies.map(el => {
                        return (<Currency currency={el}/>);
                    })
                )}
            </div>
        );
    }
}

Currencies.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(withRouter(Currencies));
