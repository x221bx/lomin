
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const cartItemsDiv = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

async function renderCart(userId) {
    const userDoc = doc(db, "users", userId);
    const snap = await getDoc(userDoc);

    if (!snap.exists()) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.innerText = "Total: $0";
        return;
    }

    let userData = snap.data();
    let cart = userData.cart || [];

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.innerText = "Total: $0";
        return;
    }

    cartItemsDiv.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
      <h4>${item.name}</h4>
      <p>Price: $${item.price}</p>
      <p>Quantity: 
        <button class="decrease" data-index="${index}">-</button>
        ${item.quantity}
        <button class="increase" data-index="${index}">+</button>
      </p>
      <button class="remove" data-index="${index}">Remove</button>
      <hr>
    `;
        cartItemsDiv.appendChild(div);
    });

    cartTotal.innerText = `Total: $${total}`;

    document.querySelectorAll(".increase").forEach(btn => {
        btn.addEventListener("click", () => updateQuantity(userId, cart, btn.dataset.index, +1));
    });

    document.querySelectorAll(".decrease").forEach(btn => {
        btn.addEventListener("click", () => updateQuantity(userId, cart, btn.dataset.index, -1));
    });

    document.querySelectorAll(".remove").forEach(btn => {
        btn.addEventListener("click", () => removeItem(userId, cart, btn.dataset.index));
    });
}

async function updateQuantity(userId, cart, index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    await updateDoc(doc(db, "users", userId), { cart });
    renderCart(userId);
}

async function removeItem(userId, cart, index) {
    cart.splice(index, 1);
    await updateDoc(doc(db, "users", userId), { cart });
    renderCart(userId);
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        renderCart(user.uid);
    } else {
        cartItemsDiv.innerHTML = "<p>Please log in to view your cart.</p>";
    }
});
