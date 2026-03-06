// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLrSGHxxGo73I4fuyfPAmKxYZpDGXHLZY",
  authDomain: "think-ai-335e7.firebaseapp.com",
  projectId: "think-ai-335e7",
  storageBucket: "think-ai-335e7.firebasestorage.app",
  messagingSenderId: "1026319134350",
  appId: "1:1026319134350:web:1290d4a037ced0a57fe3df",
  measurementId: "G-TSH44S1CXF"
};

// Initialize Firebase
const app = getApps().length ? getApp() :
 initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export { db };