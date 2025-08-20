import { fetchData } from "./dahsboard.js";
import {
    ref,
    onValue,
    realtimeDB,
    auth,
    onAuthStateChanged,
    set,
    update
} from "/js/firebase-config.js";

function showAllOrders() {
    const orderContainer = document.querySelector('.orders-container');
    orderContainer.innerHTML = '';

    fetchData('orders', (orders) => {
        Object.entries(orders).forEach(([orderId, order]) => {
            let orderIdTrue = order.userId
            // console.log(orderIdTrue);
            console.log(order.id);
            let orderDiv = document.createElement('div');
            orderDiv.classList.add('order-row');
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
                </div>
            `;
            orderContainer.appendChild(orderDiv);
        });
    });
}

document.addEventListener('DOMContentLoaded', showAllOrders);

window.changeItemStatus = function(orderId, newStatus) {
const orderRef = ref(realtimeDB, 'orders/' + orderId);
update(orderRef, { status: newStatus })
        .then(() => {
            console.log(`Order ${orderId} updated to ${newStatus}`);
        })
        .catch(err => console.error(err));
};

let addOrder = document.getElementById('addOrder');

addOrder.addEventListener('click',  ()=>  {
    const orderId = "user2222_"+Date.now();
    const orderRef = ref(realtimeDB, "orders/"+orderId);

    set(orderRef, {
        userId :'HyzEFDGiBhT1fCuiXtlzxMi0boW2',
        userName:' emad',
        price:800,
        quantity: 20,
        status: 'pending',
        productName:'Samsung',
        shippingAddress: "Cairo, Nasr City, Street 10",
        phoneNumber: "01012345678",
        notes: "please Add this to notes",
        date:new Date().toLocaleString(),
    });
});
