import {
    db,
    ref,
    realtimeDB,
    onValue
} from "./firebase-config.js";

let allProducts = [];

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
        #flashProductsGrid, #trendingGrid, #top100Grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; padding: 20px 0; }
        @media (max-width: 768px) { #flashProductsGrid, #trendingGrid, #top100Grid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; } .product-card-image { height: 180px; } }
    `;
    if (!document.querySelector('#product-styles')) document.head.appendChild(style);
}

function optimizeImage(imgElement, src) {
    const tempImg = new Image();
    tempImg.onload = () => { imgElement.src = src; };
    tempImg.onerror = () => { imgElement.src = 'fallback.png'; };
    tempImg.src = src;
}

function displayProducts(products, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.innerHTML = '';

    const productsToShow = products.slice(0, 3);

    productsToShow.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('card');
        const discountRate = 0.20;
        const oldPrice = (product.price / (1 - discountRate)).toFixed(2);

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
        `;

        const img = card.querySelector('.product-card-image');
        optimizeImage(img, product.image);

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

        displayProducts(products.slice(0, 3), '#flashProductsGrid');
        displayProducts(products.slice(3, 6), '#trendingGrid');
        displayProducts(products.slice(6, 9), '#top100Grid');
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
