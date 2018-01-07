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
import { withRouter } from "react-router-dom";
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

class InvestmentsCurrencyTable extends React.Component {
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
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell numeric>Amount</TableCell>
                            
                            <TableCell>Date</TableCell>
                            <TableCell>Delete</TableCell>
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
                                    
                                    <TableCell numeric>{n.amount}</TableCell>
                                    
                                    <TableCell>
                                        {dateformat(n.date, "isoDate")}
                                    </TableCell>
                                    
                                    <TableCell>
                                        <Button
                                            id="delete"
                                            fab mini
                                            color="primary"
                                            onClick={() => {this.deleteInvestment(n.investment_id)}}
                                            raised
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

InvestmentsCurrencyTable.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(InvestmentsCurrencyTable));
