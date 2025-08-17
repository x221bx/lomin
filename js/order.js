    //  =====  this is example how to add or update data in fireStore
    //  =====  the logic is standerd in orders or fav or completed orders .....

    import { auth, db } from "./firebase-config.js";
    import {
    doc,
    updateDoc,
    arrayUnion,
    getDoc,
    } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
    import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";




    // const addOrder = async (orderData) => {
    // if (!auth.currentUser) {
    //     alert("please log in first");
    //     return;
    // }
    // const useRef = doc(db, "users", auth.currentUser.uid);
    // await updateDoc(useRef, {
    //     orders: arrayUnion(orderData),
    // });
    // };
    // const testAdd = document.getElementById("testAdd");
    // console.log(testAdd);

    // testAdd.addEventListener("click", async () => {
    // console.log("test");
    // const orderData = {
    //     productId: "236",
    //     productName: "new",
    //     quantity: 2,
    //     price: 2300,
    //     status: "pending",
    //     image:'https://m.media-amazon.com/images/I/71xb2xkN5qL._AC_SL1500_.jpg'
    // };
    // await addOrder(orderData);
    // });




    const ordersSection = document.getElementById("orders");

    onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

            const userData = userSnap.data();
            if (userData.orders  && userData.orders.length  > 0) {
                ordersSection.innerHTML = ''
                userData.orders.forEach((order) => {
                        ordersSection.innerHTML += `
                        <div class="order">
                            <img src="${order.image}" alt="">
                            <h3>product Name ${order.productName}</h3>
                            <h4 id="price">${order.price} $</h4>
                            <h4 id="status" class="order-status">${order.status || "pending"}</h4>
                        </div>
                        `;
                });
            }

        } else {
        console.log("no user is logged in");
        }
    }
});
