// ===========================================================
// firebase-config.js
// This file initializes Firebase and exports all common services
// you might need across the project.
// ===========================================================

// Firebase core
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

// Authentication
import { 
  getAuth, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firestore (NoSQL database)
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  getDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Realtime Database
import { 
  getDatabase, 
  ref, 
  set, 
  push, 
  onValue, 
  update, 
  remove 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Storage
import { 
  getStorage, 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAfO9XcMri6m9GOrI9QmOtuxLrwRv4Z9HA",
  authDomain: "js-project-48e11.firebaseapp.com",
  projectId: "js-project-48e11",
  storageBucket: "js-project-48e11.firebasestorage.app",
  messagingSenderId: "942681838440",
  appId: "1:942681838440:web:71c531f5df867b6941fcdd",
  measurementId: "G-WJLB73W1HY",
  databaseURL: "https://js-project-48e11-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const realtimeDB = getDatabase(app);
export const storage = getStorage(app);

// Export everything you might need
export { 
  // auth
  onAuthStateChanged, signInWithPopup, signOut,

  // firestore
  collection, addDoc, doc, updateDoc, arrayUnion, arrayRemove, 
  getDoc, getDocs, query, where, onSnapshot,

  // realtime db
  ref, set, push, onValue, update, remove,

  // storage
  storageRef, uploadBytes, getDownloadURL
};
