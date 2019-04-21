import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AppBar from '../AppBar/AppBar';
import TextField from '@material-ui/core/TextField';
import './ProfileScreen.css';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import { isMobile } from "react-device-detect";
import Beverages from '../Beverages/Beverages';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import axios from 'axios';
import firebase from '../../config/firebase';

const styles = theme => ({
    button: {
        marginRight: theme.spacing.unit,
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    connectorActive: {
        '& $line': {
            borderColor: theme.palette.secondary.main,
        },
    },
    connectorCompleted: {
        '& $line': {
            borderColor: theme.palette.primary.main,
        },
    },
    image: {
        position: 'relative',
        height: 200,
        [theme.breakpoints.down('xs')]: {
            width: '100% !important', // Overrides inline-style
            height: 100,
        },
        '&:hover, &$focusVisible': {
            zIndex: 1,
            '& $imageBackdrop': {
                opacity: 0.15,
            },
            '& $imageMarked': {
                opacity: 0,
            },
            '& $imageTitle': {
                border: '4px solid currentColor',
            },
        },
    },
    focusVisible: {},
    imageButton: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
    },
    imageSrc: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
    },
    imageBackdrop: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.common.black,
        opacity: 0.4,
        transition: theme.transitions.create('opacity'),
    },
    imageTitle: {
        position: 'relative',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme.spacing.unit + 6}px`,
    },
    imageMarked: {
        height: 3,
        width: 18,
        backgroundColor: theme.palette.common.white,
        position: 'absolute',
        bottom: -2,
        left: 'calc(50% - 9px)',
        transition: theme.transitions.create('opacity'),
    },
    line: {},
    input: {
        display: 'none',
    },
});

class ProfileScreen extends Component {

    state = {
        activeStep: 0,
        nickname: '',
        phoneNo: '',
        images: [
            {
                url: "",
                title: 'UPLOAD PICTURE',
                width: '33.33%',
                userPic1: 'userPic1',
            },
            {
                url: "",
                title: 'UPLOAD PICTURE',
                width: '33.33%',
                userPic2: 'userPic2',
            },
            {
                url: "",
                title: 'UPLOAD PICTURE',
                width: '33.33%',
                userPic3: 'userPic3',
            }
        ],
        selectedDrinks: [],
        meetingTime: null,
        userPic1: '',
        userPic2: '',
        userPic3: '',
        selectedIndex: null,
        disableButton: true,
    };

    getSteps() {
        return ['Enter Your Details', 'Upload Your Pictures', 'Select Your Preference'];
    }

    getStepContent(step) {
        switch (step) {
            case 0:
                return (
                    <div>
                        {this.renderCase0()}
                    </div>
                )
            case 1:
                return (
                    <div>
                        {this.renderCase1()}
                    </div>
                )
            case 2:
                return (
                    <div>
                        {this.renderCase2()}
                    </div>
                );
            default:
                return 'Unknown step';
        }
    }

    handleNext = () => {
        this.setState(state => ({
            activeStep: state.activeStep + 1,
            disableButton: true,
        }));
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
            disableButton: false,
        }));
    };

    saveInfoToDB = () => {
        if (firebase.auth().currentUser !== null) {
            const { nickname, phoneNo, images, selectedDrinks, meetingTime } = this.state;
            const userInfoDBRef = firebase.database().ref("Users").child(firebase.auth().currentUser.uid).child("UserInformation");
            console.log(meetingTime)
            userInfoDBRef.set({
                Nickname: nickname,
                PhoneNo: phoneNo,
                Image1: images[0].url,
                Image2: images[1].url,
                Image3: images[2].url,
                SelectedDrink: selectedDrinks,
                MeetingTime: meetingTime,
                UserUID: firebase.auth().currentUser.uid,
            }).then(() => {
                this.props.showMaps();
            })
        }
    };

    handleInputButton = () => {
        if (isMobile) {
            this.inputElement.click();
        }
    }

    fileSelectHandler = event => {
        // this.setState({
        //     url: event.target.files[0],
        // })
        this.savePictureToDB(this.state.selectedIndex, event.target.files[0]);
    }

    getSelectedDrinks(selectedDrinks) {
        if (!this.state.selectedDrinks.includes(selectedDrinks))
            this.setState(previousState => ({
                selectedDrinks: [...previousState.selectedDrinks, selectedDrinks]
            }));

        this.handleFinishButton();
    }

    handleDelete(value) {
        this.setState({
            selectedDrinks: this.state.selectedDrinks.filter(function (selectedDrinks) {
                return selectedDrinks !== value
            })
        });
        this.handleFinishButton();
    }

    handleFinishButton = () => {
        setTimeout(() => {
            if (this.state.meetingTime !== null && this.state.selectedDrinks.length !== 0) {
                this.setState({
                    disableButton: false,
                })
            }
            if (this.state.meetingTime === '' || this.state.selectedDrinks.length === 0) {
                this.setState({
                    disableButton: true,
                })
            }
        }, 100);

    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
        this.handleFinishButton();
    };

    saveNamePhone = event => {
        this.setState({
            [event.target.name]: event.target.value,
        })
        setTimeout(() => {
            if (this.state.nickname && this.state.phoneNo !== '') {
                this.setState({
                    disableButton: false,
                })
            }
        }, 100)
    }

    savePictureToDB = (index, pic) => {
        let fd = new FormData();
        const date = Date.now();

        if (index === 0) {
            this.setState({
                userPic1: pic
            })
            setTimeout(() => {
                fd.append('image', this.state.userPic1, date + this.state.userPic1.name)
            }, 100)
        }
        else if (index === 1) {
            this.setState({
                userPic2: pic
            })
            setTimeout(() => {
                fd.append('image', this.state.userPic2, date + this.state.userPic2.name)
            }, 100)
        }
        else if (index === 2) {
            this.setState({
                userPic3: pic
            })
            setTimeout(() => {
                fd.append('image', this.state.userPic3, date + this.state.userPic3.name)
            }, 100)
        }

        setTimeout(() => {
            this.initRequest(fd);
        }, 100);
    }

    initRequest = (fd) => {
        axios.post('https://us-central1-meet-up-app-a64cb.cloudfunctions.net/uploadImage', fd, {
            onUploadProgress: progressEvent => {
                console.log('Upload Progess: ' + Math.round(progressEvent.loaded / progressEvent.total * 100) + '%');
            }
        }).then((res) => {
            this.setThumbnail(res.data.link)
        })
    }

    setThumbnail = (picLink) => {
        var images = this.state.images[this.state.selectedIndex]
        images.url = picLink
        this.forceUpdate();
        setTimeout(() => {
            this.handlePictureNextButton();
        }, 100);
    }

    handlePictureNextButton = () => {
        const { images } = this.state;

        if (images[0].url !== '' && images[1].url !== '' && images[2].url !== '') {
            this.setState({
                disableButton: false,
            })
        }
    }

    renderCase0 = () => {
        return (
            <div>
                <Paper elevation={1} style={{ marginTop: "80px" }}>
                    <br />
                    <TextField
                        style={{ marginLeft: "20px", width: "80%" }}
                        id="standard-with-placeholder"
                        label="Enter Nickname"
                        placeholder="kenny"
                        margin="normal"
                        name="nickname"
                        onChange={this.saveNamePhone}
                        value={this.state.nickname}
                    />
                    <br />
                    <TextField
                        style={{ marginLeft: "20px", width: "80%" }}
                        id="standard-with-placeholder"
                        label="Enter Phone Number"
                        placeholder="12345678912"
                        margin="normal"
                        type="number"
                        name="phoneNo"
                        onChange={this.saveNamePhone}
                        value={this.state.phoneNo}
                    />
                    <br />
                    <br />
                </Paper>
            </div>
        )
    }

    renderCase1() {
        const { classes } = this.props;
        const { images } = this.state;

        setTimeout(() => {
            this.handlePictureNextButton();
        }, 100);

        return (
            <div style={{ marginTop: "50px", width: "200%", margin: "100px 0 0 -200px" }}>
                {images.map((image, index) => (
                    <ButtonBase
                        focusRipple
                        key={index}
                        className={classes.image}
                        focusVisibleClassName={classes.focusVisible}
                        style={{
                            width: image.width,
                        }}
                        onClick={this.handleInputButton}
                    >
                        <span
                            className={classes.imageSrc}
                            style={{
                                backgroundImage: `url(${image.url})`,
                            }}
                        />

                        <span className={classes.imageBackdrop} />
                        <span className={classes.imageButton}>
                            <Typography
                                component="span"
                                variant="subtitle1"
                                color="inherit"
                                className={classes.imageTitle}
                            >
                                <input
                                    ref={input => this.inputElement = input}
                                    accept="image/*"
                                    className={classes.input}
                                    id="flat-button-file"
                                    multiple
                                    type="file"
                                    onChange={this.fileSelectHandler}
                                />
                                <label htmlFor="flat-button-file">
                                    <Button onClick={() => this.setState({ selectedIndex: index })} component="span" className={classes.button}>
                                        {image.title}
                                    </Button>
                                </label>
                                <span className={classes.imageMarked} />
                            </Typography>
                        </span>
                    </ButtonBase>
                ))}
            </div>
        );
    }

    renderCase2() {
        const { selectedDrinks } = this.state;
        this.handleFinishButton();
        return (
            <div>
                <Typography variant="h5" component="h3" style={{ marginTop: "50px" }}>
                    Select Beverages
                </Typography>
                <Beverages selectedDrinks={this.getSelectedDrinks.bind(this)} />
                {
                    selectedDrinks.map((value, index) => {
                        return (
                            <Chip
                                key={index}
                                style={{ marginRight: "5px" }}
                                label={value}
                                onDelete={() => this.handleDelete(value)}
                                color="primary"
                                onClick={() => this.handleFinishButton()}
                            />
                        )
                    })
                }
                <br />
                <br />
                <FormControl>
                    <Select
                        value={this.state.meetingTime}
                        onChange={this.handleChange}
                        name="meetingTime"
                        displayEmpty
                    >
                        <MenuItem value="" disabled>
                            Time
                        </MenuItem>
                        <MenuItem value={20}>20 Minutes</MenuItem>
                        <MenuItem value={60}>60 Minutes</MenuItem>
                        <MenuItem value={120}>120 Minutes</MenuItem>
                    </Select>
                    <FormHelperText>Select Meeting Time</FormHelperText>
                </FormControl>
            </div>
        )
    }

    renderStrepper() {
        const { classes } = this.props;
        const { activeStep } = this.state;
        const steps = this.getSteps();

        return (
            <Stepper
                activeStep={activeStep}
                connector={
                    <StepConnector
                        classes={{
                            active: classes.connectorActive,
                            completed: classes.connectorCompleted,
                            line: classes.line,
                        }}
                    />
                }
            >
                {steps.map(label => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        )
    }

    renderFormControls() {
        const { classes } = this.props;
        const { activeStep, disableButton } = this.state;
        const steps = this.getSteps();

        return (
            <div className="formControls">
                {activeStep === steps.length ? (
                    <div>
                        <Typography className={classes.instructions} style={{ marginTop: "100px", marginLeft: "30px" }}>
                            All steps completed - you&quot;re finished
                            </Typography>
                        <Button color="primary" onClick={this.saveInfoToDB} className={classes.button}>
                            NEXT
                        </Button>
                    </div>
                ) : (
                        <div>
                            <Typography className={classes.instructions}>{this.getStepContent(activeStep)}</Typography>
                            <div>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={this.handleBack}
                                    className={classes.button}
                                >
                                    Back
                                    </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleNext}
                                    className={classes.button}
                                    disabled={disableButton}
                                >
                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </Button>
                            </div>
                        </div>
                    )}
            </div>
        )
    }

    render() {

        return (
            <div>
                <AppBar />
                {this.renderStrepper()}
                {this.renderFormControls()}
            </div>
        );
    }
}

ProfileScreen.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(ProfileScreen);
