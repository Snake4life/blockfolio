import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Table, {
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "material-ui/Table";
import Paper from "material-ui/Paper";
import { withRouter, Link } from "react-router-dom";
import dateformat from "dateformat";
import Button from "material-ui/Button";
import DeleteIcon from "material-ui-icons/Delete";
import currencyFormatter from "../currencyFormatter";

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit,
        overflowX: "auto"
    },
    redColor: {
        color: "#ff0000"
    },
    greenColor: {
        color: "#00aa00"
    },
    tableRow: {
        backgroundColor: "#fafafa"
    }
});

class InvestmentsCurrencyTable extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>#ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell numeric>Amount</TableCell>
                            <TableCell numeric padding="dense">
                                Price at the time ($USD)
                            </TableCell>
                            
                            <TableCell numeric>Balance</TableCell>
                            <TableCell numeric>Balance value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.data.map((n, index) => {
                            return (
                                <TableRow
                                    key={index + 1}
                                    className={
                                        index % 2 === 0 ? classes.tableRow : ""
                                    }
                                >
                                    <TableCell padding="dense">
                                        <Link
                                            to={
                                                "/investments/investment/" +
                                                n.investment_id
                                            }
                                        >
                                            {n.investment_id}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {dateformat(n.date, "isoDate")}
                                    </TableCell>
                                    <TableCell numeric>{n.amount}</TableCell>
                                    <TableCell numeric padding="dense">
                                        {currencyFormatter("USD").format(
                                            n.price_usd
                                        )}
                                    </TableCell>
                                    <TableCell numeric>{n.balance} {this.props.currency.symbol}</TableCell>
                                    <TableCell numeric>
                                    {currencyFormatter("USD").format(
                                            n.price_usd*n.balance
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

InvestmentsCurrencyTable.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(InvestmentsCurrencyTable));
