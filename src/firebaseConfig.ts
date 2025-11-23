// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsCBpE_xeydVwvBCllt-3r1r2ws2gZ6xg",
  authDomain: "tugas-pbp-firebase-9b4fa.firebaseapp.com",
  projectId: "tugas-pbp-firebase-9b4fa",
  storageBucket: "tugas-pbp-firebase-9b4fa.appspot.com",
  messagingSenderId: "774184939312",
  appId: "1:774184939312:web:dcf0fc44f8a98878aa22f5",
  measurementId: "G-3612J6C4EL"
};

// Pastikan tidak inisialisasi dua kali saat hot-reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);