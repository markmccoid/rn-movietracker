import firebase from "firebase";
import "@firebase/firestore";
import Constants from "expo-constants";

const { apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId } =
  Constants.manifest.extra;
// const envData = require("../../env.json");
//import env from "../env.js";
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};
// var firebaseConfig = {
//   apiKey: envData.apiKey,
//   authDomain: envData.authDomain,
//   databaseURL: envData.databaseURL,
//   projectId: envData.projectId,
//   storageBucket: envData.storageBucket,
//   messagingSenderId: envData.messagingSenderId,
//   appId: envData.appId,
// };
// Initialize Firebase
let Firebase = firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore();
export default Firebase;

//TO logout a user:
// Firebase.auth.signOut().then()
