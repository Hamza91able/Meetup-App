import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import firebase from '../../config/firebase';

class ResponsiveDialog extends React.Component {
    state = {
        open: true,
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    declineRequest = () => {
        const { meetingRequestData } = this.props;
        const fbRef = firebase.database().ref("Users").child(firebase.auth().currentUser.uid).child("Meeting Requests").child(meetingRequestData.UserUID);

        fbRef.remove().then(() => {
            const fbRef2 = firebase.database().ref("Users").child(meetingRequestData.UserUID).child("Meetings").child(firebase.auth().currentUser.uid);

            fbRef2.update({
                Status: "DENIED"
            })
        }).then(() => { this.props.closePopup() }).then(() => { this.props.checkMeetingRequests() });
        this.setState({ open: false });
    }

    acceptRequest = () => {
        const { meetingRequestData } = this.props;
        const fbRef1 = firebase.database().ref("Users").child(meetingRequestData.UserUID).child("UserInformation");

        fbRef1.once("value", snap => {
            this.setState(() => ({
                meetingUserName: snap.val().Nickname,
                meetingUserImage: snap.val().Image1,
            }), () => {
                this.saveData();
            });
        })
    }

    saveData = () => {
        const { meetingRequestData } = this.props;
        const fbRef = firebase.database().ref("Users").child(firebase.auth().currentUser.uid).child("Meetings").child(meetingRequestData.UserUID);

        fbRef.set({
            DateOfMeet: meetingRequestData.DateOfMeet,
            Image1: this.state.meetingUserImage,
            Location: meetingRequestData.Location,
            MeetingTime: meetingRequestData.MeetingTime,
            Nickname: this.state.meetingUserName,
            Status: "Accepted",
            TimeOfMeet: meetingRequestData.TimeOfMeet,
            UserUID: meetingRequestData.UserUID,
        }).then(() => {
            const fbRef2 = firebase.database().ref("Users").child(meetingRequestData.UserUID).child("Meetings").child(firebase.auth().currentUser.uid);

            fbRef2.update({
                Status: "Accepted"
            })
            console.log("ACCEPT NAHI HONA MJE NAHI HONA NAHI HONA. HONA HI NAHI HE");
        }).then(() => {
            const fbRef3 = firebase.database().ref("Users").child(firebase.auth().currentUser.uid).child("Meeting Requests").child(meetingRequestData.UserUID);
            console.log(fbRef3);
            fbRef3.remove().then(() => { this.props.closePopup() }).then(() => { this.props.checkMeetingRequests() });
        })
    }

    render() {
        const { fullScreen, meetingRequestData } = this.props;
        console.log(meetingRequestData)

        return (
            <div>

                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">{"You have pending meeting request(s)"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Card >
                                <CardActionArea>
                                    <CardMedia
                                        style={{ height: 400 }}
                                        image={meetingRequestData.Image1}
                                        title="??"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {meetingRequestData.Nickname}
                                        </Typography>
                                        <Typography component="p">
                                            Meeting Duration: {meetingRequestData.MeetingTime} minutes
                                        </Typography>
                                        <Typography component="p">
                                            Meeting Location: {meetingRequestData.Location.name}

                                        </Typography>
                                        <Typography component="p">
                                            Time(24 Hours) & Date: {meetingRequestData.TimeOfMeet} / {meetingRequestData.DateOfMeet}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Button variant="contained" color="primary">Show Directions</Button>
                                </CardActions>
                            </Card>
                        </DialogContentText>
                        <DialogActions>
                            <Button variant="contained" onClick={this.declineRequest} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.acceptRequest} variant="contained" color="primary">
                                Confirm
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

ResponsiveDialog.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(ResponsiveDialog);