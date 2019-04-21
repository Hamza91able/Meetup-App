import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/icons/Send';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    button: {
        margin: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
});

function PaperSheet(props) {
    const { classes, getUserChoices, meetings } = props;

    return (
        <div>
            <Paper className={classes.root} elevation={1}>
                <Typography variant="h5" component="h3">
                    {meetings ? "Start a new meeting..." : "You haven’t done any meeting yet!"}
                </Typography>
                <Typography component="p">
                    {meetings ? "Start finding people around you..." : "Try creating a new meeting!"}
                </Typography>

                <Button onClick={getUserChoices} variant="contained" color="primary" className={classes.button}>
                    Set a meeting
                    <Icon className={classes.rightIcon}>send</Icon>
                </Button>
            </Paper>
        </div>
    );
}

PaperSheet.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaperSheet);