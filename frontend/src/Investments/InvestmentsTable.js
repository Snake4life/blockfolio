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
import { Link } from "react-router-dom";
import humanDate from  'human-date';

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

var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
    // the default value for minimumFractionDigits depends on the currency
    // and is usually already 2
});

class InvestmentsTable extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell numeric>Currency</TableCell>
                            <TableCell numeric>Price ($USD)</TableCell>
                            <TableCell numeric>Amount</TableCell>
                            <TableCell numeric>Value</TableCell>
                            <TableCell>Change 1h</TableCell>
                            <TableCell>Change 24h</TableCell>
                            <TableCell>Change 7d</TableCell>
                            <TableCell>Last updated</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.data.map((n, index) => {
                            const last_updated = humanDate.relativeTime(new Date(n.last_updated*1000).toString());
                            return (
                                <TableRow key={index + 1} className={index %2 === 0 ? classes.tableRow : ''}>
                                    <TableCell>
                                        <Link
                                            to={"/investments/currency/" + n.currency_id}
                                        >
                                            {n.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell numeric>
                                        {formatter.format(n.price_usd)}
                                    </TableCell>
                                    <TableCell numeric>{n.amount}</TableCell>
                                    <TableCell numeric>
                                        {formatter.format(
                                            n.amount * n.price_usd
                                        )}
                                    </TableCell>
                                    <TableCell
                                        numeric
                                        className={
                                            n.percent_change_1h > 0
                                                ? classes.greenColor
                                                : classes.redColor
                                        }
                                    >
                                        {n.percent_change_1h}
                                    </TableCell>
                                    <TableCell
                                        numeric
                                        className={
                                            n.percent_change_24h > 0
                                                ? classes.greenColor
                                                : classes.redColor
                                        }
                                    >
                                        {n.percent_change_24h}
                                    </TableCell>
                                    <TableCell
                                        numeric
                                        className={
                                            n.percent_change_7d > 0
                                                ? classes.greenColor
                                                : classes.redColor
                                        }
                                    >
                                        {n.percent_change_7d}
                                    </TableCell>
                                    <TableCell>
                                        {last_updated}
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

InvestmentsTable.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InvestmentsTable);
