
let wishlist = [];
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search').addEventListener('input', searchProducts);
    document.getElementById('cartButton').addEventListener('click', showCart);
    document.querySelector('.logo').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default anchor behavior
        loadHomePage();
    });
    document.getElementById('wishlistButton').addEventListener('click', showWishlist);
    loadHomePage(); // Load home page on initial load
});

function loadHomePage() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <section class="trending">
            <h1>Check out the season's biggest trends</h1>
            <div class="trend-categories"></div>
        </section>
        <section class="carousel">
            <div class="carousel-slide">
                <img src="Store Sale Ad 1.png" alt="Ad 1">
                <img src="Store Sale Ad2.png" alt="Ad 2">
                <img src="Store Sale Ad3.png" alt="Ad 3">
            </div>
            <button class="carousel-prev" onclick="moveSlide(-1)">&#10094;</button>
            <button class="carousel-next" onclick="moveSlide(1)">&#10095;</button>
        </section>
        <section class="recommended-products">
            <!-- Content will be injected here by JavaScript -->
        </section>
    `;
    loadTrendingCategories();
    loadRecommendedProducts();
    showSlides(slideIndex);
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
      addButton.classList.add('add-to-cart-button');
      addButton.textContent = 'Add to Cart';
      addButton.addEventListener('click', (event) => {
          event.stopPropagation();
          addToCart(product);
      });
      infoDiv.appendChild(addButton);

      const heartButton = document.createElement('button');
      heartButton.classList.add('heart-button');
      if (wishlist.some(item => item.id === product.id)) {
          heartButton.classList.add('filled');
      }
      heartButton.addEventListener('click', (event) => {
          event.stopPropagation();
          toggleWishlist(product, heartButton);
      });
      infoDiv.appendChild(heartButton);
      
      div.appendChild(infoDiv);
      categorySection.appendChild(div);
  });

  content.appendChild(categorySection);
}

function loadTrendingCategories() {
  const trendCategories = [
      { name: "Fashion", image: "https://img.ltwebstatic.com/images3_abc/2024/04/23/f4/1713878671709b75008cd9ba9b0c236d772ba81fe0.png" },
      { name: "Beauty & Care", image: "https://img.ltwebstatic.com/images3_ccc/2023/11/01/b7/169883112225bb2788cef5889939f5ebc49332471f.jpg" },
      { name: "Technology & Electronics", image: "https://img.ltwebstatic.com/images3_ccc/2024/03/19/c4/1710828286f5c9e2a717be0ffdb1eb455bcd34bedd.png" },
      { name: "Home & Garden", image: "https://img.ltwebstatic.com/images3_abc/2024/07/15/a0/1721029170c5cbc73e991f39abef682f5f446b335a.png" },
      { name: "Leisure & Sports", image: "https://img.ltwebstatic.com/images3_abc/2024/06/22/ee/171905991293b81a3d93085e4784f56ec82ff55b9d.png" },
      { name: "Grocery & Food", image: "https://img.ltwebstatic.com/images3_abc/2024/06/20/a2/17188688111b1d20c11de46f093c1b7551f7b5585c.png" }
  ];

  const trendCategoriesContainer = document.querySelector('.trend-categories');
  trendCategories.forEach(category => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'trend-category';
      
      const img = document.createElement('img');
      img.src = category.image;
      img.alt = category.name;
      categoryDiv.appendChild(img);
      
      const name = document.createElement('p');
      name.textContent = category.name;
      categoryDiv.appendChild(name);
      
      trendCategoriesContainer.appendChild(categoryDiv);
  });
}

function toggleWishlist(product, heartButton) {
  const index = wishlist.findIndex(item => item.id === product.id);

  if (index > -1) {
      wishlist.splice(index, 1);
      heartButton.classList.remove('filled');
  } else {
      wishlist.push(product);
      heartButton.classList.add('filled');
  }
}

function showWishlist() {
  const content = document.getElementById('content');
  content.innerHTML = '<h1>Wishlist</h1>';

  if (wishlist.length === 0) {
      content.innerHTML += '<p>Your wishlist is empty.</p>';
      return;
  }

  wishlist.forEach(product => {
      const div = document.createElement('div');
      div.className = 'product';
      
      const img = document.createElement('img');
      img.src = product.thumbnail;
      img.alt = product.title;
      div.appendChild(img);
      
      const infoDiv = document.createElement('div');
      infoDiv.classList.add('product-info');
      
      const title = document.createElement('h2');
      title.textContent = product.title;
      infoDiv.appendChild(title);
      
      const price = document.createElement('p');
      price.textContent = `${product.price} USD`;
      infoDiv.appendChild(price);
      
      const addButton = document.createElement('button');
      addButton.textContent = 'Add to Cart';
      addButton.addEventListener('click', (event) => {
          event.stopPropagation();
          addToCart(product);
      });
      infoDiv.appendChild(addButton);
      
      const heartButton = document.createElement('button');
      heartButton.classList.add('heart-button');
      heartButton.classList.add('filled');
      heartButton.addEventListener('click', (event) => {
          event.stopPropagation();
          toggleWishlist(product, heartButton);
      });
      infoDiv.appendChild(heartButton);
      
      div.appendChild(infoDiv);
      content.appendChild(div);
  });
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

      const heartButton = document.createElement('button');
      heartButton.classList.add('heart-button');
      if (wishlist.some(item => item.id === product.id)) {
          heartButton.classList.add('filled');
      }
      heartButton.addEventListener('click', (event) => {
          event.stopPropagation();
          toggleWishlist(product, heartButton);
      });
      infoDiv.appendChild(heartButton);
      
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
              <img src="${product.images[0]}" alt="${product.title}" class="main-image" id="mainImage">
              <div class="thumbnail-container">
                  ${product.images.map(img => `<img src="${img}" alt="${product.title}" class="thumbnail" onclick="changeMainImage('${img}')">`).join('')}
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

function toggleCategories() {
  const categoryList = document.getElementById('category-list');
  if (categoryList.style.display === 'flex' || categoryList.style.display === 'block') {
      categoryList.style.display = 'none';
  } else {
      categoryList.style.display = 'flex';
      categoryList.style.flexDirection = 'column';
  }
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
  updateCartTotal();
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

  const totalDiv = document.createElement('div');
  totalDiv.className = 'cart-total';
  totalDiv.innerHTML = `<h2>Total: $${calculateCartTotal()} USD</h2>`;
  content.appendChild(totalDiv);

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
  updateCartTotal();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  showCart();
}

function calculateCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
}

function updateCartTotal() {
  const totalDiv = document.querySelector('.cart-total h2');
  if (totalDiv) {
      totalDiv.textContent = `Total: $${calculateCartTotal()} USD`;
  }
}
function checkout() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h1>Checkout</h1>
        <form id="checkout-form">
            <label for="name">Full Name:</label>
            <input type="text" id="name" name="name" required>
  
            <label for="address">Shipping Address:</label>
            <input type="text" id="address" name="address" required>
  
            <label for="id-number">ID Number:</label>
            <input type="text" id="id-number" name="id-number" required pattern="\\d{9}" title="Please enter a valid 9-digit ID number">
  
            <label for="credit-card">Credit Card Number:</label>
            <input type="text" id="credit-card" name="credit-card" required pattern="\\d{16}" title="Please enter a valid 16-digit credit card number">
  
            <label for="expiry-date">Expiry Date (MM/YY):</label>
            <input type="text" id="expiry-date" name="expiry-date" required pattern="\\d{2}/\\d{2}" title="Please enter a valid expiry date in MM/YY format">
  
            <label for="cvv">CVV:</label>
            <input type="text" id="cvv" name="cvv" required pattern="\\d{3}" title="Please enter a valid 3-digit CVV number">
  
            <button type="submit">Purchase</button>
        </form>
    `;
  
    document.getElementById('checkout-form').addEventListener('submit', processPurchase);
  }
  
function changeMainImage(src) {
  document.getElementById('mainImage').src = src;
}

function processPurchase(event) {
  event.preventDefault();

  const address = document.getElementById('address').value;
  const creditCard = document.getElementById('credit-card').value;

  alert('Thank you for your purchase! Your items will be shipped to ' + address);

  cart = [];
  showCart();
}
let slideIndex = 0;
showSlides(slideIndex);
setInterval(() => moveSlide(1), 3000); // Add this line for auto-slide every 3 seconds

function moveSlide(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let slides = document.querySelectorAll('.carousel-slide img');
    if (n >= slides.length) {
        slideIndex = 0;
    }
    if (n < 0) {
        slideIndex = slides.length - 1;
    }
    slides.forEach((slide, index) => {
        slide.style.display = 'none';
    });
    slides[slideIndex].style.display = 'block';
}



