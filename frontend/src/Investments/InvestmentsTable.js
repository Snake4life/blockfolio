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
import Button from "material-ui/Button";
import AddIcon from "material-ui-icons/Add";

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit,
        overflowX: "auto"
    }
});

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.data.map(n => {
                            return (
                                <TableRow key={n.id}>
                                    <TableCell>{n.name}</TableCell>
                                    <TableCell numeric>{formatter.format(this.props.getPrice(n.name))}</TableCell>
                                    <TableCell numeric>{n.amount}</TableCell>
                                    <TableCell numeric>{formatter.format(n.amount * this.props.getPrice(n.name))}</TableCell>
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
