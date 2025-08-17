    import {
    ref,
    onValue,
    realtimeDB,
    auth,
    onAuthStateChanged,
    set
    } from "/js/firebase-config.js";

    function showOrder() {
    onAuthStateChanged(auth, (user) => {
        console.log(user);
        
        if (!user) return;

        const orderRef = ref(realtimeDB, "orders");

        onValue(orderRef, (snapShot) => {
        const orderContainer = document.querySelector(".orders-container");
        orderContainer.innerHTML = ''; 

        snapShot.forEach((childSnapShot) => {
            console.log(childSnapShot.val());
            
            const order = childSnapShot.val();
            if (user.uid === order.userId) {
            const orderDiv = document.createElement("div");
            orderDiv.classList.add("order-row");

            orderDiv.innerHTML = `
                <div class="order-data">
                <h1>${order.userName}</h1>
                <h3>${order.userId}</h3>
                <p>Total: ${order.total}</p>
                <p>Date: ${order.date}</p>
                </div>
                <div class="order-items"></div>
            `;

    
            const itemsDiv = orderDiv.querySelector(".order-items");
            order.items.forEach((item) => {
                itemsDiv.innerHTML += `
                <div class="order-item">
                    <h4>${item.name}</h4>
                    <h4>${item.price}</h4>
                    <h4>${item.productId}</h4>
                    <h4>Quantity: ${item.quantity}</h4>
                    <h4>Status: ${item.status ?? "Pending"}</h4>
                    <button class="action confirm">Confirm</button>
                    <button class="action reject">Reject</button>
                </div>
                `;
            });

            orderContainer.appendChild(orderDiv);
            }
        });
        });
    });
    }

    window.onload = () => {
    showOrder();
    };




function testAddingOrders() {
    const orderId = "user2222_" + Date.now();
    const orderRef = ref(realtimeDB, "orders/"+orderId);

    set(orderRef, {
            userId :'HyzEFDGiBhT1fCuiXtlzxMi0boW2',
            userName:'moahmed emad',
            items: [
                {productId:'product1', name :'product A', price:200,quantity:2,staus : 'pending'},
                {productId:'product2', name :'product b', price:300,quantity:1,staus : 'pending'}
            ],
            total :200,
            
            date:new Date().toLocaleString(),
        
    })
} 
// testAddingOrders()
