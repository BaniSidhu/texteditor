// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // Import getStorage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQiDJMKCyGRBy3lQmbBVumFNlFF7ig6fQ",
  authDomain: "bassam-d7251.firebaseapp.com",
  projectId: "bassam-d7251",
  storageBucket: "bassam-d7251.appspot.com",
  messagingSenderId: "826610444883",
  appId: "1:826610444883:web:50494bf0b309106d84b4a6",
  measurementId: "G-JPQ83RXEZ9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app); // Initialize storage

export { storage };
