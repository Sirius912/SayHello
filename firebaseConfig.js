// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBENfvUFD3XpqU-90-dBEmin6awX3H-M4",
  authDomain: "sayhello-57cb8.firebaseapp.com",
  projectId: "sayhello-57cb8",
  storageBucket: "sayhello-57cb8.firebasestorage.app",
  messagingSenderId: "836578251193",
  appId: "1:836578251193:web:263b876fc3c6c886d1e668",
  measurementId: "G-VCP3TZRNVV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);