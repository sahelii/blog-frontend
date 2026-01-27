import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 

// Use environment variables if available, otherwise fallback to hardcoded values
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBPCzqFJ-_srtcOT3AHQqkhdoSMosXld_4",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "blog-app-150fc.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "blog-app-150fc",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "blog-app-150fc.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "71070261683",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:71070261683:web:88a4b6a95da4801e20abc6",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-7E3DRL2WJB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in production
let analytics = null;
if (process.env.NODE_ENV === 'production') {
  analytics = getAnalytics(app);
}

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth, analytics };
