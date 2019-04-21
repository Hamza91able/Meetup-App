import { withScriptjs, withGoogleMap, GoogleMap, Marker, } from "react-google-maps"
import React, { Component } from 'react';
import AppBar from '../AppBar/AppBar';
import TextField from '@material-ui/core/TextField';
import firebase from '../../config/firebase';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import DirectionMap from './../DirectionMap/DirectionMap';

class NearbyPlaces extends Component {
    state = {
        latitude: null,
        longitude: null,
        venues: [],
        searchedItem: [],
        searchQuery: "",
        showNearby: true,
        showSearchItem: false,
        selectedPlace: "",
        rawVal: '',
        openDirectionMap: false,
        locationLat: null,
        locationLng: null,
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    getUserCurrentPosition = () => {
        const userAuth = firebase.auth().currentUser.uid;
        const userRef = firebase.database().ref("Users").child(userAuth).child("UserInformation").child("UserLocation");

        userRef.once('value', snap => {
            this.setState({
                latitude: snap.val().Latitude,
                longitude: snap.val().Longitude,
            })
            snap.forEach(snap2 => {

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
            console.log(response.data.response.groups[0].items);
            this.setState({
                venues: response.data.response.groups[0].items
            })
        }).catch(error => {
            console.log(error);
        })
    }

    getSearchedItem = () => {
        const { latitude, longitude, searchQuery } = this.state
        const coords = latitude + ',' + longitude;
        const endPoint = "https://api.foursquare.com/v2/venues/search?";
        const params = {
            client_id: "1QFNXJUMXE14TJL3I2WN000QULNNPRTMUF25CYTOOUQO1DAA",
            client_secret: "LGGFAI0IPUNFLSVNKX52IDEGR0ARK0U45EOPY1JRYK4QCYG3",
            query: searchQuery,
            ll: coords,
            v: "20182507"
        }

        axios.get(endPoint + new URLSearchParams(params)).then(response => {
            console.log(response.data.response.venues);

            this.setState({
                searchedItem: response.data.response.venues,
                showNearby: false,
                showSearchItem: true,
                selectedPlace: "",
                rawVal: response.data.response.venues,
            })
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

    setSelectedPlace = (selectedPlace, rawVal) => {
        this.setState({
            selectedPlace: selectedPlace,
            rawVal: rawVal,
        })
    }

    closeDirectionMap = () => {
        this.setState({ openDirectionMap: false })
    }

    renderNearBy = () => {
        const { venues } = this.state;

        return (
            <div>
                {venues.map((val, i) => {
                    return (
                        <List key={i} component="nav">
                            <ListItem button onClick={() => this.setSelectedPlace(val.venue.name + ", " + val.venue.location.address, val)}>
                                <ListItemText primary={val.venue.name + ", " + val.venue.location.address} />
                            </ListItem>
                            <Divider />
                        </List>
                    )
                })}

            </div>
        );
    }

    renderSearchedItem = () => {
        const { searchedItem } = this.state;

        return (
            <div style={{ height: "500" }}>
                {searchedItem.map((val, i) => {
                    return (
                        <List key={i} component="nav">
                            <ListItem button onClick={() => this.setSelectedPlace(val.name + ", " + val.location.address, val)}>
                                <ListItemText primary={val.name + ", " + val.location.address} />
                            </ListItem>
                            <Divider />
                        </List>
                    )
                })}
            </div>
        );
    }

    renderTitle = () => {

        return (
            <div>
                <Paper elevation={1}>
                    <Typography variant="title" component="h3">
                        Select a place to meet
                    </Typography>
                    <Typography component="p">
                        Select from the 3 nearby places or search another.
                    </Typography>
                </Paper>
            </div>
        );
    }

    render() {
        const { showNearby, searchQuery, showSearchItem, selectedPlace, rawVal, openDirectionMap } = this.state;
        let setTxt = "Selected Place: " + selectedPlace;
        console.log(rawVal.location);

        return (
            <div>
                <AppBar />
                {openDirectionMap && <DirectionMap
                    closeDirectionMap={this.closeDirectionMap}
                    selectedLocation={rawVal}
                />}
                <br />
                {this.renderTitle()}
                <TextField
                    style={{ marginLeft: "15px" }}
                    id="outlined-uncontrolled"
                    label="Search for places"
                    margin="normal"
                    variant="outlined"
                    value={searchQuery}
                    name="searchQuery"
                    onChange={this.handleChange}
                />
                <Button onClick={this.getSearchedItem} style={{ marginTop: "25px", marginLeft: "15px" }} variant="contained" color="primary">
                    Search
                </Button>
                <Divider />
                <List component="nav">
                    <ListItem>
                        <ListItemText primary={setTxt} />
                        {selectedPlace !== "" && <Button style={{ float: 'right' }} onClick={() => this.setState({ openDirectionMap: true })} variant="contained" color="primary">
                            SHOW DIRECTIONS
                        </Button>}
                        {selectedPlace !== "" && <Button style={{ float: 'right', marginLeft: "10px" }} onClick={() => this.props.showDateTimeSelector(rawVal)} variant="contained" color="primary">
                            NEXT
                        </Button>}
                    </ListItem>
                </List>
                <Divider />
                {showNearby && this.renderNearBy()}
                {showSearchItem && this.renderSearchedItem()}
            </div>
        )
    }
}

export default NearbyPlaces