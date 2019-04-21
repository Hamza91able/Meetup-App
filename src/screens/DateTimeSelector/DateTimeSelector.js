import React, { Component } from 'react';
import AppBar from '../AppBar/AppBar';
import Calendar from 'react-calendar'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TimePicker from 'react-time-picker'
import Button from '@material-ui/core/Button';
import firebase from "../../config/firebase";
import swal from 'sweetalert';

class App extends Component {

    state = {
        date: new Date(),
        updatedDate: '10:00',
        time: '10:00',
    }

    onChange = date => {
        let onlyDate = date.toDateString();
        this.setState({ updatedDate: onlyDate, date })
    }

    onChangeTime = time => this.setState({ time })

    renderTitle = () => {

        return (
            <div>
                <Paper elevation={1}>
                    <Typography variant="title" component="h3">
                        Select Date and Time
                    </Typography>
                    <Typography component="p">
                        Select Date and Time from Calendar
                    </Typography>
                </Paper>
            </div>
        );
    }

    saveDataDB = () => {
        const { selectedUser, rawVal } = this.props;
        const { updatedDate, time } = this.state;
        console.log(updatedDate);
        console.log(time)
        const firebaseUser = firebase.auth().currentUser.uid;
        const firebaseDB = firebase.database();

        const firebaseDBRef = firebaseDB.ref("Users").child(firebaseUser).child("Meetings").child(selectedUser.UserUID);
        const firebaseDBRef2 = firebaseDB.ref("Users").child(selectedUser.UserUID).child("Meeting Requests").child(firebaseUser);

        firebaseDBRef.set({
            Nickname: selectedUser.Nickname,
            MeetingTime: selectedUser.MeetingTime,
            UserUID: selectedUser.UserUID,
            Image1: selectedUser.Image1,
            Image2: selectedUser.Image2,
            Image3: selectedUser.Image3,
            DateOfMeet: updatedDate,
            TimeOfMeet: time,
            Location: rawVal,
            Status: "Pending",
        }).then(() => {
            firebaseDBRef2.set({
                Nickname: selectedUser.Nickname,
                MeetingTime: selectedUser.MeetingTime,
                UserUID: firebaseUser,
                Image1: selectedUser.Image1,
                Image2: selectedUser.Image2,
                Image3: selectedUser.Image3,
                DateOfMeet: updatedDate,
                TimeOfMeet: time,
                Location: rawVal,
                Status: "Pending",
            })
        }).then(() => {
            swal("Notification Sent");
        }).then(() => {
            this.props.showDashboard();
        })
    }

    render() {

        return (
            <div>
                <AppBar />
                <br />
                {this.renderTitle()}
                <br />
                <div style={{ marginLeft: "50px" }}>
                    <Calendar
                        onChange={this.onChange}
                        value={this.state.date}
                        minDate={new Date()}
                    />
                    <br />
                    <TimePicker
                        onChange={this.onChangeTime}
                        value={this.state.time}
                    />
                    <Button onClick={this.saveDataDB} style={{ marginLeft: "15px" }} variant="contained" color="primary">
                        SEND MEETING REQUEST
                    </Button>
                </div>
            </div>
        );
    }
}

export default App;
