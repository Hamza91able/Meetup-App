import React, { Component } from "react";
import AppBar from "../AppBar/AppBar";
import Drawer from "../Drawer/Drawer";
import UserCards from "../UserCards/UserCards";
import firebase from "../../config/firebase";
import MCard from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Cards, { Card } from "react-swipe-deck";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import swal from "sweetalert";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import ListSubheader from '@material-ui/core/ListSubheader';
import MeetingRequestPopup from '../MeetingRequestPopup/MeetingRequestPopup';
import AddToCalendar from 'react-add-to-calendar';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

class Dashboard extends Component {
    state = {
        userMeetingTime: "",
        userSelectedDrinks: [],
        userLat: null,
        userLng: null,
        open: false,
        renderCards: false,
        matchedUsers: [],
        meetings: [],
        test: false,
        openPopup: false,
        meetingRequestData: null,
        meeting: null,
        openPostMeetup: false,
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handlePostMeetupOpen = () => {
        this.setState({ openPostMeetup: true });
    };

    handlePostMeetupClose = () => {
        this.setState({ openPostMeetup: false });
    };


    getUserChoices = () => {
        const dbRef = firebase.database();
        const userAuth = firebase.auth().currentUser.uid;
        const userRef = dbRef
            .ref("Users")
            .child(userAuth)
            .child("UserInformation");

        userRef
            .once("value", snap1 => {
                if (
                    snap1.val().MeetingTime !== undefined &&
                    snap1.val().SelectedDrink !== undefined
                ) {
                    this.setState(prevState => ({
                        userMeetingTime: snap1.val().MeetingTime,
                        userSelectedDrinks: snap1.val().SelectedDrink
                    }));
                }
            })
            .then(() => {
                userRef.child("UserLocation").once("value", snap => {
                    this.setState(
                        {
                            userLat: snap.val().Latitude,
                            userLng: snap.val().Longitude
                        },
                        this.getSimilarUsers
                    );
                });
            });
    };

    getSimilarUsers = () => {
        const { userLat, userLng } = this.state;
        const dbRef = firebase.database();
        const userAuth = firebase.auth().currentUser.uid;
        const similarUsersRef = dbRef.ref("Users");

        similarUsersRef.on("value", snap => {
            snap.forEach(snap2 => {
                if (snap2.ref.path.pieces_[1] !== userAuth) {
                    let otherUsersUID = snap2.ref.path.pieces_[1];
                    similarUsersRef
                        .child(otherUsersUID)
                        .child("UserInformation")
                        .child("UserLocation")
                        .once("value", snap3 => {
                            let distance = this.calcCrow(
                                userLat,
                                userLng,
                                snap3.val().Latitude,
                                snap3.val().Longitude
                            );
                            if (distance <= 5) {
                                this.checkSimilarities(otherUsersUID);
                            } else {
                                swal("No Users Found under 5 Kilo Meters");
                            }
                        });
                }
            });
        });
    };

    checkSimilarities = otherUsersUID => {
        const { userMeetingTime, userSelectedDrinks } = this.state;
        const dbRef = firebase
            .database()
            .ref("Users")
            .child(otherUsersUID)
            .child("UserInformation");
        dbRef.once("value", snap => {
            if (snap.val().SelectedDrink !== undefined) {
                let found = snap
                    .val()
                    .SelectedDrink.some(r => userSelectedDrinks.includes(r));
                if (
                    snap.val().MeetingTime.toString() === userMeetingTime.toString() ||
                    found
                ) {
                    this.setState(
                        prevState => ({
                            matchedUsers: [...prevState.matchedUsers, snap.val()]
                        }),
                        this.handleClickOpen()
                    );
                } else {
                }
            }
        });
    };

    calcCrow(lat1, lon1, lat2, lon2) {
        var R = 6371; // km
        var dLat = this.toRad(lat2 - lat1);
        var dLon = this.toRad(lon2 - lon1);
        var lat1 = this.toRad(lat1);
        var lat2 = this.toRad(lat2);

        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }

    toRad(Value) {
        return (Value * Math.PI) / 180;
    }

    setMeeting = selectedUser => {
        swal(
            `Are you sure you want to set a meeting with ${selectedUser.Nickname}`,
            {
                buttons: ["NO", "YES"]
            }
        ).then(yes => {
            if (yes) {
                swal("Select location to meet");
                this.props.showNearbyPlaces(selectedUser);
                this.handleClose();
            } else {
            }
        });
    };

    componentDidMount() {
        this.getMeetingUsers();
        this.checkMeetingRequests();
    }

    componentDidUpdate() {
        this.postMeetingPopup();
    }

    checkMeetingRequests = () => {
        const fbRef = firebase.database().ref("Users").child(firebase.auth().currentUser.uid).child("Meeting Requests");

        fbRef.on('value', snap => {
            if (snap.exists()) {
                snap.forEach(snap2 => {
                    if (snap2.val().Status === "Pending") {
                        this.renderMeetingRequestPopup(snap2.val())
                    }
                    else {
                    }
                })
            }
            else {
            }
        })
    }

    renderMeetingRequestPopup = meeting => {
        this.setState({
            openPopup: true,
            meetingRequestData: meeting
        })
    }

    emptyMeetingData = () => {
        this.setState({
            meetingRequestData: null,
        })
    }

    getMeetingUsers = () => {
        const fbRef = firebase.database().ref("Users").child(firebase.auth().currentUser.uid).child("Meetings");
        let meetings;

        fbRef.on('value', snap => {
            if (snap.exists()) {
                snap.forEach(snap2 => {
                    this.setState(
                        (prevState) => ({
                            meetings: [...prevState.meetings, snap2.val()]
                        })
                    );
                })
            }
            else {
            }
        })
    }

    closePopup = () => {
        this.setState({
            openPopup: false,
        })
    }

    constructCurrentDate = () => {
        const date = new Date();
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];
        const days = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
        ];
        const day = days[date.getDay()];
        const month = months[date.getMonth()];

