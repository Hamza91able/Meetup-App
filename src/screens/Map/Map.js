import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/icons/Send';
import { withStyles } from "@material-ui/core";
import firebase from '../../config/firebase';

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={14}
        center={{ lat: props.coords.latitude, lng: props.coords.longitude }}
    >
        {props.isMarkerShown &&
            <Marker
                position={{ lat: props.coords.latitude, lng: props.coords.longitude }}
                draggable={true}
                onDragEnd={position => {
                    props.updateCoords({ latitude: position.latLng.lat(), longitude: position.latLng.lng() })
                }}
            />}
    </GoogleMap>
))

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
        float: 'right'
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
});

class Maps extends Component {
    constructor() {
        super()

        this.state = {
            coords: null
        };

        this.updateCoords = this.updateCoords.bind(this);
    }

    componentDidMount() {
        this.setPosition();
    }

    setPosition() {
        navigator.geolocation.getCurrentPosition(position => {
            this.setState({ coords: position.coords })
        });
    }

    updateCoords({ latitude, longitude }) {
        this.setState({ coords: { latitude, longitude } })
    }

    renderDialog() {
        return (
            <div>
                <Paper elevation={1}>
                    <Typography variant="h5" component="h3">
                        Select Your Location
                </Typography>
                    <Typography component="p">
                        Drag Marker To Set Accurate Location.
                </Typography>
                </Paper>
            </div>
        );
    }

    saveInfoToDB = () => {
        const { coords } = this.state;
        console.log(coords.latitude, coords.longitude);

        const userDBRef = firebase.database().ref("Users").child(firebase.auth().currentUser.uid).child("UserInformation").child("UserLocation");
        userDBRef.set({
            Latitude: coords.latitude,
            Longitude: coords.longitude
        }).then(() => {
            console.log("SUCCESS");
            this.props.showDashboard();
        })
    }

    renderButton() {
        const { classes } = this.props;

        return (
            <Button onClick={this.saveInfoToDB} variant="contained" color="primary" className={classes.button}>
                Save
            <Icon className={classes.rightIcon}>send</Icon>
            </Button>
        )
    }

    render() {
        const { coords } = this.state;


        return (
            <div>
                {this.renderDialog()}
                {coords && <MyMapComponent
                    isMarkerShown
                    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `80vh` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    coords={coords}
                    updateCoords={this.updateCoords}
                />}
                {this.renderButton()}
            </div>
        )
    }
}

Maps.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Maps);