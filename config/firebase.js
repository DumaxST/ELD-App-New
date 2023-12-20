// Import the functions you need from the SDKs you need
// import * as firebase from "firebase/app";
import { initializeApp } from 'firebase/app';
import { getAuth} from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebase_app = {
  apiKey: "AIzaSyD7ybUYP7u9Bd-PBFJ1UHDtblyK1Y-ieEk",
  authDomain: "dumax-eld.firebaseapp.com",
  databaseURL: "https://dumax-eld-default-rtdb.firebaseio.com",
  projectId: "dumax-eld",
  storageBucket: "dumax-eld.appspot.com",
  messagingSenderId: "254379584379",
  appId: "1:254379584379:web:6a19f18b23d839c27bebde",
  measurementId: "G-05S4SKEGTL",
};

const app = initializeApp(firebase_app);
const auth = getAuth(app);


export { app, auth };
