/* eslint-disable no-undef */
/* global google */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from "react-google-maps"
import swal from 'sweetalert';

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={12.5}
        center={{ lat: props.coords.latitude, lng: props.coords.longitude }
        }>
        {
            !props.directions &&
            <Marker
                position={{ lat: props.coords.latitude, lng: props.coords.longitude }}
                icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
            />
        }
        <br />
        <Button variant="contained" color="primary" style={{ display: "block", margin: "0 auto" }} className={"btn btn-default"} onClick={() => { props.getDirections((!props.directions && "get directions") || "back") }}>
            {(!props.directions && "get directions") || "back"}
        </Button>
        {props.directions &&
            <DirectionsRenderer directions={props.directions} />}
    </GoogleMap>
))

class DirectionMap extends React.Component {

    constructor() {
        super();

        this.state = {
            coords: null,
            open: true,
            directions: null,
        };
    }

    componentDidMount() {
        this.setPosition();
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
        this.props.closeDirectionMap();
    };

    setPosition() {
        navigator.geolocation.getCurrentPosition(position => {
            console.log(position.coords);
            this.setState({ coords: position.coords })
        });
    }

    getDirections = (e) => {

        const { coords } = this.state;
        const searchFlag = this.props.searchFlag;
        const selectedLocation = this.props.selectedLocation;
        const DirectionsService = new google.maps.DirectionsService();

        if (e !== "back") {
            DirectionsService.route({

                origin: new google.maps.LatLng(coords.latitude, coords.longitude),
                destination: new google.maps.LatLng((!searchFlag && selectedLocation.venue ? selectedLocation.venue.location.lat : selectedLocation.location.lat) || selectedLocation.location.lat, (!searchFlag && selectedLocation.venue ? selectedLocation.venue.location.lng : selectedLocation.location.lng) || selectedLocation.location.lng),

                travelMode: google.maps.TravelMode.DRIVING,
            }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    this.setState({
                        directions: result,
                    });
                } else {
                    swal("Sorry! Can't calculate directions!")
                }
            });
        }
        else {
            this.handleClose()
        }
    }


    renderMap = () => {
        const { coords } = this.state;
        const { directions } = this.state;
        const searchFlag = this.props.searchFlag;

        return (
            <div>
                {coords && <MyMapComponent
                    isMarkerShown
                    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `70vh` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    coords={coords}
                    updateCoords={this.updateCoords}
                    searchFlag={searchFlag}
                    directions={directions}
                    getDirections={this.getDirections}
                />}
            </div>
        )
    }

    render() {
        const { fullScreen, selectedLocation } = this.props;
        console.log(this.props.selectedLocation);

        return (
            <Dialog
                maxWidth={"false"}
                fullScreen={fullScreen}
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="responsive-dialog-title"
                style={{
                    width: "100vw",
                }}
            >
                <DialogTitle id="responsive-dialog-title">{selectedLocation.venue ? `Directions: ${selectedLocation.venue.name}`: `Directions: ${selectedLocation.name}`}</DialogTitle>
                <DialogContent style={{
                    width: 800,
                    height: 700,
                }}>
                    {this.renderMap()}
                </DialogContent>
            </Dialog>
        );
    }
}

DirectionMap.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(DirectionMap);