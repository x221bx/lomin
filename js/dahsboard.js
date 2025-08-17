    import {
    ref,
    set,
    push,
    onValue,
    update,
    remove,
    storageRef,
    uploadBytes,
    getDownloadURL,
    db,
    realtimeDB,
    } from "./firebase-config.js";

    const productRef = ref(realtimeDB, "products");
    const newProducts = push(productRef);
    let currentEditId = null;

    // Tab Switching
    const tabs = document.querySelectorAll(".tab");
    const tabButtons = document.querySelectorAll(".tab-btn");
    // ===== declare the inpute 
    const nameInput = document.getElementById("prod-name");
    const priceInput = document.getElementById("prod-price");
    const stockInput = document.getElementById("prod-stock");
    const categoryInput = document.getElementById("prod-category");
    const descInput = document.getElementById("prod-desc");
    const imageInput = document.getElementById("prod-image");
    const saveBtn = document.getElementById("save-product");
    console.log(saveBtn);






    // ==== creat product function  => this fun check in fields and create product in db (realtime database) and clear the inputs after adding 
    function createProduct() {
    if (!nameInput.value || !priceInput.value || !categoryInput.value) {
        alert("please Add the inputs");
        return;
    }
    let productRefToUse;
    if (currentEditId) {
        productRefToUse = ref(realtimeDB, `products/${currentEditId}`)
    }else {
        const productRef = ref(realtimeDB, "products");
        productRefToUse = push(productRef);
    }
    set(productRefToUse, {
        category: categoryInput.value,
        description: descInput.value,
        image: imageInput.value,
        name: nameInput.value,
        price: priceInput.value,
        stock: stockInput.value,
    })
        .then(() => {
        nameInput.value = "";
        priceInput.value = "";
        stockInput.value = "";
        categoryInput.value = "";
        descInput.value = "";
        imageInput.value = "";
        })
        .catch((err) => {
        console.error(err);
        });
    }
    saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("hello");
    createProduct();
    });



    //  showing the all products from db 
    function showAllProducts() {
    onValue(productRef, (snapshot) => {
        productsTableBody.innerHTML = ``;
        snapshot.forEach((childSnapshot) => {
            const product = childSnapshot.val();
            const id = childSnapshot.key;
            productsTableBody.innerHTML += `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>${product.stock}</td>
                    <td>
                    <button class="action edit" onclick="editeProduct('${id}')">Edit</button>
                    <button class="action delete" onclick="deleteProduct('${id}')">Delete</button>
                    </td>
                </tr>
            `;
        });
    });
    }
    showAllProducts();

    // delete product 
    window.deleteProduct = function(id) {
        const productRef =ref(realtimeDB, `products/${id}`)
        remove(productRef)
        .then(()=> {
            alert('deleted Succssifully')
        })
        .catch((err)=> {
            console.log(err);
            
        })
    }

window.editeProduct = function(id) {
        currentEditId = id;
        const productRef =ref(realtimeDB, `products/${id}`)
        
        onValue(productRef, (snapshot) => {
            const product = snapshot.val();
            if (product) {
                nameInput.value = product.name || "";
                priceInput.value = product.price || "";
                stockInput.value = product.stock || "";
                categoryInput.value = product.category || "";
                descInput.value = product.description || "";
                imageInput.value = product.image || "";
            }
    },{onlyOnce :true})
}








    tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        tabs.forEach((t) => t.classList.remove("active"));
        document.getElementById(btn.dataset.tab).classList.add("active");
    });
    });

    // Placeholder JS for table data
    const productsTableBody = document.querySelector("#products-table tbody");
    const categoriesTableBody = document.querySelector("#categories-table tbody");
    const ordersTableBody = document.querySelector("#orders-table tbody");

    categoriesTableBody.innerHTML = `
            <tr>
                <td>Sample Category</td>
                <td>
                <button class="action edit">Edit</button>
                <button class="action delete">Delete</button>
                </td>
            </tr>
            `;

    ordersTableBody.innerHTML = `
            <tr>
                <td>John Doe</td>
                <td>Product A x2</td>
                <td>200</td>
                <td>Pending</td>
                <td>
                <button class="action confirm">Confirm</button>
                <button class="action reject">Reject</button>
                </td>
            </tr>
`;






function testAddingOrders() {
    const orderId = "user2222_" + Date.now();
    const orderRef = ref(realtimeDB, "orders/"+orderId);

    set(orderRef, {
            userId :'user2222',
            items: [
                {productId:'product1', name :'product A', price:200,quantity:2},
                {productId:'product2', name :'product b', price:300,quantity:1}
            ],
            total :500,
            staus : 'rejected',
            date:new Date().toLocaleString(),
        
    })
} 


testAddingOrders()

