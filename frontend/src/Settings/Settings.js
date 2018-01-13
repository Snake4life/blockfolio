import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import List, { ListItem, ListItemText } from "material-ui/List";
import Menu, { MenuItem } from "material-ui/Menu";
import Button from "material-ui/Button";
import InvestmentsView from "./InvestmentsView";

const styles = theme => ({
    root: { }
});

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.changeInvestmentView = this.changeInvestmentView.bind(this);
    }
    componentDidMount() {}
    changeInvestmentView() {
        
        if (this.props.settings.investments_view == "cards") {
            this.props.changeSetting("investments_view", "table");
        } else {
            this.props.changeSetting("investments_view", "cards");
        }
    }
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <InvestmentsView onClick={this.changeInvestmentView}/>
                
            </div>
        );
    }
}

Settings.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Settings);
