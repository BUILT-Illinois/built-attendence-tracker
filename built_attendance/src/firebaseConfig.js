// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOkli5-gd8K0jkESEz3jrhhA3Ao4ep-qI",
  authDomain: "attendance-tracker-48089.firebaseapp.com",
  projectId: "attendance-tracker-48089",
  storageBucket: "attendance-tracker-48089.firebasestorage.app",
  messagingSenderId: "850854476974",
  appId: "1:850854476974:web:aff6d3ade0fc3c743b813f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };