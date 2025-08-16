
// ===========================================================
// auth.js
// This file handles all authentication logic for the project.
// It uses Firebase Authentication and Firestore to manage:
// - Google sign up (new user) and login
// - Email/password sign up and login
// - Logout functionality
// - When a new user signs up or logs in for the first time, 
//   we create a document for them in Firestore under 'users' 
//   with default fields (email, role, wishlist, orders, etc.)
// ===========================================================


// auth.js
import { auth, db } from "./firebase-config.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
    setDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";



// google sing up 


export const handelGoogleSignUp = async ()=> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth,provider);


    const userDoc = doc(db,'users',result.user.uid);
    const snap = await getDoc(userDoc);

    if (!snap.exists()) {
        await setDoc(userDoc, {
            email: result.user.email,
            role: 'user',
            wishList: [],
            orders: [],
            orderStatus: false,
            completedOrders: [],
            cart:[],
        });
    }
    return result ;
}



// sign up 
export const handelSignUp = async (email , password) => {
    const cred = await createUserWithEmailAndPassword(auth , email , password);

    // save user in firestore
    await setDoc(doc(db, 'users' , cred.user.uid) , {
        email: cred.user.email,
        role:'user',
        wishList: [],
        orders : [],
        orderStatus:false,
        completedOrders:[],
        cart:[],
    })
    return cred
}
// login google 
export const handelGooglelogin = async ()=> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth,provider);

    const userDoc = doc(db,"users",result.user.uid);
    const snap = await getDoc(userDoc);

    if (!snap.exists()) {
        await setDoc(userDoc, {
            email: result.user.email,
            role: 'user',
            wishList: [],
            orders: [],
            orderStatus: false,
            completedOrders: [],
            cart:[],
        })
    }
    return result;
}
// login 

export const hadelLogin = async (email , password)=> {
    const cred = await signInWithEmailAndPassword(auth , email , password);
    return cred
}

export const handelLogout = async()=> {
    await signOut(auth)
}