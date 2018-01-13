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
import { Link, withRouter } from "react-router-dom";
import humanDate from "human-date";
import currencyFormatter from "../currencyFormatter";
import dateformat from "dateformat";
import moment from "moment";
import Button from "material-ui/Button";
import AddIcon from "material-ui-icons/Add";

const styles = theme => ({
    root: {
        //marginTop: theme.spacing.unit,
        overflowX: "auto",
        //height: "calc(100vh - 180px)",
        width: "100%"
    },
    table: {
        width: "100%",
        minHeight: "calc(100vh - 60px)",
        boxShadow: "none !important"
    },
    redColor: {
        color: "#ff0000"
    },
    greenColor: {
        color: "#00aa00"
    },
    tableRow: {
        textDecoration: "none",
        height:"60px",
        backgroundColor: theme.palette.background.default
    },
    tableOddRow: {
        
    },
    tableHead: {

    },
    minusRow: {
        
    },
    plusRow: {
        
    },
    plus: {
        color: "lightgreen"
    },
    minus: {
        color: "red"
    },
    button: {
        margin: 0,
        top: "auto",
        right: 20,
        bottom: 20,
        left: "auto",
        position: "fixed"
    },
    lastRow: {
        height:"90px"
    }
});

class InvestmentsTable extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { classes, theme } = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            <TableCell padding="dense" />
                            <TableCell padding="none">Trade</TableCell>
                            <TableCell padding="none">Price</TableCell>
                            <TableCell padding="none">Balance</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.data.map((n, index) => {
                            const last_updated = humanDate.relativeTime(
                                new Date(n.price_last_updated).toString()
                            );

                            return (
                                <TableRow
                                    hover="true"
                                    key={index + 1}
                                    className={[
                                        classes.tableRow,
                                        (n.amount > 0
                                                    ? classes.plusRow
                                                    : classes.minusRow),
                                        index % 2 === 0
                                            ? classes.tableOddRow
                                            : ""
                                    ]}
                                    component={Link}
                                    to={
                                        "/investments/investment/" +
                                        n.investment_id
                                    }
                                >
                                    <TableCell padding="dense">
                                        <img
                                            src={
                                                "https://www.cryptocompare.com/" +
                                                n.image_url
                                            }
                                            width="32"
                                            height="32"
                                            alt={n.symbol}
                                        />
                                    </TableCell>

                                    <TableCell padding="none">
                                        {moment(n.datetime).format(
                                            "DD-MM-YYYY HH:SS"
                                        )}
                                        <br />
                                        <span
                                            className={
                                                n.amount > 0
                                                    ? classes.plus
                                                    : classes.minus
                                            }
                                        >
                                            {(n.amount > 0
                                                ? "+" + n.amount
                                                : n.amount) +
                                                " " +
                                                n.symbol}
                                        </span>
                                    </TableCell>
                                    <TableCell padding="none">
                                        {currencyFormatter("USD").format(
                                            n.price_usd
                                        )}
                                        <br />
                                        <span
                                            className={
                                                n.amount > 0
                                                    ? classes.plus
                                                    : classes.minus
                                            }
                                        >
                                            {" "}
                                            {(n.amount > 0 ? "+" : "") +
                                                currencyFormatter("USD").format(
                                                    n.price_usd * n.amount
                                                )}
                                        </span>
                                    </TableCell>
                                    <TableCell padding="none">
                                        {n.balance + " " + n.symbol}
                                        <br />
                                        {"=" +
                                            currencyFormatter("USD").format(
                                                n.balance * n.price_usd
                                            )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
<TableRow className={classes.lastRow}/>
                        <Button
                            fab
                            color="primary"
                            aria-label="add"
                            className={classes.button}
                            component={Link}
                            to="/investments/add"
                        >
                            <AddIcon />
                        </Button>
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

InvestmentsTable.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(
    withRouter(InvestmentsTable)
);
