import { 
    db,
    collection,
    addDoc,
    doc,
    updateDoc,
    arrayUnion,
    getDoc,
    onAuthStateChanged,
    auth,
    ref,
    realtimeDB,
    onValue,
    onSnapshot
} from "./firebase-config.js";


let allProducts = [];
let filteredProducts = [];
let searchedProducts = [];

let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user.uid;
    } else {
        currentUser = null;
    }
});



// display products
function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    products.forEach(product => {
        // console.log(product);
        
        const card = document.createElement('div');
        card.classList.add('card');
        const discountRate = 0.20; // 20% discount fixed
        const oldPrice = (product.price / (1 - discountRate)).toFixed(2);
        card.innerHTML = `
        <a href="cart.html" class="see-more">
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
        <span class="heart-like" title="Add to favorite">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 
                2 8.5 2 5.42 4.42 3 7.5 3 
                c1.74 0 3.41 0.81 4.5 2.09 
                C13.09 3.81 14.76 3 16.5 3 
                C19.58 3 22 5.42 22 8.5 
                c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="none" 
            stroke="black" 
            stroke-width="2"/>
        </svg>
        </span>
        <i class="fas fa-shopping-cart add-btn" title="Add to cart"></i>
      </div>
    </div>
      </div>
        `;

        // add to cart
        card.querySelector('.add-btn').addEventListener('click', () => addToCart(product));
        card.addEventListener('click', () => handelProductCart(product));

        // add to fav
        let heartPath = card.querySelector('svg path');
        let heartContainer = card.querySelector('.heart-like');

        updateFavoriteUI(product.id, heartPath, heartContainer);

        heartContainer.addEventListener('click', () => {
            toggleFavorite(product, heartPath, heartContainer);
        });


        // open product details page
        card.querySelector('.see-more').addEventListener('click', (e) => {
            e.preventDefault();
            window.open(`detailsPage.html?id=${product.id}`, '_blank');
        });
        
        

        container.appendChild(card);
    });
}

// fetch data from firebase
function loadProducts() {
    const productsRef = ref(realtimeDB, "products");

    onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        // object to array
        const products = Object.keys(data).map(id => ({
            id,
            ...data[id]
        }));

        allProducts = products;
        filteredProducts = [...allProducts];
        searchedProducts = [...allProducts];
        displayProducts(allProducts);
    });
}

loadProducts();

// Apply all filters , search , sort 
function applyAllFilters() {
    // filter with category & price
    let selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(c => c.value);
    let minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    let maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

    filteredProducts = allProducts.filter(product => {
        let categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        let priceMatch = product.price >= minPrice && product.price <= maxPrice;
        return categoryMatch && priceMatch;
    });

    // search
    let char = document.getElementById('search').value.toLowerCase();
    searchedProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(char) ||
        product.description.toLowerCase().includes(char) ||
        product.category.toLowerCase().includes(char)
    );

    // sort => price
    let selectedSort = document.getElementById('select').value;
    if (selectedSort === 'lowToHigh') {
        searchedProducts.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'highToLow') {
        searchedProducts.sort((a, b) => b.price - a.price);
    }

    displayProducts(searchedProducts);
}

// events
document.getElementById('apply-filters').addEventListener('click', applyAllFilters);
document.getElementById('search').addEventListener('input', applyAllFilters);
document.getElementById('select').addEventListener('change', applyAllFilters);

// reset button in sidebar
document.getElementById('reset-filters').addEventListener('click', () => {
    document.querySelectorAll('.category-filter').forEach(input => input.checked = false);
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    document.getElementById('search').value = '';
    document.getElementById('select').value = 'default';
    filteredProducts = [...allProducts];
    searchedProducts = [...allProducts];
    displayProducts(allProducts);
});

// Sidebar in small screen
const filterBtn = document.getElementById('filterBtn');
const sideBar = document.getElementById('sideBar');
const applyBtn = document.getElementById('apply-filters');

filterBtn.addEventListener('click', () => {
    const isHidden = getComputedStyle(sideBar).display === 'none';
    sideBar.style.display = isHidden ? 'block' : 'none';
    filterBtn.textContent = isHidden ? 'Hide Filters' : 'Show Filters';
});

applyBtn.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
        sideBar.style.display = 'none';
        filterBtn.textContent = 'Show Filters';
    }
});

// add to cart

async function addToCart(product) {

    let productDetals = {
        id:product.id,
        name:product.name,
        price:product.price,
        quantity: 1,
        createdAt: new Date(),
        
    }
    const userId = auth.currentUser.uid; 
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
        cart:arrayUnion(productDetals)
    })

}

// add to wishlist
async function toggleFavorite(product, heartPath, heartContainer) {
    if (!currentUser) {
        alert("Please log in first!");
        return;
    }

    const userRef = doc(db, "users", currentUser);
    const snapshot = await getDoc(userRef);
    const userData = snapshot.data();
    const wishlist = userData?.wishlist || [];

    const exists = wishlist.some(item => item.id === product.id);

    if (exists) {

        // remove from wishlist
        await updateDoc(userRef, {
            wishlist: wishlist.filter(item => item.id !== product.id)
        });
        heartPath.setAttribute('fill', 'none');
        heartPath.setAttribute('stroke', 'black');
        heartContainer.setAttribute('title', 'Add to Favorites');
    } else {
         // add product as object in the wishlist array
        await updateDoc(userRef, {
            wishlist: [...wishlist, {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                stock: product.stock
            }]
        });
        heartPath.setAttribute('fill', 'red');
        heartPath.setAttribute('stroke', 'red');
        heartContainer.setAttribute('title', 'Remove from Favorites');
    }
}

// update add to fav ui on changes
function updateFavoriteUI(productId, heartPath, heartContainer) {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser);
    onSnapshot(userRef, (snapshot) => {
        const userData = snapshot.data();
        const wishlist = userData?.wishlist || [];

        const exists = wishlist.some(item => item.id === productId);
        if (exists) {
            heartPath.setAttribute('fill', 'red');
            heartPath.setAttribute('stroke', 'red');
            heartContainer.setAttribute('title', 'Remove from Favorites');
        } else {
            heartPath.setAttribute('fill', 'none');
            heartPath.setAttribute('stroke', 'black');
            heartContainer.setAttribute('title', 'Add to Favorites');
        }
    });
}



// handel 
function handelProductCart(product) {
    localStorage.setItem('product', JSON.stringify(product));
} 


