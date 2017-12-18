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
    }
});

class CurrenciesTable extends React.Component {

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell numeric>Currency</TableCell>
                            <TableCell numeric>Price ($USD)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.data.map(n => {
                            return (
                                <TableRow key={n.id}>
                                    <TableCell>{n.name}</TableCell>
                                    <TableCell numeric>{this.props.getPrice(n.name)}</TableCell>
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
