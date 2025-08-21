import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { doc, onSnapshot, updateDoc, getDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

let currentUser = null;
const SHIPPING = 0; 
const TAX_RATE = 0;

// ====================== DISPLAY CART ======================
function displayProducts(products) {
    const container = document.getElementById('container');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = `<p>No items in your cart yet.</p>`;
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('item');

        card.innerHTML = `
            <a href="#" class="see-more"><img src="${product.image}" width="60px" alt="${product.name}"></a>
            <p>${product.name}</p>
            <span class="price">${product.price}</span> $
            <button class="dec">−</button>
            <input type="text" class="qty" value="${product.quantity || 1}" readonly>
            <button class="inc">+</button>
            <span class="subtotal">${(product.price * (product.quantity || 1)).toFixed(2)}</span> $
            <button class="remove">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;

        // remove from cart
        card.querySelector('.remove').addEventListener('click', async () => {
            await removeItem(product.id);
        });

        // increase
        card.querySelector('.inc').addEventListener('click', async () => {
            await changeQuantity(product.id, 1);
        });

        // decrease
        card.querySelector('.dec').addEventListener('click', async () => {
            await changeQuantity(product.id, -1);
        });

        // open details page
        card.querySelector('.see-more').addEventListener('click', (e) => {
            e.preventDefault();
            window.open(`detailsPage.html?id=${product.id}`, '_blank');
        });

        container.appendChild(card);
    });

    updateSummary();
}

// ====================== FETCH CART ======================
function fetchCart(userId) {
    const userRef = doc(db, "users", userId);

    onSnapshot(userRef, (snapshot) => {
        if (!snapshot.exists()) {
            displayProducts([]);
            return;
        }
        const userData = snapshot.data();
        const cart = userData?.cart || [];
        displayProducts(cart);
    });
}

// ====================== REMOVE ITEM ======================
async function removeItem(productId) {
  try {
    const userId = auth.currentUser.uid;
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      let cart = snap.data().cart || [];
      let updatedCart = cart.filter(p => String(p.id) !== String(productId));

      await updateDoc(userRef, { cart: updatedCart });
    }
  } catch (err) {
    console.error("Error removing item:", err);
  }
}

// ====================== CHANGE QUANTITY ======================
async function changeQuantity(productId, delta) {
  try {
    const userId = auth.currentUser.uid;
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      let cart = snap.data().cart || [];
      let updatedCart = cart.map(p => {
        if (String(p.id) === String(productId)) {
          let newQty = (p.quantity || 1) + delta;
          if (newQty < 1) newQty = 1;
          return { ...p, quantity: newQty };
        }
        return p;
      });

      await updateDoc(userRef, { cart: updatedCart });
    }
  } catch (err) {
    console.error("Error updating quantity:", err);
  }
}

// ====================== UPDATE SUMMARY ======================
function updateSummary() {
  let priceSum = 0;
  document.querySelectorAll(".item").forEach(it => {
    const unit = parseFloat(it.querySelector(".price").innerText);
    const qty  = parseInt(it.querySelector(".qty").value);
    priceSum += unit * qty;
  });

  const ship = SHIPPING;
  const tax  = priceSum * TAX_RATE;
  const total = priceSum + ship + tax;

  document.getElementById("sumPrice").innerText = priceSum.toFixed(2);
  document.getElementById("sumShip").innerText  = ship.toFixed(2);
  document.getElementById("sumTax").innerText   = tax.toFixed(2);
  document.getElementById("grandTotal").value   = total.toFixed(2);
}

// ====================== AUTH ======================
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user.uid;
        fetchCart(user.uid);
    } else {
        document.getElementById("container").innerHTML = `
            <p>Please log in to view your cart.</p>
        `;
    }
});

// ====================== SHOP NOW ======================
document.addEventListener("DOMContentLoaded", () => {
  const shopBtn = document.querySelector(".right-section button");
  if (shopBtn) {
    shopBtn.addEventListener("click", () => {
      window.location.href = "orders.html"; // الصفحة اللي تروحيها
    });
  }
});
