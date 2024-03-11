import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDXZBjrWEXvWjrLMxl8hHoMLHWXIAFCY-8",
  authDomain: "sc2006mapapp.firebaseapp.com",
  projectId: "sc2006mapapp",
  storageBucket: "sc2006mapapp.appspot.com",
  messagingSenderId: "623622689953",
  appId: "1:623622689953:web:880d2ad2c3aa03394b8ce0",
  measurementId: "G-FVQ918BFWF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export default database;
