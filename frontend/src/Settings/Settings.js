import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import List, { ListItem, ListItemText } from "material-ui/List";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle
} from "material-ui/Dialog";
import Radio, { RadioGroup } from "material-ui/Radio";

import LoadingMessage from "../LoadingMessage";
import Switch from "material-ui/Switch";
import { FormControlLabel, FormGroup } from "material-ui/Form";

const options = ["Cards", "Table"];

class ConfirmationDialog extends React.Component {
    state = {
        value: undefined
    };

    componentWillMount() {
        this.setState({ value: this.props.value });
    }

    componentWillUpdate(nextProps) {
        if (nextProps.value !== this.props.value) {
            // eslint-disable-next-line react/no-will-update-set-state
            this.setState({ value: nextProps.value });
        }
    }

    radioGroup = null;

    handleEntering = () => {
        this.radioGroup.focus();
    };

    handleCancel = () => {
        this.props.onClose(this.props.value);
    };

    handleOk = () => {
        this.props.onClose(this.state.value);
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { value, ...other } = this.props;

        return (
            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                maxWidth="xs"
                onEntering={this.handleEntering}
                aria-labelledby="confirmation-dialog-title"
                {...other}
            >
                <DialogTitle id="confirmation-dialog-title">
                    Investment view
                </DialogTitle>
                <DialogContent>
                    <RadioGroup
                        ref={node => {
                            this.radioGroup = node;
                        }}
                        aria-label="investment-view"
                        name="investment-view"
                        value={this.state.value}
                        onChange={this.handleChange}
                    >
                        {options.map(option => (
                            <FormControlLabel
                                value={option}
                                key={option}
                                control={<Radio />}
                                label={option}
                            />
                        ))}
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleOk} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

ConfirmationDialog.propTypes = {
    onClose: PropTypes.func,
    value: PropTypes.string
};

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.default
    },
    dialog: {
        width: "80%",
        maxHeight: 435
    }
});

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            value: undefined
        };
        this.updateState = this.updateState.bind(this);
        this.handleInvestmentsView = this.handleInvestmentsView.bind(this);
    }

    componentDidUpdate() {
        this.updateState();
    }

    componentDidMount() {
        this.updateState();
    }

    updateState() {
        if (!this.state.value) {
            if (this.props.settings.investments_view == "cards")
                this.setState({ value: "Cards" });
            if (this.props.settings.investments_view == "table")
                this.setState({ value: "Table" });
        }
    }

    button = undefined;

    handleClickListItem = () => {
        this.setState({ open: true });
    };

    handleClose = value => {
        if (value == "Cards")
            this.props.changeSetting("investments_view", "cards");
        if (value == "Table")
            this.props.changeSetting("investments_view", "table");
        this.setState({ value, open: false });
    };
    handleInvestmentsView() {
        if (this.props.settings.investments_view == "cards")
            this.props.changeSetting("investments_view", "table");
        else this.props.changeSetting("investments_view", "cards");
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                {this.props.isComponentLoading("settings") ? (
                    <LoadingMessage />
                ) : (
                    <List>
                        <ListItem button divider disabled>
                            <ListItemText
                                primary="Default currency"
                                secondary="USD"
                            />
                        </ListItem>
                        <ListItem divider disabled>
                            <ListItemText
                                primary="Dark theme"
                                secondary="Light"
                            />
                            <FormGroup>
                                <FormControlLabel control={<Switch />} />
                            </FormGroup>
                        </ListItem>
                        <ListItem
                            button
                            divider
                            aria-haspopup="true"
                            aria-controls="investments-view-menu"
                            aria-label="Investments cards"
                            onClick={this.handleInvestmentsView}
                        >
                            <ListItemText
                                primary="Investments view"
                                secondary={
                                                this.props.settings
                                                    .investments_view == "cards" ? "Show investments as cards" : "Show investments as a table"
                                            }
                            />
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={
                                                this.props.settings
                                                    .investments_view == "cards"
                                            }
                                            aria-label="cardsChecked"
                                        />
                                    }
                                />
                            </FormGroup>
                        </ListItem>

                        <ConfirmationDialog
                            classes={{
                                paper: classes.dialog
                            }}
                            open={this.state.open}
                            onClose={this.handleClose}
                            value={this.state.value}
                        />
                    </List>
                )}
            </div>
        );
    }
}

Settings.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Settings);
