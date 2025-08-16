// Countdown Timer for Flash Sales
class CountdownTimer {
    constructor() {
        this.targetDate = new Date();
        this.targetDate.setDate(this.targetDate.getDate() + 2);
        this.targetDate.setHours(this.targetDate.getHours() + 11);
        this.targetDate.setMinutes(this.targetDate.getMinutes() + 45);
        this.targetDate.setSeconds(this.targetDate.getSeconds() + 32);

        this.daysElement = document.getElementById('days');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');

        this.startTimer();
    }

    startTimer() {
        this.updateTimer();
        setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    updateTimer() {
        const now = new Date().getTime();
        const timeLeft = this.targetDate.getTime() - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            this.daysElement.textContent = days.toString().padStart(2, '0');
            this.hoursElement.textContent = hours.toString().padStart(2, '0');
            this.minutesElement.textContent = minutes.toString().padStart(2, '0');
            this.secondsElement.textContent = seconds.toString().padStart(2, '0');
        } else {
            // Timer expired
            this.daysElement.textContent = '00';
            this.hoursElement.textContent = '00';
            this.minutesElement.textContent = '00';
            this.secondsElement.textContent = '00';
        }
    }
}

// Heart button functionality
class WishlistManager {
    constructor() {
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.initHeartButtons();
        this.updateWishlistCounter();
    }

    initHeartButtons() {
        const heartButtons = document.querySelectorAll('.heart-btn');
        heartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleWishlist(button);
            });
        });
    }

    toggleWishlist(button) {
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const heartIcon = button.querySelector('i');

        if (this.wishlist.includes(productName)) {
            // Remove from wishlist
            this.wishlist = this.wishlist.filter(item => item !== productName);
            heartIcon.classList.remove('fas');
            heartIcon.classList.add('far');
            button.classList.remove('active');
        } else {
            // Add to wishlist
            this.wishlist.push(productName);
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas');
            button.classList.add('active');
        }

        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
        this.updateWishlistCounter();
    }

    updateWishlistCounter() {
        const wishlistBadge = document.querySelector('.icon-btn .badge:not(.badge-blue)');
        if (wishlistBadge) {
            wishlistBadge.textContent = this.wishlist.length;
        }
    }
}

// Shopping Cart functionality
class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCounter();
        this.initAddToCartButtons();
    }

    initAddToCartButtons() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.heart-btn')) {
                    this.addToCart(card);
                }
            });
        });

        const shopButtons = document.querySelectorAll('.shop-btn, .shop-now-btn');
        shopButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.simulateAddToCart();
            });
        });
    }

    addToCart(productCard) {
        const productName = productCard.querySelector('h3').textContent;
        const priceElement = productCard.querySelector('.sale-price') || productCard.querySelector('.price span');
        const price = priceElement ? priceElement.textContent : '$0';

        const existingItem = this.cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                name: productName,
                price: price,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCounter();
        this.showAddedToCartMessage(productName);
    }

    simulateAddToCart() {
        this.cart.push({
            name: 'Featured Item',
            price: '$99.99',
            quantity: 1
        });

        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCounter();
        this.showAddedToCartMessage('Featured Item');
    }

    updateCartCounter() {
        const cartBadge = document.querySelector('.badge-blue');
        if (cartBadge) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartBadge.textContent = totalItems;
        }
    }

    showAddedToCartMessage(productName) {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        toast.textContent = `${productName} added to cart!`;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }
}

// Search functionality
class SearchManager {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.initSearch();
    }

    initSearch() {
        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch(e.target.value);
                }
            });
        }
    }

    performSearch(query) {
        if (query.trim()) {
            console.log(`Searching for: ${query}`);
            // In a real application, this would trigger a search API call
            this.showSearchResults(query);
        }
    }

    showSearchResults(query) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2563eb;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
        `;
        toast.textContent = `Searching for "${query}"...`;

        document.body.appendChild(toast);

        setTimeout(() => {
            document.body.removeChild(toast);
        }, 2000);
    }
}

// Newsletter subscription
class NewsletterManager {
    constructor() {
        this.form = document.querySelector('.newsletter-form');
        this.initNewsletter();
    }

    initNewsletter() {
        if (this.form) {
            const subscribeBtn = this.form.querySelector('.subscribe-btn');
            const emailInput = this.form.querySelector('input[type="email"]');

            subscribeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.subscribe(emailInput.value);
            });

            emailInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.subscribe(emailInput.value);
                }
            });
        }
    }

    subscribe(email) {
        if (this.isValidEmail(email)) {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 1000;
            `;
            toast.textContent = 'Successfully subscribed to newsletter!';

            document.body.appendChild(toast);

            setTimeout(() => {
                document.body.removeChild(toast);
            }, 3000);

            // Clear the input
            const emailInput = this.form.querySelector('input[type="email"]');
            emailInput.value = '';
        } else {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ef4444;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 1000;
            `;
            toast.textContent = 'Please enter a valid email address';

            document.body.appendChild(toast);

            setTimeout(() => {
                document.body.removeChild(toast);
            }, 3000);
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Smooth scrolling for anchor links
class SmoothScroll {
    constructor() {
        this.initSmoothScroll();
    }

    initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Image lazy loading and error handling
class ImageManager {
    constructor() {
        this.initImageHandling();
    }

    initImageHandling() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', (e) => {
                // If image fails to load, replace with a placeholder
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
            });

            // Add loading animation
            img.addEventListener('load', (e) => {
                e.target.style.opacity = '1';
            });

            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        });
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .heart-btn.active {
        background: #fecaca !important;
        color: #ef4444 !important;
    }
    
    .product-card:hover .product-image {
        transform: scale(1.05);
        transition: transform 0.3s ease;
    }
    
    .product-image {
        transition: transform 0.3s ease;
    }
`;
document.head.appendChild(style);

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
    new WishlistManager();
    new ShoppingCart();
    new SearchManager();
    new NewsletterManager();
    new SmoothScroll();
    new ImageManager();

    console.log('Luminae Store initialized successfully!');
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    // Responsive handling if needed
    const isMobile = window.innerWidth < 768;
    document.body.classList.toggle('mobile', isMobile);
});

// Initialize mobile class on load
window.addEventListener('load', () => {
    const isMobile = window.innerWidth < 768;
    document.body.classList.toggle('mobile', isMobile);
});
