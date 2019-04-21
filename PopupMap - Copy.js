/* eslint-disable no-undef */
/* global google */

import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from "../../../node_modules/react-google-maps"
import React, {
    Component
} from 'react';

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
        defaultZoom={12.5}
        center={{ lat: props.coords.latitude, lng: props.coords.longitude }
            // (!props.selectedLocation && { lat: props.coords.latitude, lng: props.coords.longitude })
            // || (!props.searchFlag && ({ lat: props.selectedLocation.venue.location.lat, lng: props.selectedLocation.venue.location.lng }))
            // || ({ lat: props.selectedLocation.location.lat, lng: props.selectedLocation.location.lng })
        }>
        {
            !props.directions &&
            <Marker
                position={{ lat: props.coords.latitude, lng: props.coords.longitude }}
                icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
            />
        }
        <br />
        <button style={{display:"block" , margin: "0 auto"}} className={"btn btn-default"}  onClick={() => { props.getDirections((!props.directions && "get directions") || "back") }}>
            {(!props.directions && "get directions") || "back"}
        </button>
        {props.directions &&
            <DirectionsRenderer directions={props.directions} />}
    </GoogleMap>
))

class PopupMap extends Component {
    constructor(props) {
        super(props)

        this.state = {
            // coords: null,
            // selectedLocation: false,
            directions: null,
        };
    }

   

    render() {
        const { directions } = this.state;
        const coords = this.props.coords;
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
                    searchFlag={searchFlag}
                    directions={directions}
                    getDirections={this.getDirections}
                />}
            </div>
        )
    }
}

export default PopupMap;