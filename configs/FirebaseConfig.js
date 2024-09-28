// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "avocadoai-5a34b.firebaseapp.com",
  projectId: "avocadoai-5a34b",
  storageBucket: "avocadoai-5a34b.appspot.com",
  messagingSenderId: "684242712811",
  appId: "1:684242712811:web:f93560dfefddc88167a6ae",
  measurementId: "G-GJHD291M8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);