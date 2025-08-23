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
        currentUser = user; 
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
  const currentUserId = currentUser.uid;
  const currentUserName = currentUser.displayName;
  const snapshot = await getDoc(userDocRef);

  if (!snapshot.exists()) {
    console.log("No user data found");
    return;
  }

  const userData = snapshot.data();
  const cartItems = userData.cart || [];

  if (cartItems.length === 0) {
    console.log("Cart is empty");
    return;
  }

  const orderPromises = cartItems.map(item => {
    const dataOrder = {
      userId: currentUserId,
      userName: currentUserName || "unknown",
      email: userData.email || "no-email",
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: item.quantity,
      status: "pending",
      shippingAddress: "haram",
      phoneNumber: "01012345678",
      notes: "hi",
      date: new Date().toLocaleString(),
    };

    return addToOrderReal(dataOrder);
  });

  await Promise.all(orderPromises);

  swal("Done", "All products added as separate orders, cart cleared.", "success");
    setTimeout(() => {
        updateDoc(userDocRef, { cart: [] });
        setTimeout(() => {
            window.location.href = "userOrder.html"; 
        }, 800);
    }, 1500);
});

async function addToOrderReal(order) {
  const orderRef = push(ref(realtimeDB, "orders"));
  await set(orderRef, order);
  console.log("Order added:", order);
}
