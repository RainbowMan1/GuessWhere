import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyDnCPP3Yk1Cyv5wJniiHz0xSIWzY_f-syY",
  authDomain: "guesswhere-16a2d.firebaseapp.com",
  databaseURL: "https://guesswhere-16a2d.firebaseio.com",
  projectId: "guesswhere-16a2d",
  storageBucket: "guesswhere-16a2d.appspot.com",
  messagingSenderId: "388313539892",
  appId: "1:388313539892:web:f34b5ec458fce47a30f161",
  measurementId: "G-B8F1W8QTDE",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
