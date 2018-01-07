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
        fetch("/api/investments/delete/" + investment_id, {
            credentials: "same-origin",
            headers: {
                "Cache-Control": "no-cache"
            }
        })
            .then(res => {
                if (!res.ok) throw Error(res.status);
                return this.props.history.push("/investments");
            })
            .catch(err => {
                console.error("Unable to delete investment: " + err);
            });
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="dense">#ID</TableCell>
                            <TableCell padding="dense">
                                Icon
                            </TableCell>
                            <TableCell padding="dense">
                                Currency
                            </TableCell>
                            <TableCell padding="dense">
                                Price at the time ($USD)
                            </TableCell>
                            <TableCell padding="dense">
                                Amount
                            </TableCell>
                            <TableCell padding="dense">
                                Value
                            </TableCell>
                            <TableCell padding="dense">Date</TableCell>
                            <TableCell padding="dense">Last updated</TableCell>
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
                                    <TableCell padding="dense">
                                        <Link
                                            to={
                                                "/investments/currency/" +
                                                n.symbol
                                            }
                                        >
                                            {n.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell numeric padding="dense">
                                        {currencyFormatter("USD").format(
                                            n.price_usd
                                        )}
                                    </TableCell>
                                    <TableCell numeric padding="dense">
                                        {n.amount}
                                    </TableCell>
                                    <TableCell numeric padding="dense">
                                        {currencyFormatter("USD").format(
                                            n.amount * n.price_usd
                                        )}
                                    </TableCell>
                                    <TableCell padding="dense">
                                        {dateformat(n.date, "isoDate")}
                                    </TableCell>

                                    <TableCell>{last_updated}</TableCell>
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

export default withStyles(styles, { withTheme: true })(
    withRouter(InvestmentsTable)
);
