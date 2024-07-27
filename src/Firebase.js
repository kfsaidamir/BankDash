import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDH2V1L1KU7AgzqnYjAJuVMYGy54GOsF9Y",
  authDomain: "bankdash-1.firebaseapp.com",
  projectId: "bankdash-1",
  storageBucket: "bankdash-1.appspot.com",
  messagingSenderId: "148791014096",
  appId: "1:148791014096:web:fbad01d2a7f84235b1e4d5",
  measurementId: "G-9F3M65WCMY"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword };
