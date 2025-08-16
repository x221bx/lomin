//  =====  this is example how to add or update data in fireStore
//  =====  the logic is standerd in orders or fav or completed orders ..... 



import { auth, db } from "./firebase-config.js";
import { doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";


const addOrder = async(orderData) => {
    if (!auth.currentUser) {
        alert('please log in first')
        return;
    }

    const useRef = doc(db,'users' , auth.currentUser.uid);
    await updateDoc(useRef, {
        orders:arrayUnion(orderData)
    })
}
const testAdd = document.getElementById('testAdd');
console.log(testAdd);

testAdd.addEventListener('click', async()=> {
    console.log('test');
    
    const orderData = {
        productId : '236',
        productName: 'product1',
        quantity: 2,
        price:200,
    }
    await addOrder(orderData)
})



