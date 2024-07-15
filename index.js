document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search').addEventListener('input', searchProducts);
    document.getElementById('cartButton').addEventListener('click', showCart);
    document.querySelector('.logo').addEventListener('click', loadHomePage);
    loadTrendingCategories();
    loadRecommendedProducts();
});

function loadHomePage() {
    document.querySelector('.recommended-products').innerHTML = ''; // Reset recommended products section
    loadRecommendedProducts();
}

function loadTrendingCategories() {
    const trendingCategories = [
        { name: "Chef's Kiss", image: "https://i.etsystatic.com/5265180/c/2000/2000/0/500/il/994783/4983561629/il_300x300.4983561629_4c20.jpg" },
        { name: "Colorful Vintage Glassware", image: "https://i.etsystatic.com/6489157/r/il/a79c02/6160178767/il_300x300.6160178767_7msq.jpg" },
        { name: "Creative Couples' Portraits", image: "https://i.etsystatic.com/35102557/r/il/a688f4/4347476071/il_300x300.4347476071_9kt1.jpg" },
        { name: "Garden Girl", image: "https://i.etsystatic.com/7558906/r/il/fd0916/5104177431/il_300x300.5104177431_qsyn.jpg" },
        { name: "Charm Necklaces", image: "https://i.etsystatic.com/47595479/c/2047/2047/0/1/il/45e9de/6060672661/il_300x300.6060672661_j13b.jpg" },
        { name: "Chrome Decor", image: "https://i.etsystatic.com/24611060/r/il/20d8d4/5986621082/il_300x300.5986621082_r0sl.jpg" }
    ];

    const trendContainer = document.querySelector('.trend-categories');
    trendingCategories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'trend-category';
        categoryDiv.innerHTML = `
            <img src="${category.image}" alt="${category.name}">
            <p>${category.name}</p>
        `;
        trendContainer.appendChild(categoryDiv);
    });
}

function loadRecommendedProducts() {
    fetch('https://dummyjson.com/products/category-list')
        .then(response => response.json())
        .then(categories => {
            const categoryList = document.getElementById('category-list');
            categoryList.innerHTML = ''; // Clear any existing categories
            categories.forEach(category => {
                const li = document.createElement('li');
                li.textContent = category; // Assuming category is a string
                li.addEventListener('click', () => loadProductsByCategory(category));
                categoryList.appendChild(li);
                
                // Load recommended products for each category
                loadRecommendedProductsByCategory(category);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
}

function loadRecommendedProductsByCategory(category) {
    fetch(`https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=3`)
        .then(response => response.json())
        .then(data => {
            displayRecommendedProductsByCategory(category, data.products);
        })
        .catch(error => console.error(`Error fetching recommended products for category ${category}:`, error));
}

function displayRecommendedProductsByCategory(category, products) {
    const content = document.querySelector('.recommended-products');
    
    const categorySection = document.createElement('div');
    categorySection.className = 'category-section';
    categorySection.innerHTML = `<h2>${category}</h2>`;
    
    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        
        const img = document.createElement('img');
        img.src = product.thumbnail;
        img.alt = product.title;
        img.addEventListener('click', () => showProductDetails(product));
        div.appendChild(img);
        
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('product-info');
        
        const title = document.createElement('h2');
        title.textContent = product.title;
        title.addEventListener('click', () => showProductDetails(product));
        infoDiv.appendChild(title);
        
        const price = document.createElement('p');
        price.textContent = `${product.price} USD`;
        price.addEventListener('click', () => showProductDetails(product));
        infoDiv.appendChild(price);
        
        const addButton = document.createElement('button');
        addButton.textContent = 'Add to Cart';
        addButton.addEventListener('click', (event) => {
            event.stopPropagation();
            addToCart(product);
        });
        infoDiv.appendChild(addButton);
        
        div.appendChild(infoDiv);
        categorySection.appendChild(div);
    });

    content.appendChild(categorySection);
}

function displayProducts(products) {
    const content = document.getElementById('content');
    content.innerHTML = '<h1>Products</h1>';
    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        
        const img = document.createElement('img');
        img.src = product.thumbnail;
        img.alt = product.title;
        img.addEventListener('click', () => showProductDetails(product));
        div.appendChild(img);
        
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('product-info');
        
        const title = document.createElement('h2');
        title.textContent = product.title;
        title.addEventListener('click', () => showProductDetails(product));
        infoDiv.appendChild(title);
        
        const price = document.createElement('p');
        price.textContent = `${product.price} USD`;
        price.addEventListener('click', () => showProductDetails(product));
        infoDiv.appendChild(price);
        
        const addButton = document.createElement('button');
        addButton.textContent = 'Add to Cart';
        addButton.addEventListener('click', (event) => {
            event.stopPropagation();
            addToCart(product);
        });
        infoDiv.appendChild(addButton);
        
        div.appendChild(infoDiv);
        
        content.appendChild(div);
    });
}

