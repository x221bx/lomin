import {
    db,
    collection,
    addDoc,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    getDoc,
    onAuthStateChanged,
    auth,
    ref,
    realtimeDB,
    onValue
} from "./firebase-config.js";

let allProducts = [];
let currentUser = null;
let userFavorites = [];

onAuthStateChanged(auth, async (user) => {
    currentUser = user ? user.uid : null;
    if (currentUser) {
        await loadUserFavorites(); // تحميل المفضلات عند تسجيل الدخول
        updateHeartStates(); // تحديث حالة القلوب
    } else {
        userFavorites = [];
        updateHeartStates();
    }
});

async function loadUserFavorites() {
    if (!currentUser) return;
    try {
        const userDoc = await getDoc(doc(db, "users", currentUser));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            userFavorites = userData.favorites || [];
        }
    } catch (error) {
        console.error("Error loading favorites:", error);
    }
}

function updateHeartStates() {
    const heartElements = document.querySelectorAll('.heart-like');
    heartElements.forEach(heart => {
        const productId = heart.dataset.productId;
        const isLiked = userFavorites.includes(productId);
        updateHeartAppearance(heart, isLiked);
    });
}

function updateHeartAppearance(heartElement, isLiked) {
    const svg = heartElement.querySelector('svg path');
    if (isLiked) {
        svg.setAttribute('fill', '#e74c3c');
        svg.setAttribute('stroke', '#e74c3c');
        heartElement.classList.add('liked');
    } else {
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', '#ccc');
        heartElement.classList.remove('liked');
    }
}

function addImageStyling() {
    const style = document.createElement('style');
    style.id = 'product-styles';
    style.textContent = `
        .product-card-image { width: 100%; height: 300px; object-fit: contain; object-position: center; border-radius: 8px 8px 0 0; transition: transform 0.3s ease; background-color: #f5f5f5; }
        .product-card-image:hover { transform: scale(1.05); }
        .card { overflow: hidden; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); transition: box-shadow 0.3s ease; background: white; }
        .card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .card-content { padding: 15px; }
        .card-content h3 { margin: 0 0 8px 0; font-size: 1.1em; color: #333; font-weight: 600; }
        .card-content p { margin: 0; color: #666; font-size: 0.9em; }
        .rating { padding: 0 15px; margin-bottom: 10px; }
        .rating i { color: #ffc107; font-size: 14px; }
        .rating span { color: #666; font-size: 12px; margin-left: 5px; }
        .price { padding: 0 15px 15px; }
        .price .new { color: #e74c3c; font-weight: bold; font-size: 1.1em; }
        .price .old { color: #999; text-decoration: line-through; margin-left: 10px; }
        .price .discount { color: #27ae60; background: #d5f4e6; padding: 2px 6px; border-radius: 3px; font-size: 12px; margin-left: 10px; }
        .see-more { text-decoration: none; display: block; color: inherit; }
        .see-more:hover { color: inherit; }
        .image-loading { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: loading 1.5s infinite; }
        @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        #flashProductsGrid, #trendingGrid, #top100Grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; padding: 20px 0; }
        @media (max-width: 768px) { #flashProductsGrid, #trendingGrid, #top100Grid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; } .product-card-image { height: 180px; } }
        .actions { display: flex; justify-content: space-between; align-items: center; padding: 0 15px 15px; }
        .heart-like { cursor: pointer; transition: transform 0.2s ease; }
        .heart-like:hover { transform: scale(1.1); }
        .heart-like.liked svg path { fill: #e74c3c !important; stroke: #e74c3c !important; }
        .add-btn { cursor: pointer; color: #333; }
        .add-btn:hover { color: #27ae60; }
    `;
    if (!document.querySelector('#product-styles')) document.head.appendChild(style);
}

