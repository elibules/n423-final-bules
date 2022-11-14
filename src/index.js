import { initializeApp } from "firebase/app";

import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signOut,
  //   GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  doc,
  onSnapshot,
} from "firebase/firestore";

// FIREBASE CONFIG OBJECT
const firebaseConfig = initializeApp({
  apiKey: "AIzaSyAi9B1ebX4fiz0hEC_YUZ3XO_wAQCimSk4",

  authDomain: "n423-final-bules.firebaseapp.com",

  projectId: "n423-final-bules",

  storageBucket: "n423-final-bules.appspot.com",

  messagingSenderId: "1077253085482",

  appId: "1:1077253085482:web:00245c6ec660320568e653",
});

// STORE FIREBASE FUNCTIONS
const auth = getAuth(firebaseConfig);
const db = getFirestore(firebaseConfig);