import React, { Component } from "react";
import "./App.css";
import Login from "./screens/Login/Login";
import ProfileScreen from "./screens/ProfileScreen/ProfileScreen";
import Maps from "./screens/Map/Map";
import Dashboard from "./screens/Dashboard/Dashboard";
import firebase from "./config/firebase";
import NearbyPlaces from "./screens/MeetingMap/NearbyPlaces";
import DateTimeSelector from "./screens/DateTimeSelector/DateTimeSelector";
import store from './Redux/store';
import { Provider } from 'react-redux';

class App extends Component {
  state = {
    showLogin: true,
    showProfileScreen: false,
    showMaps: false,
    showDashboard: false,
    showNearbyPlaces: false,
    showDateTimeSelector: false,
    selectedUser: "",
    rawVal: ""
  };

  showProfileScreen() {
    this.setState({
      showProfileScreen: true,
      showLogin: false,
      showDashboard: false
    });
  }

  showMaps() {
    this.setState({
      showProfileScreen: false,
      showMaps: true
    });
  }

  showDashboard() {
    this.setState({
      showMaps: false,
      showDashboard: true,
      showLogin: false,
      showProfileScreen: false,
      showNearbyPlaces: false,
      showDateTimeSelector: false,
      selectedUser: "",
      rawVal: ""
    });
  }

  logoutUser() {
    this.setState({
      showLogin: true,
      showProfileScreen: false,
      showMaps: false,
      showDashboard: false,
      showNearbyPlaces: false,
      showDateTimeSelector: false,
      selectedUser: "",
      rawVal: ""
    })
  }

  checkUserStatus() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const userUID = firebase.auth().currentUser.uid;
        firebase
          .database()
          .ref(`Users/${userUID}/UserInformation`)
          .once("value", snapshot => {
            if (snapshot.exists()) {
              this.showDashboard();
            } else {
              this.showProfileScreen();
            }
          });
      } else {
        this.logoutUser();
      }
    });
  }

  showNearbyPlaces(selectedUser) {
    this.setState({
      showNearbyPlaces: true,
      showDashboard: false,
      selectedUser: selectedUser
    });
  }

  showDateTimeSelector(rawVal) {
    this.setState({
      showDateTimeSelector: true,
      showNearbyPlaces: false,
      rawVal: rawVal
    });
  }

  componentWillMount() {
    this.checkUserStatus();
  }

  render() {
    const {
      showLogin,
      showDashboard,
      showProfileScreen,
      showMaps,
      showNearbyPlaces,
      showDateTimeSelector,
      selectedUser,
      rawVal
    } = this.state;

    return (
      <Provider store={store}>
        <div>
          {showLogin && (
            <Login showProfileScreen={this.showProfileScreen.bind(this)} />
          )}
          {showProfileScreen && (
            <ProfileScreen showMaps={this.showMaps.bind(this)} />
          )}
          {showMaps && <Maps showDashboard={this.showDashboard.bind(this)} />}
          {showDashboard && (
            <Dashboard showNearbyPlaces={this.showNearbyPlaces.bind(this)} showProfileScreen={this.showProfileScreen.bind(this)} />
          )}
          {showNearbyPlaces && (
            <NearbyPlaces
              showDateTimeSelector={this.showDateTimeSelector.bind(this)}
            />
          )}
          {showDateTimeSelector && (
            <DateTimeSelector showDashboard={this.showDashboard.bind(this)} selectedUser={selectedUser} rawVal={rawVal} />
          )}
        </div>
      </Provider>
    );
  }
}

export default App;
