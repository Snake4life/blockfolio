import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Table, {
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableFooter,
    TablePagination
} from "material-ui/Table";
import Paper from "material-ui/Paper";
import humanDate from "human-date";
import { withRouter, Link } from "react-router-dom";
import currencyFormatter from "../currencyFormatter";
import queryString from "query-string";

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

class CurrenciesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 5
        };

        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.onRouteChanged = this.onRouteChanged.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        this.changePages();
    }
    changePages() {
        var parsed = queryString.parse(this.props.location.search);
        if (parsed.page) this.setState({ page: parseInt(parsed.page) });
        else this.setState({ page: 0 });
        if (parsed.rowsPerPage)
            this.setState({ rowsPerPage: parseInt(parsed.rowsPerPage) });
        else this.setState({ rowsPerPage: 5 });
        console.log(this.state);
    }
    componentDidMount() {
        this.changePages();
    }
    handleChangePage(event, page) {
        this.setState({ page: page });
        var parsed = queryString.parse(this.props.location.search);
        parsed.page = page;
        this.props.history.push({
            pathname: "/currencies",
            search: queryString.stringify(parsed)
        });
    }
    handleChangeRowsPerPage(event) {
        this.setState({ rowsPerPage: event.target.value });
        var parsed = queryString.parse(this.props.location.search);
        parsed.rowsPerPage = event.target.value;
        this.props.history.push({
            pathname: "/currencies",
            search: queryString.stringify(parsed)
        });
    }
    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell numeric padding="dense">
                                #
                            </TableCell>
                            <TableCell padding="dense">
                            Image
                            </TableCell>
                            <TableCell numeric padding="dense">
                                Currency
                            </TableCell>
                           
                            <TableCell numeric padding="dense">
                                Price ($USD)
                            </TableCell>
                           
                            <TableCell>Last updated</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.data
                            .slice(
                                this.state.page * this.state.rowsPerPage,
                                this.state.page * this.state.rowsPerPage +
                                    this.state.rowsPerPage
                            )
                            .map((n, index) => {
                                const last_updated = humanDate.relativeTime(
                                    new Date(n.price_last_updated).toString()
                                );
                                return (
                                    <TableRow
                                        hover={true}
                                        key={n.currency_id}
                                        className={
                                            index % 2 === 0
                                                ? classes.tableRow
                                                : ""
                                        }
                                    >
                                        <TableCell numeric padding="dense">
                                            {index +
                                                this.state.rowsPerPage *
                                                    this.state.page +
                                                1}
                                        </TableCell>
                                        <TableCell padding="dense">
                                            <img src={'https://www.cryptocompare.com/'+n.image_url} width="32" height="32"/>
                                        </TableCell>
                                        <TableCell padding="dense">
                                            <Link
                                                to={
                                                    "/currencies/details/" +
                                                    n.currency_id
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
                                        
                                        <TableCell padding="dense">
                                            {last_updated}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                count={this.props.data.length}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                backIconButtonProps={{
                                    "aria-label": "Previous Page"
                                }}
                                nextIconButtonProps={{
                                    "aria-label": "Next Page"
                                }}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={
                                    this.handleChangeRowsPerPage
                                }
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </Paper>
        );
    }
}

CurrenciesTable.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(CurrenciesTable));
