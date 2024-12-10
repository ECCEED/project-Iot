// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyCi9Wg9fpfBWRvd-SHFOcjATTb0AfABepI",
  authDomain: "iot-project-d7202.firebaseapp.com",
  projectId: "iot-project-d7202",
  storageBucket: "iot-project-d7202.firebasestorage.app",
  messagingSenderId: "492590513874",
  appId: "1:492590513874:web:885c9884a4e1b24a84770b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export { app, auth };
