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
import Button from "material-ui/Button";
import DeleteIcon from "material-ui-icons/Delete";

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

class InvestmentsTable extends React.Component {
    constructor(props) {
        super(props);
        this.deleteInvestment = this.deleteInvestment.bind(this);
    }
    deleteInvestment(investment_id) {
        fetch(
            "/api/investments/delete/" + investment_id,
            {
                credentials: "same-origin",
                headers: {
                    "Cache-Control": "no-cache"
                }
            }
        )
            .then(res => {
                if (!res.ok) throw Error(res.status);
                return this.props.history.push("/investments");
            })
            .catch(err => {
                console.error("Unable to delete investment: "+err);
            });
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell numeric>Currency</TableCell>
                            <TableCell numeric>Price ($USD)</TableCell>
                            <TableCell numeric>Amount</TableCell>
                            <TableCell numeric>Value</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Change 1h</TableCell>
                            <TableCell>Change 24h</TableCell>
                            <TableCell>Change 7d</TableCell>
                            <TableCell>Last updated</TableCell>
                            <TableCell>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.data.map((n, index) => {
                            const last_updated = humanDate.relativeTime(
                                new Date(n.last_updated * 1000).toString()
                            );

                            return (
                                <TableRow
                                    key={index + 1}
                                    className={
                                        index % 2 === 0 ? classes.tableRow : ""
                                    }
                                >
                                    <TableCell>
                                        <Link
                                            to={
                                                "/investments/details/" +
                                                n.currency_id
                                            }
                                        >
                                            {n.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell numeric>
                                        {currencyFormatter("USD").format(
                                            n.price_usd
                                        )}
                                    </TableCell>
                                    <TableCell numeric>{n.amount}</TableCell>
                                    <TableCell numeric>
                                        {currencyFormatter("USD").format(
                                            n.amount * n.price_usd
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {dateformat(n.date, "isoDate")}
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
                                    <TableCell>{last_updated}</TableCell>
                                    <TableCell>
                                        <Button
                                            id="delete"
                                            fab mini
                                            onClick={() => {this.deleteInvestment(n.investment_id)}}
                                            raised
                                            color="primary"
                                        >
                                            <DeleteIcon/>
                                        </Button>
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
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(withRouter(InvestmentsTable));
