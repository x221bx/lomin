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
    } from "../js/firebase-config.js";


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
   // Placeholder JS for table data
    const productsTableBody = document.querySelector("#products-table tbody");
    const categoriesTableBody = document.querySelector("#categories-table tbody");
    const ordersTableBody = document.querySelector(".order-row");



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



    //  showing the all products from db 
function showAllProducts() {


    fetchData('products', (products)=> {

        console.log(products);
        
        let html = ''
        const productContainer = document.querySelector('.product-container table tbody')
        let productDiv = document.createElement('div');
        products.forEach((product)=> {
            html += `
                        <tr>
                            <td>${product.name}</td>
                            <td>${product.price}</td>
                            <td>${product.stock}</td>
                            <td>
                            <button class="action edit" onclick="editeProduct('${product.id}')">Edit</button>
                            <button class="action delete" onclick="deleteProduct('${product.id}')">Delete</button>
                            </td>
                        </tr>
                    `;
        })
        
        productContainer.innerHTML = html
    })
    
}




window.addEventListener("DOMContentLoaded", () => {
    const saveBtn = document.getElementById("save-product");
    if (saveBtn) {  
        saveBtn.addEventListener("click", (e) => {
            e.preventDefault();
            createProduct();
            swal("Success!", "Your product has been added/updated successfully!", "success");
        });
    }

    showAllProducts();

});




  // delete product 
window.deleteProduct = function(id) {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            const productRef = ref(realtimeDB, `products/${id}`);
            remove(productRef)
                .then(() => {
                    swal("Poof! Product has been deleted!", {
                        icon: "success",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    swal("Error deleting product!", {
                        icon: "error",
                    });
                });
        } else {
            swal("Your product is safe!");
        }
    });
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












