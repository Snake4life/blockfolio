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

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  // the default value for minimumFractionDigits depends on the currency
  // and is usually already 2
});

class CurrenciesTable extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell numeric>#</TableCell>
                            <TableCell numeric>Currency</TableCell>
                            <TableCell numeric>Market cap</TableCell>
                            <TableCell numeric>Price ($USD)</TableCell>
                            <TableCell numeric>Change 1h</TableCell>
                            <TableCell numeric>Change 24h</TableCell>
                            <TableCell numeric>Change 7d</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.data.map((n, index) => {
                            return (
                                <TableRow key={n.id} className={index %2 == 0 ? classes.tableRow : ''}>
                                    <TableCell numeric>{index+1}</TableCell>
                                    <TableCell>{n.name}</TableCell>
                                    <TableCell numeric>
                                        {formatter.format(n.market_cap_usd)}
                                    </TableCell>
                                    <TableCell numeric>{formatter.format(n.price_usd)}</TableCell>
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
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

CurrenciesTable.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CurrenciesTable);
