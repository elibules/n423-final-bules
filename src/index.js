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

import Controller from "./controller";

// FIREBASE CONFIG OBJECT
const firebaseConfig = initializeApp({
  apiKey: "AIzaSyAi9B1ebX4fiz0hEC_YUZ3XO_wAQCimSk4",

  authDomain: "n423-final-bules.firebaseapp.com",

  projectId: "n423-final-bules",

  storageBucket: "n423-final-bules.appspot.com",

  messagingSenderId: "1077253085482",

  appId: "1:1077253085482:web:00245c6ec660320568e653",
});

// DECALRE GLOBAL CONSTANTS
const auth = getAuth(firebaseConfig);
const db = getFirestore(firebaseConfig);
const controller = new Controller();

/**
 * If there's a hash in the URL, display the page that corresponds to the hash. If there's no hash,
 * display the mySets page
 */
function route() {
  let hash = window.location.hash.replace("#", "");
  if (hash) {
    controller.display(hash);
  } else {
    controller.display("mySets");
  }
}

$(window).on("hashchange", () => {
  route();
});

$(document).ready(() => {
  route();
});