function showProductDetails(product) {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="product-details">
            <h1>${product.title}</h1>
            <div class="product-images">
                <img src="${product.images[0]}" alt="${product.title}" class="main-image">
                <div class="thumbnail-container">
                    ${product.images.map(img => `<img src="${img}" alt="${product.title}" class="thumbnail">`).join('')}
                </div>
            </div>
            <p class="description">${product.description}</p>
            <p class="price">${product.price} USD</p>
            <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">Add to Cart</button>
            <div class="product-reviews">
                <h2>Customer Reviews</h2>
                ${product.reviews.map(review => `
                    <div class="review">
                        <p><strong>${review.reviewerName}</strong> rated it ${review.rating}/5</p>
                        <p>${review.comment}</p>
                    </div>
                `).join('')}
            </div>
            <div class="additional-info">
                <h2>Additional Information</h2>
                <p>Brand: ${product.brand}</p>
                <p>Category: ${product.category}</p>
                <p>Stock: ${product.stock}</p>
                <p>SKU: ${product.sku}</p>
                <p>Weight: ${product.weight}kg</p>
                <p>Dimensions: ${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} cm</p>
                <p>Warranty: ${product.warrantyInformation}</p>
                <p>Shipping: ${product.shippingInformation}</p>
                <p>Return Policy: ${product.returnPolicy}</p>
                <p>Availability: ${product.availabilityStatus}</p>
            </div>
        </div>
    `;
}

function searchProducts(event) {
    const query = event.target.value.trim();
    if (query === '') {
        loadRecommendedProducts(); // Load recommended products if search query is empty
        return;
    }

    fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            console.log(data); // Debugging log
            if (data.products.length === 0) {
                const content = document.getElementById('content');
                content.innerHTML = '<p>No products found</p>';
            } else {
                displayProducts(data.products);
            }
        })
        .catch(error => console.error('Error searching products:', error));
}

function loadCategories() {
    fetch('https://dummyjson.com/products/category-list')
        .then(response => response.json())
        .then(categories => {
            console.log('Categories:', categories); // Debugging log
            const categoryList = document.getElementById('category-list');
            categoryList.innerHTML = ''; // Clear any existing categories
            categories.forEach(category => {
                console.log('Category:', category); // Log each category to see its structure
                const li = document.createElement('li');
                li.textContent = category; // Assuming category is a string
                li.addEventListener('click', () => loadProductsByCategory(category));
                categoryList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
}

function loadProductsByCategory(category) {
    fetch(`https://dummyjson.com/products/category/${encodeURIComponent(category)}`)
        .then(response => response.json())
        .then(data => {
            displayProducts(data.products);
        })
        .catch(error => console.error('Error fetching products by category:', error));
}

let cart = [];

function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            thumbnail: product.thumbnail,
            price: product.price,
            quantity: 1
        });
    }

    alert(`${product.title} has been added to your cart.`);
}

function showCart() {
    const content = document.getElementById('content');
    content.innerHTML = '<h1>Shopping Cart</h1>';

    if (cart.length === 0) {
        content.innerHTML += '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.thumbnail}" alt="${item.title}">
            <h2>${item.title}</h2>
            <p>${item.price} USD</p>
            <p>Quantity: <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input"></p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        content.appendChild(div);
    });

    content.innerHTML += `<button onclick="checkout()">Checkout</button>`;

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', updateQuantity);
    });
}

function updateQuantity(event) {
    const input = event.target;
    const id = parseInt(input.dataset.id, 10);
    const newQuantity = parseInt(input.value, 10);

    const product = cart.find(item => item.id === id);
    if (product) {
        product.quantity = newQuantity;
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    showCart();
}

function checkout() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h1>Checkout</h1>
        <form id="checkout-form">
            <label for="address">Shipping Address:</label>
            <input type="text" id="address" name="address" required>
            <label for="credit-card">Credit Card Number:</label>
            <input type="text" id="credit-card" name="credit-card" required pattern="\\d{16}" title="Please enter a valid 16-digit credit card number">
            <button type="submit">Purchase</button>
        </form>
    `;

    document.getElementById('checkout-form').addEventListener('submit', processPurchase);
}

function processPurchase(event) {
    event.preventDefault();

    const address = document.getElementById('address').value;
    const creditCard = document.getElementById('credit-card').value;

    alert('Thank you for your purchase! Your items will be shipped to ' + address);

    cart = [];
    showCart();
}
