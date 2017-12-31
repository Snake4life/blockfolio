import React from "react";
import PropTypes from "prop-types";
import Downshift from "downshift";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import { MenuItem } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";

const styles = {
    container: {
        flexGrow: 1,
        height: 200
    },
    textField: {
        width: "100%",
        marginTop: "0px"
    }
};

class CurrencyAutosuggest extends React.Component {
    constructor(props) {
        super(props);
    }

    renderInput(inputProps) {
        const { classes, autoFocus, value, ref, ...other } = inputProps;

        return (
            <TextField
                autoFocus={autoFocus}
                className={classes.textField}
                value={value}
                label="Search for currency"
                inputRef={ref}
                InputProps={{
                    classes: {
                        input: classes.input
                    },
                    ...other
                }}
            />
        );
    }
    renderSuggestion(params) {
        const {
            currency,
            index,
            itemProps,
            theme,
            highlightedIndex,
            selectedItem
        } = params;
        const isHighlighted = highlightedIndex === index;
        const isSelected = selectedItem === currency.name;

        return (
            <MenuItem
                {...itemProps}
                key={currency.currency_id}
                selected={isHighlighted}
                component="div"
                style={{
                    fontWeight: isSelected
                        ? theme.typography.fontWeightMedium
                        : theme.typography.fontWeightRegular
                }}
            >
                {currency.name}
            </MenuItem>
        );
    }

    renderSuggestionsContainer(options) {
        const { containerProps, children } = options;

        return (
            <Paper {...containerProps} square>
                {children}
            </Paper>
        );
    }

    getSuggestions(currencies, inputValue) {
        let count = 0;

        return currencies.filter(currency => {
            const keep =
                (!inputValue ||
                    currency.name
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())) &&
                count < 5;

            if (keep) {
                count += 1;
            }

            return keep;
        });
    }

    render() {
        const { classes, theme, currencies } = this.props;

        return (
            <Downshift
                onChange={this.props.handleChange}
                render={({
                    getInputProps,
                    getItemProps,
                    isOpen,
                    inputValue,
                    selectedItem,
                    highlightedIndex
                }) => (
                    <div className={classes.container}>
                        {this.renderInput(
                            getInputProps({
                                classes,
                                id: "integration-downshift"
                            })
                        )}
                        {isOpen
                            ? this.renderSuggestionsContainer({
                                  children: this.getSuggestions(
                                      currencies,
                                      inputValue
                                  ).map((currency, index) =>
                                      this.renderSuggestion({
                                          currency,
                                          index,
                                          theme,
                                          itemProps: getItemProps({
                                              item: currency.currency_id
                                          }),
                                          highlightedIndex,
                                          selectedItem
                                      })
                                  )
                              })
                            : null}
                    </div>
                )}
            />
        );
    }
}

CurrencyAutosuggest.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(CurrencyAutosuggest);
