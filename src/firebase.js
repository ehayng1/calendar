// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUAgE3XLD29tmvJgGy9x5Szdf4_ukiixY",
  authDomain: "calendar-3b4bc.firebaseapp.com",
  projectId: "calendar-3b4bc",
  storageBucket: "calendar-3b4bc.appspot.com",
  messagingSenderId: "639661222974",
  appId: "1:639661222974:web:6c5a380b144671d4d6f56f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
