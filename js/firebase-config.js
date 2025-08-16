// ===========================================================
// firebase-config.js
// This file is responsible for initializing the Firebase app 
// and exporting the Firebase services used across the project.
// 
// - It imports the required Firebase modules (App, Auth, Firestore).
// - It defines the Firebase configuration object with keys 
//   (apiKey, projectId, appId, etc.).
// - It initializes the Firebase app using the config.
// - It exports Firebase Authentication (auth) and Firestore (db)
//   so they can be used in other files (e.g., auth.js).
// ===========================================================

// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";


// Firebase Config
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
export const db = getFirestore(app);
export const realtimeDB = getDatabase(app);
export { ref, onValue };