        return (`${day} ${month} ${date.getDate()} ${date.getFullYear()}`);
    }

    constructCurrentTime = () => {
        const date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        return (`${hours}:${minutes}`);
    }

    postMeetingPopup = () => {
        const { meetings } = this.state;
        for (let i = 0; i < meetings.length; i++) {
            const dateOfMeet = meetings[i].DateOfMeet;
            const timeOfMeet = meetings[i].TimeOfMeet;
            const date = this.constructCurrentDate();
            const time = this.constructCurrentTime();

            if (dateOfMeet === date && time >= timeOfMeet) {
                // this.setState({
                //     meeting: meetings[i],
                //     openPostMeetup: true
                // })
            } else {
            }
        }
    }

    renderPostMeetingForm = () => {
        const { fullScreen } = this.props;

        return (
            <Dialog
                fullScreen={fullScreen}
                open={this.state.openPostMeetup}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">{"Use Google's location service?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Let Google help apps determine location. This means sending anonymous location data to
                        Google, even when no apps are running.
                        </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary">
                        Disagree
                            </Button>
                    <Button color="primary" autoFocus>
                        Agree
                            </Button>
                </DialogActions>
            </Dialog>
        );

    }

    renderMeetingUsers = () => {
        const { meetings } = this.state;

        return (
            <List component="nav"
                subheader={<ListSubheader component="div">Your Meetings</ListSubheader>}>
                {meetings.map((val, i) => {
                    const dateOfMeet = `Date of Meeting: ${val.DateOfMeet} | Time: ${val.TimeOfMeet} | Location: ${val.Location.venue.name}`
                    let event = {
                        title: `Meeting Time with ${val.Nickname}`,
                        description: dateOfMeet,
                        location: val.Location.name,
                        // startTime: '2016-09-16T20:15:00-04:00',
                        // endTime: '2016-09-16T21:45:00-04:00'
                    };

                    return (
                        <ListItem key={i}>
                            <Avatar
                                alt="??"
                                src={val.Image1}
                            >
                            </Avatar>
                            <ListItemText primary={val.Nickname} secondary={dateOfMeet} />
                            <AddToCalendar event={event} />
                            <Button style={{ marginLeft: "15px" }} variant="contained" color='primary'>STATUS: {val.Status}</Button>
                        </ListItem>
                    )
                })}
            </List>
        )
    };

    renderDialog = () => {
        const { matchedUsers } = this.state;


        return (
            <div>
                <Dialog
                    open={this.state.open}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        {"Matched Peoples"}
                    </DialogTitle>
                    <DialogContent>
                        <Cards size={[500, 450]} cardSize={[500, 450]} onEnd={() => this.action("end")}>
                            {this.state.matchedUsers.map((item, index) => (
                                <Card
                                    key={index}
                                    onSwipeLeft={() => this.action("swipe left")}
                                    onSwipeRight={() =>
                                        this.action("swipe right", matchedUsers[index])
                                    }
                                >
                                    <MCard style={{ width: "500px" }}>
                                        <CardContent>
                                            <UserCards matchedUsers={matchedUsers[index]} />
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small">Show More</Button>
                                            <Button
                                                onClick={() => this.setMeeting(matchedUsers[index])}
                                                style={{ float: "right" }}
                                                size="small"
                                            >
                                                Set Up Meeting With This Person
                                            </Button>
                                        </CardActions>
                                    </MCard>
                                </Card>
                            ))}
                        </Cards>
                    </DialogContent>
                </Dialog>
            </div>
        );
    };

    action = (swipe, selectedUser) => {
        if (swipe === "end") {
        }
        if (swipe === "swipe left") {
        }
        if (swipe === "swipe right") {
            this.setMeeting(selectedUser);
        }
    };

    render() {
        console.log(this.props.user);
        return (
            <div>
                <AppBar showProfileScreen={this.props.showProfileScreen} />
                <Drawer getUserChoices={this.getUserChoices} meetings={this.state.meetings} />
                {this.renderDialog()}
                {this.renderMeetingUsers()}
                {this.state.openPopup && <MeetingRequestPopup meetingRequestData={this.state.meetingRequestData} checkMeetingRequests={this.checkMeetingRequests} emptyMeetingData={this.emptyMeetingData} closePopup={this.closePopup} />}
                {this.state.openPostMeetup && this.renderPostMeetingForm()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.authReducers.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

Dashboard.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
};


export default connect(mapStateToProps, mapDispatchToProps)(withMobileDialog()(Dashboard));
// export default withMobileDialog()(Dashboard);
