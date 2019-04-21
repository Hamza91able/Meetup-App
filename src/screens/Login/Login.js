import React, { Component } from 'react';
import BackgroundImage from '../../images/background/background.png';
import './Login.css';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import firebase from '../../config/firebase';
import { updateUser } from '../../Redux/actions/authActions'
import { connect } from 'react-redux'

const provider = new firebase.auth.FacebookAuthProvider();

class Login extends Component {

    facebookLogin = () => {
        firebase.auth().signInWithPopup(provider).then(result => {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            // var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            if (user) {
                this.props.updateUser(user);
            }
            // ...
        }).catch(function (error) {
            // Handle Errors here.
            // var errorCode = error.code;
            // var errorMessage = error.message;
            // // The email of the user's account used.
            // var email = error.email;
            // // The firebase.auth.AuthCredential type that was used.
            // var credential = error.credential;
            console.log(error);
            alert(error);
            // ...
        });
    }

    renderLogin() {
        return (
            <div id="outPopUp">
                <Paper style={{ height: "120%" }} elevation={24}>
                    <br />
                    <Typography style={{
                        textAlign: "center",
                        fontStyle: "italic",
                        fontWeight: "bold",
                    }} variant="title">
                        MeetUp App
                    </Typography>
                    <br />
                    <Typography variant="headline" style={{
                        textAlign: "center"
                    }}>
                        GET STARTED
                    </Typography>
                    <br />
                    <Typography component="p">
                        <Button onClick={this.facebookLogin} style={{
                            marginLeft: "27%"
                        }} variant="extendedFab" aria-label="Delete" color="primary">
                            Login With Facebook
                        </Button>
                    </Typography>
                </Paper>
            </div>
        )
    }

    render() {
        console.log(this.props.user);
        
        return (
            <div style={{ backgroundImage: `url(${BackgroundImage})`, height: "100vh" }}>
                {this.renderLogin()}
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
        updateUser: (user) => dispatch(updateUser(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)