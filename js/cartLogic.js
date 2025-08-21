import {
  // auth
  onAuthStateChanged,
  signInWithPopup,
  signOut,

  // firestore
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

  // realtime db
  ref,
  set,
  push,

  // storage
  storageRef,
  uploadBytes,
  getDownloadURL,
  auth,
  db,
  realtimeDB
} from "./firebase-config.js";

let addOrder = document.getElementById("addToOrder");
let currentUser;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user; // نفس الـ uid اللي في Firestore
  } else {
    console.log("no user found");
  }
});

addOrder.addEventListener("click", async () => {
  if (!currentUser) {
    console.log("User not logged in");
    return;
  }

  const userDocRef = doc(db, "users", currentUser.uid);
  const snapshot = await getDoc(userDocRef);

  if (!snapshot.exists()) {
    console.log("No user data found");
    return;
  }

  const userData = snapshot.data();
    const dataOrders = {
    userId: currentUser,
    userName: currentUser.displayName || "unknown",
    price: userData.price || 0,
    email: userData.email || "no-email",
    quantity: userData.quantity || 1,
    status: "pending",
    productName: userData.productName || "no product",
    shippingAddress: "haram",
    phoneNumber: "01012345678",
    notes: "hi",
    date: new Date().toLocaleString(),
  };

  addToOrderReal(dataOrders);
});

function addToOrderReal(order) {
  const orderRef = push(ref(realtimeDB, "orders"));
  set(orderRef, order);
  console.log("Order added:", order);
}
