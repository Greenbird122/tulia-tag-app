// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-wn4pMXrk7GpnTKEUELY290qpQ0kIQgI",
  authDomain: "tulia-tag.firebaseapp.com",
  projectId: "tulia-tag",
  storageBucket: "tulia-tag.firebasestorage.app",
  messagingSenderId: "488585644867",
  appId: "1:488585644867:web:ec51b24cb2b81ad99afdf6",
  measurementId: "G-G7YEYBE427"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);