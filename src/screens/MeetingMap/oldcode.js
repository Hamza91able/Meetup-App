import { withScriptjs, withGoogleMap, GoogleMap, Marker, } from "react-google-maps"
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import firebase from '../../config/firebase';
import axios from 'axios';
import Calendar from 'react-calendar'
import TimePicker from 'rc-time-picker';

const MyMapComponent = withScriptjs(withGoogleMap((props) =>

    <GoogleMap
        defaultZoom={10}
        center={{ lat: props.lat, lng: props.lng }}
    >
        {props.venues.map(val => {
            return (
                <Marker
                    position={{ lat: val.venue.location.lat, lng: val.venue.location.lng }}
                    title={val.venue.name}
                />
            )
        })}

    </GoogleMap>
))

class MeetingMap extends Component {
    state = {
        latitude: null,
        longitude: null,
        renderMap: false,
        venues: [],
    }

    getUserCurrentPosition = () => {
        const userAuth = firebase.auth().currentUser.uid;
        const userRef = firebase.database().ref("Users").child(userAuth).child("UserInformation").child("UserLocation");

        userRef.once('value', snap => {
            snap.forEach(snap2 => {
                this.setState({
                    latitude: snap2.val().Latitude,
                    longitude: snap2.val().Longitude,
                })
            })
        })
    }

    getNearBy = () => {
        const { latitude, longitude } = this.state
        const coords = latitude + ',' + longitude;
        const endPoint = "https://api.foursquare.com/v2/venues/explore?";
        const params = {
            client_id: "1QFNXJUMXE14TJL3I2WN000QULNNPRTMUF25CYTOOUQO1DAA",
            client_secret: "LGGFAI0IPUNFLSVNKX52IDEGR0ARK0U45EOPY1JRYK4QCYG3",
            query: "drinks",
            ll: coords,
            v: "20182507",
            limit: '3'
        }

        axios.get(endPoint + new URLSearchParams(params)).then(response => {
            this.setState({
                venues: response.data.response.groups[0].items
            }, this.setState({
                renderMap: true,
            }))
        }).catch(error => {
            console.log(error);
        })
    }

    componentDidMount() {
        this.getNearBy();
    }

    componentWillMount() {
        this.getUserCurrentPosition();
    }

    renderMap() {
        const { latitude, longitude, venues } = this.state;

        return (
            <div>
                {latitude !== null && longitude !== null && <MyMapComponent
                    isMarkerShown
                    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `80%` }} />}
                    containerElement={<div style={{ height: `50vh` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    lat={latitude}
                    lng={longitude}
                    venues={venues}
                />}
            </div>
        )

    }

    render() {
        const { renderMap, } = this.state;

        return (
            <div>
                <br />
                <TextField
                    style={{ marginLeft: "15px", width: "500px" }}
                    id="standard-uncontrolled"
                    label="Search nearby places"
                    margin="normal"
                />
                {renderMap && this.renderMap()}
                Pick suitable Date:
                    <Calendar
                    minDate={new Date()}
                />
                Pick the suitable Time:
                    <TimePicker
                    use12Hours={true}
                />
            </div>

        )
    }
}

export default MeetingMap