function optimizeImage(imgElement, src) {
    imgElement.classList.add('image-loading');
    const tempImg = new Image();
    tempImg.onload = () => { imgElement.src = src; imgElement.classList.remove('image-loading'); };
    tempImg.onerror = () => { imgElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGRjVGNUY1Ii8+PC9zdmc+'; imgElement.classList.remove('image-loading'); };
    tempImg.src = src;
}

async function toggleFavorite(productId, heartElement) {
    if (!currentUser) {
        alert("Please login to add to favorites");
        return;
    }

    const isCurrentlyLiked = userFavorites.includes(productId);

    try {
        const favRef = doc(db, "users", currentUser);

        if (isCurrentlyLiked) {
            await updateDoc(favRef, { favorites: arrayRemove(productId) });
            userFavorites = userFavorites.filter(id => id !== productId);
            updateHeartAppearance(heartElement, false);
            console.log("Removed from favorites");
        } else {
            await updateDoc(favRef, { favorites: arrayUnion(productId) });
            userFavorites.push(productId);
            updateHeartAppearance(heartElement, true);
            console.log("Added to favorites");
        }
    } catch (error) {
        console.error("Error updating favorites:", error);

    }
}

function displayProducts(products, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('card');
        const discountRate = 0.20;
        const oldPrice = (product.price / (1 - discountRate)).toFixed(2);
        const isLiked = userFavorites.includes(product.id);

        card.innerHTML = `
            <a href="#" class="see-more">
                <img class="product-card-image" data-src="${product.image}" alt="${product.name}">
                <div class="card-content">
                    <h3>${product.name.split(" ").slice(0,2).join(" ")}</h3>
                    <p>${product.category}</p>
                </div>
            </a>

            <div class="rating">
                <i class="fas fa-star"></i><i class="fas fa-star"></i>
                <i class="fas fa-star"></i><i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <span>(526)</span>
            </div>

            <div class="price">
                <span class="new">$${product.price}</span>
                <span class="old">$${oldPrice}</span>
                <span class="discount">-${discountRate*100}%</span>
            </div>

            <div class="actions">
                <span class="heart-like ${isLiked ? 'liked' : ''}" title="Add to wishlist" data-product-id="${product.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 
                                2 8.5 2 5.42 4.42 3 7.5 3 
                                c1.74 0 3.41 0.81 4.5 2.09 
                                C13.09 3.81 14.76 3 16.5 3 
                                C19.58 3 22 5.42 22 8.5 
                                c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            fill="${isLiked ? '#e74c3c' : 'none'}" 
                            stroke="${isLiked ? '#e74c3c' : '#ccc'}" 
                            stroke-width="2"/>
                    </svg>
                </span>
                <i class="fas fa-shopping-cart add-btn" title="Add to cart"></i>
            </div>
        `;

        const img = card.querySelector('.product-card-image');
        optimizeImage(img, product.image);

        card.querySelector('.see-more').addEventListener('click', e => {
            e.preventDefault();
            window.open(`detailsPage.html?id=${product.id}`, '_blank');
        });

        const heartElement = card.querySelector('.heart-like');
        heartElement.addEventListener('click', () => {
            toggleFavorite(product.id, heartElement);
        });

        card.querySelector('.add-btn').addEventListener('click', () => {
            if (!currentUser) return alert("Please login to add to cart");
            const cartRef = doc(db, "users", currentUser);
            updateDoc(cartRef, { cart: arrayUnion(product.id) })
                .then(() => console.log(`${product.name} added to cart`))
                .catch(err => console.error(err));
        });

        container.appendChild(card);
    });
}

function loadProducts() {
    const productsRef = ref(realtimeDB, "products");

    onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        const products = Object.keys(data).map(id => ({ id, ...data[id] }));
        allProducts = products;

        displayProducts(products, '#flashProductsGrid');
        displayProducts(products, '#trendingGrid');
        displayProducts(products, '#top100Grid');
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        addImageStyling();
        loadProducts();
    });
} else {
    addImageStyling();
    loadProducts();
}