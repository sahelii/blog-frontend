
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyBPCzqFJ-_srtcOT3AHQqkhdoSMosXld_4",
  authDomain: "blog-app-150fc.firebaseapp.com",
  projectId: "blog-app-150fc",
  storageBucket: "blog-app-150fc.appspot.com",
  messagingSenderId: "71070261683",
  appId: "1:71070261683:web:88a4b6a95da4801e20abc6",
  measurementId: "G-7E3DRL2WJB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
