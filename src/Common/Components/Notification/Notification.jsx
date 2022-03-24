import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ErrorIcon from '@material-ui/icons/Error';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';

const style = theme => ({
    warning: {
        backgroundColor: "#d32f2f",
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
})

class Notification extends Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            show: this.props.notification? true : false
        }
    }

    handleClose = () => {
        this.setState({ show: false }, () => { this.props.onClose() })
    }

    render() {
        const { classes } = this.props
        console.log("Notification");
        if (this.state.show) {
            return (
                <Snackbar
                    anchorOrigin={{
                        vertical: this.props.vertical?  this.props.vertical : 'top',
                        horizontal:  this.props.horizontal? this.props.horizontal : 'right'
                    }}
                    open={this.state.show}
                    autoHideDuration={3000}
                    onClose={this.handleClose}
                >
                    <SnackbarContent
                        className={classes.warning}
                        aria-describedby="client-snackbar"
                        message={
                            <span id="client-snackbar" className={classes.message}>
                                <ErrorIcon className={classes.iconVariant}/>
                                {this.props.notification}
                            </span>
                        }
                        action={[
                            <IconButton
                                key="close"
                                aria-label="Close"
                                color="inherit"
                                className={classes.close}
                                onClick={this.handleClose}
                            >
                                <CloseIcon className={classes.icon} />
                            </IconButton>
                        ]}
                    />
                </Snackbar>
            );
        }
        else {
            return null
        }
    }
}

Notification.propTypes = {
    vertical: PropTypes.string,
    horizontal: PropTypes.string
};

export default withStyles(style)(Notification);