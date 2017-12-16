import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },

});

let id = 0;
function createData(currency, price, amount, change) {
  id += 1;
  let value=(price*amount);
  return { id, currency, price, amount, value, change};
  
}

const data = [
  createData('ETH', 670, 46, 23.3),
  createData('BTC', 16243, 0.19, 7.2)
];

function BasicTable(props) {
  const { classes } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell numeric>Cryptocurrency</TableCell>
            <TableCell numeric>Price ($USD)</TableCell>
            <TableCell numeric>Amount</TableCell>
            <TableCell numeric>Value</TableCell>
            <TableCell numeric>Change (24h)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(n => {
            return (
              <TableRow key={n.id}>
                <TableCell>{n.currency}</TableCell>
                <TableCell numeric>{n.price}</TableCell>
                <TableCell numeric>{n.amount}</TableCell>
                <TableCell numeric>{n.value}</TableCell>
                <TableCell numeric>{n.change}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

BasicTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BasicTable);