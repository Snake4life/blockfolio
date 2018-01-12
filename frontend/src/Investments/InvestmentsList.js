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
import List, { ListItem, ListItemText, ListItemIcon } from "material-ui/List";
import Avatar from "material-ui/Avatar";
import FolderIcon from "material-ui-icons/Folder";
import moment from "moment";
import Divider from "material-ui/Divider";
const styles = theme => ({
    root: {
        //marginTop: theme.spacing.unit,
        overflowX: "auto",
        height: "100%",
        paddingBottom: "90px"
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

class FolderList extends React.Component {
    render() {
        const { classes, theme } = this.props;

        return (
            <div className={classes.root}>
                <List dense={true}>
                    {this.props.data.map((n, index) => {
                        return [
                            <ListItem button>
                                <ListItemIcon>
                                    <img
                                        src={
                                            "https://www.cryptocompare.com/" +
                                            n.image_url
                                        }
                                        width="32"
                                        height="32"
                                        alt={n.symbol}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    secondary={
                                        (n.amount > 0
                                            ? "+" + n.amount
                                            : n.amount) +
                                        " " +
                                        n.symbol
                                    }
                                    primary={moment(n.datetime).format(
                                        "DD-MM-YYYY HH:SS"
                                    )}
                                />
                                <ListItemText
                                    primary={n.balance + " " + n.symbol}
                                />
                            </ListItem>,
                            <Divider light />
                        ];
                    })}
                </List>
            </div>
        );
    }
}

class InvestmentsTable extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { classes, theme } = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="dense">#ID</TableCell>
                            <TableCell padding="dense">Icon</TableCell>
                            <TableCell padding="dense">Currency</TableCell>
                            <TableCell padding="dense">Date</TableCell>
                            <TableCell padding="dense">Amount</TableCell>
                            <TableCell padding="dense">
                                Price at the time ($USD)
                            </TableCell>

                            <TableCell padding="dense">Value</TableCell>
                            <TableCell padding="dense">Balance</TableCell>
                            <TableCell numeric padding="dense">
                                Balance value
                            </TableCell>
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
                                    <TableCell padding="dense">
                                        {dateformat(n.datetime, "isoDate")}{" "}
                                        {dateformat(n.datetime, "isoTime")}
                                    </TableCell>
                                    <TableCell numeric padding="dense">
                                        {n.amount}
                                    </TableCell>
                                    <TableCell numeric padding="dense">
                                        {currencyFormatter("USD").format(
                                            n.price_usd
                                        )}
                                    </TableCell>

                                    <TableCell numeric padding="dense">
                                        {currencyFormatter("USD").format(
                                            n.amount * n.price_usd
                                        )}
                                    </TableCell>
                                    <TableCell numeric padding="dense">
                                        {n.balance} {n.symbol}
                                    </TableCell>
                                    <TableCell numeric padding="dense">
                                        {currencyFormatter("USD").format(
                                            n.balance * n.price_usd
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

InvestmentsTable.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(FolderList);
