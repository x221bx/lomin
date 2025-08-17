import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { doc, onSnapshot, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

let currentUser = null;

// display product
function displayProducts(products) {
    const container = document.getElementById('fav-container');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = `<p>No items in your wishlist yet.</p>`;
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('card');
        const discountRate = 0.20; 
        const oldPrice = (product.price / (1 - discountRate)).toFixed(2);

        card.innerHTML = `
            <a href="#" class="see-more">
                <img src="${product.image}" alt="${product.name}">
                <div class="card-content">
                    <h3>${product.name.split(" ").slice(0, 2).join(" ")}</h3>
                    <p>${product.category}</p>
                </a>
                
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <span>(526)</span>
                </div>

                <div class="price">
                    <span class="new">$${product.price}</span>
                    <span class="old">$${oldPrice}</span>
                    <span class="discount">-${discountRate * 100}%</span>
                </div>

                <div class="actions">
                    <span class="heart-like" title="Remove from wishlist">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 
                                   2 8.5 2 5.42 4.42 3 7.5 3 
                                   c1.74 0 3.41 0.81 4.5 2.09 
                                   C13.09 3.81 14.76 3 16.5 3 
                                   C19.58 3 22 5.42 22 8.5 
                                   c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                fill="red" 
                                stroke="red" 
                                stroke-width="2"/>
                        </svg>
                    </span>
                    <i class="fas fa-shopping-cart add-btn" title="Add to cart"></i>
                </div>
            </div>
        `;

        // click remove from wishlist
        let heartPath = card.querySelector('svg path');
        let heartContainer = card.querySelector('.heart-like');

        heartContainer.addEventListener('click', async () => {
            await removeFromWishlist(product.id);
            card.remove(); 
        });

        // add to cart
        card.querySelector('.add-btn').addEventListener('click', () => addToCart(product));

        // open product details
        card.querySelector('.see-more').addEventListener('click', (e) => {
            e.preventDefault();
            window.open(`detailsPage.html?id=${product.id}`, '_blank');
        });

        container.appendChild(card);
    });
}

// remove product from wishlist
async function removeFromWishlist(productId) {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser);
    const snapshot = await getDoc(userRef);
    const userData = snapshot.data();
    const wishlist = userData?.wishlist || [];

    const updatedWishlist = wishlist.filter(item => item.id !== productId);

    await updateDoc(userRef, { wishlist: updatedWishlist });
}

// fetch user data & wishlist
function fetchWishlist(userId) {
    const userRef = doc(db, "users", userId);

    onSnapshot(userRef, (snapshot) => {
        if (!snapshot.exists()) {
            displayProducts([]);
            return;
        }
        const userData = snapshot.data();
        const wishlist = userData?.wishlist || [];
        displayProducts(wishlist);
    });
}

// follow up with current status of login
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user.uid;
        fetchWishlist(user.uid);
    } else {
        document.getElementById("fav-container").innerHTML = `
            <p>Please log in to view your wishlist.</p>
        `;
    }
});

// add to cart 
function addToCart(product) {
    if (!currentUser) {
        alert("Please log in first!");
        return;
    }
    console.log("Added to cart:", product);
}
