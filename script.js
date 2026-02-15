// Global variables
let searchTerm = '';
let selectedCategory = 'All';

// Update navbar based on authentication status
function updateNavbar() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const userNameEl = document.getElementById('userName');
    const cartLinkEl = document.getElementById('cartLink');
    const cartBadgeEl = document.getElementById('cartBadge');
    const logoutBtnEl = document.getElementById('logoutBtn');
    const loginLinkEl = document.getElementById('loginLink');
    const signupLinkEl = document.getElementById('signupLink');
    
    if (user) {
        if (userNameEl) {
            userNameEl.textContent = `👤 ${user.name}`;
            userNameEl.style.display = 'inline';
        }
        if (cartLinkEl) cartLinkEl.style.display = 'inline-flex';
        if (cartBadgeEl) cartBadgeEl.textContent = cartCount;
        if (logoutBtnEl) {
            logoutBtnEl.style.display = 'inline';
            logoutBtnEl.onclick = logout;
        }
        if (loginLinkEl) loginLinkEl.style.display = 'none';
        if (signupLinkEl) signupLinkEl.style.display = 'none';
    } else {
        if (userNameEl) userNameEl.style.display = 'none';
        if (cartLinkEl) cartLinkEl.style.display = 'none';
        if (logoutBtnEl) logoutBtnEl.style.display = 'none';
        if (loginLinkEl) loginLinkEl.style.display = 'inline';
        if (signupLinkEl) signupLinkEl.style.display = 'inline';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Render category filters
function renderCategories() {
    const categories = ['All', ...new Set(products.map(p => p.category))];
    const categoryFilterEl = document.getElementById('categoryFilter');
    
    if (categoryFilterEl) {
        categoryFilterEl.innerHTML = categories.map(category => `
            <button class="category-btn ${selectedCategory === category ? 'active' : ''}" 
                    onclick="filterByCategory('${category}')">
                ${category}
            </button>
        `).join('');
    }
}

// Filter products by category
function filterByCategory(category) {
    selectedCategory = category;
    renderCategories();
    renderProducts();
}

// Render products
function renderProducts() {
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                             product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    
    const productsGridEl = document.getElementById('productsGrid');
    const noResultsEl = document.getElementById('noResults');
    
    if (filteredProducts.length === 0) {
        if (productsGridEl) productsGridEl.innerHTML = '';
        if (noResultsEl) noResultsEl.style.display = 'block';
        return;
    }
    
    if (noResultsEl) noResultsEl.style.display = 'none';
    
    if (productsGridEl) {
        productsGridEl.innerHTML = filteredProducts.map(product => {
            const stars = '⭐'.repeat(Math.floor(product.rating));
            return `
                <div class="product-card">
                    <a href="product.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.name}" class="product-img">
                    </a>
                    <div class="product-card-body">
                        <a href="product.html?id=${product.id}">
                            <h3 class="product-name">${product.name}</h3>
                        </a>
                        <p class="product-desc">${product.description}</p>
                        <div class="product-rating">
                            <span>${stars}</span>
                            <span class="rating-text">${product.rating} (${product.stock} in stock)</span>
                        </div>
                        <div class="product-footer">
                            <span class="price">$${product.price.toFixed(2)}</span>
                            <button class="btn-add" onclick="addToCart(${product.id})">
                                🛒 Add
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Add product to cart
function addToCart(productId) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user) {
        alert('Please login to add items to cart');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
    updateNavbar();
}
