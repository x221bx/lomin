
// ===========================================================
// main-auth.js (example name)
// This file handles the user authentication flow on the client side.
// It connects the UI (buttons & forms) with the authentication logic
// provided in auth.js.
//
// - Detects the current page using window.location.pathname.
// - Handles Google Sign Up: create account with Google & save in Firestore.
// - Handles Email/Password Sign Up: create account & redirect to login.
// - Handles Google Login: sign in with Google & redirect to dashboard.
// - Handles Email/Password Login: sign in with credentials & redirect.
// - Handles Logout: sign user out and redirect to login page.
//
// Each button (sign up, login, logout, Google login/signup) 
// has its own event listener that calls the corresponding 
// function from auth.js.
// ===========================================================

import { handelLogout , hadelLogin , handelSignUp  ,handelGoogleSignUp ,handelGooglelogin} from "./auth.js";

// Detect which page we are on
const path  =window.location.pathname ; 

// signUp page google

const googleSignUpBtn = document.getElementById("googleSignUpBtn");
if (googleSignUpBtn) {
    googleSignUpBtn.addEventListener('click', async()=> {
        try{
            await handelGoogleSignUp();
            alert("Account created with Google successfully");
            window.location.href = "login.html";
        }catch(error) {
            console.log(error);
        }
    })
}


// signUp page 

if (path.includes('signUp.html')) {
    document.getElementById('signupBtn').addEventListener('click', async(e)=> {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        if (!email || !password ) return alert('please fill all fields');
        try {
            await handelSignUp(email,password)
            alert('Account created Successfully')
            window.location.href = 'login.html'
        }catch(error) {
            console.log(error);
        }
    })
}





//  login google 

const googleLoginBtn = document.getElementById("googleLoginBtn");

if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async()=> {
        try {
            await handelGooglelogin();
            alert("Logged in with Google successfully");
            window.location.href = "index.html";
        }catch(error) {
            console.log(error);
        }
    })
}
// login page 


if (path.includes('login.html')) {
    document.getElementById('loginBtn').addEventListener('click', async(e)=> {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!email || !password ) return alert('please fill all fields');
        try {
            await hadelLogin(email, password);
            alert('Logged  in Successfully')
            window.location.href ='index.html';
        }catch(error) {
            console.log(error);
        }
    })
}


// logout
const logOutBtn = document.getElementById('logOut');
if (logOutBtn) {
    logOutBtn.addEventListener('click', async()=> {
        try{
            await handelLogout();
            alert("Logged out successfully");
            window.location.href = "login.html";
        }catch(error) {
            console.log(error);
        }
        })
}

