    import {
    auth,
    onAuthStateChanged,
    realtimeDB,
    ref,
    onValue,

    } from "/js/firebase-config.js";
// import { fetchData } from "/dashboard/dahsboard";


export const fetchData= async(refPath,callback) =>{
        const dataRef = ref(realtimeDB,refPath);
        onValue(dataRef, snapshot=> {
            const data= [];
            snapshot.forEach((child)=> {
                data.push({id:child.key, ...child.val()})
            })
            callback(data)
        })
    }


function showOrder() {
    onAuthStateChanged(auth, (user) => {
        
        if (!user) return;  
        console.log(user);
        
        fetchData("orders", (orders)=> {
            console.log(orders);
            
            const orderContainer = document.querySelector(".orders-container");
            orderContainer.innerHTML = ''
            orders.forEach((order) => {
                
                const orderDiv = document.createElement("div");
                if (user.uid === order.userId) {
                orderDiv.classList.add("order-row");
                orderDiv.innerHTML = `
                    <div class="order-data">
                    <h1>${order.userName}</h1>
                    <h3>${order.userId}</h3>
                    <p>Price: ${order.price}</p>
                    <p>Product: ${order.productName}</p>
                    <h1>Quantity: ${order.quantity}</h1>
                    <h3>Address: ${order.shippingAddress}</h3>
                    <p>Status: ${order.status}</p>
                    <p>Phone: ${order.phoneNumber}</p>
                    <button onclick="changeItemStatus('${order.id}', 'Confirm')">Confirm</button>
                    <button onclick="changeItemStatus('${order.id}', 'Reject')">Reject</button>
                    <p class='${order.status === 'Confirm' ?  "order-status confirm"  :order.status === 'Reject' ?"order-status reject" : "order-status pending"}'>Status: ${order.status}</p>
                    </div>
                    <div class="order-items"></div>
                `;
                }

                orderContainer.appendChild(orderDiv)
            });

        }) 

    });
    }


    showOrder();







