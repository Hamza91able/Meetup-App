import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const styles = theme => ({
    root: {
        maxWidth: 400,
        flexGrow: 1,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        height: 50,
        paddingLeft: theme.spacing.unit * 4,
        backgroundColor: theme.palette.background.default,
    },
    img: {
        height: 255,
        maxWidth: 400,
        overflow: 'hidden',
        display: 'block',
        width: '100%',
    },
});

class TextMobileStepper extends React.Component {
    state = {
        activeStep: 0,
        currentImage: this.props.matchedUsers.Image1,
    };

    handleNext = () => {
        this.setState(prevState => ({
            activeStep: prevState.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(prevState => ({
            activeStep: prevState.activeStep - 1,
        }));
    };

    render() {
        const { classes, theme, matchedUsers } = this.props;
        const { activeStep } = this.state;
        const maxSteps = 3;

        return (
            <div className={classes.root}>
                <Paper square elevation={0} className={classes.header}>
                    <Typography variant="subtitle1">{matchedUsers.Nickname.toUpperCase()}</Typography>
                </Paper>
                {activeStep === 0 ? <img
                    className={classes.img}
                    src={matchedUsers.Image1}
                    alt="???"
                /> : activeStep === 1 ? <img
                    className={classes.img}
                    src={matchedUsers.Image2}
                    alt="???"
                /> : <img
                            className={classes.img}
                            src={matchedUsers.Image3}
                            alt="???"
                        />}
                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    className={classes.mobileStepper}
                    nextButton={
                        <Button size="small" onClick={this.handleNext} disabled={activeStep === maxSteps - 1}>
                            Next Image
                            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
                            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                            Previous Image
                        </Button>
                    }
                />
            </div>
        );
    }
}

TextMobileStepper.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TextMobileStepper);