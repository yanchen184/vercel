import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';

const styles = theme => ({
    content: {
        display: "flex",
        justifyContent: 'center',
        alignItems: "center"
    },
    progress: {
        margin: theme.spacing(2),
    }
  });

class Loading extends Component {
    render() {
        const { classes, height, size } = this.props;

        return (
        <div className={classes.content} style={{height: height? height : '75vh'}}>
            <CircularProgress className={classes.progress} size={size? size : 75} />
        </div>
        )
    }
}

Loading.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Loading);
