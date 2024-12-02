// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

//Store Api Key in .env file and push it into github for security
const firebaseConfig = {
  apiKey: "AIzaSyDhIBNvZ_oD9XRMTV9bs1lCeescu0OQowk",
  authDomain: "onlineexaminationsystem-d2293.firebaseapp.com",
  projectId: "onlineexaminationsystem-d2293",
  storageBucket: "onlineexaminationsystem-d2293.appspot.com",
  messagingSenderId: "463438180090",
  appId: "1:463438180090:web:eace7957c8b33e90b72343",
  measurementId: "G-P01LTTP6CG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const GoogleProvider = new GoogleAuthProvider();
export const db=getFirestore(app);
