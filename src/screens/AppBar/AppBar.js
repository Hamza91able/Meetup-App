import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import firebase from '../../config/firebase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import swal from "sweetalert";
import { removeUser } from '../../Redux/actions/authActions'
import { connect } from 'react-redux'

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
};

class SimpleAppBar extends Component {

    state = {
        anchorEl: null,
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleLogout = () => {
        firebase.auth().signOut()
            .then(() => {
                swal("Logged Out");
                this.props.removeUser();
            })
            .catch(error => {
                swal("" + error);
            });
    }

    handleEditProfile = () => {
        this.props.showProfileScreen();
    }

    render() {

        const { classes } = this.props;
        const { anchorEl } = this.state;
        const user = firebase.auth().currentUser;
        let photoURL = '';

        if (user != null) {
            user.providerData.forEach(profile => {
                // console.log("Sign-in provider: " + profile.providerId);
                // console.log("  Provider-specific UID: " + profile.uid);
                // console.log("  Name: " + profile.displayName);
                // console.log("  Email: " + profile.email);
                // console.log("  Photo URL: " + profile.photoURL);
                photoURL = profile.photoURL;
            });
        }

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            Meetup App
                        </Typography>
                        < Avatar
                            alt="??"
                            src={photoURL}
                            onClick={this.handleClick}
                        />
                        {anchorEl && <div>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={this.handleClose}
                            >
                                <MenuItem onClick={this.handleEditProfile}>Edit Profile</MenuItem>
                                <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

SimpleAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        user: state.authReducers.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        removeUser: () => dispatch(removeUser())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SimpleAppBar));