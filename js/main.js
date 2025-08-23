import {
            db,
            onAuthStateChanged,
            auth,
            doc,
            getDoc,
            onValue
            } from "/js/firebase-config.js";



// =============== encap for dashboard link just display for admin only 

        let dashboardLink = document.getElementById('dashboardLink');
        let userOrders = document.getElementById('userOrders');

        onAuthStateChanged(auth , async(user)=> {
            if (user) {
                const userRef = doc(db,'users',user.uid);
                const snap = await getDoc(userRef);
                if (snap.exists()) {
                    let user = snap.data();
                    if (user.role === 'user') {
                        dashboardLink.style.display = 'none';
                        userOrders.style.display = 'flex';
                    } else {
                        dashboardLink.style.display = 'flex';
                        userOrders.style.display = 'none';
                    }
                }else {
                    console.log('err');
    
                }
            }
        })
