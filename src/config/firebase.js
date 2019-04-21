import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyARYXPzm9FGSTvt1Xe_msOvGjBosc4tKa4",
    authDomain: "meet-up-app-a64cb.firebaseapp.com",
    databaseURL: "https://meet-up-app-a64cb.firebaseio.com",
    projectId: "meet-up-app-a64cb",
    storageBucket: "meet-up-app-a64cb.appspot.com",
    messagingSenderId: "405840442379"
};
firebase.initializeApp(config);

export default firebase;