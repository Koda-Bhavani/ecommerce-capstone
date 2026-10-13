
const products = [
    {
        id: 1,
        name: "Everyday Tote",
        category: "Accessories",
        price: 24.99,
        description: "A stylish bag for everyday essentials.",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600"
    },
    {
        id: 2,
        name: "Classic Watch",
        category: "Accessories",
        price: 49.99,
        description: "A timeless design for every occasion.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
    },
    {
        id: 3,
        name: "Wireless Headphones",
        category: "Tech",
        price: 59.99,
        description: "Enjoy your favorite music anywhere.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
    },
    {
        id: 4,
        name: "Smart Speaker",
        category: "Tech",
        price: 39.99,
        description: "Compact sound for your daily routine.",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"
    },
    {
        id: 5,
        name: "Ceramic Vase",
        category: "Home",
        price: 19.99,
        description: "A simple accent for a cozy home.",
        image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600"
    },
    {
        id: 6,
        name: "Desk Lamp",
        category: "Home",
        price: 34.99,
        description: "Warm lighting for work and relaxation.",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"
    }
];

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const sortFilter = document.getElementById("sort-filter");
const productTotal = document.getElementById("product-total");
const statusMessage = document.getElementById("status");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const clearCartButton = document.getElementById("clear-cart");

let cart = [];

try {
    const savedCart = JSON.parse(localStorage.getItem("luna-mart-cart"));
    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(item =>
            products.some(product => product.id === item.id) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        );
    }
} catch {
    cart = [];
}

function saveCart() {
    try {
        localStorage.setItem("luna-mart-cart", JSON.stringify(cart));
    } catch {
        statusMessage.textContent =
            "Cart could not be saved in this browser.";
    }
}

function renderProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;

    let filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);

        const matchesCategory =
            category === "all" || product.category === category;

        return matchesSearch && matchesCategory;
    });

    if (sortFilter.value === "low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortFilter.value === "high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    productGrid.replaceChildren();
    productTotal.textContent = `${filteredProducts.length} products`;

    if (filteredProducts.length === 0) {
        statusMessage.textContent = "No products found. Try another search.";
        return;
    }

    statusMessage.textContent = "";

    filteredProducts.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        const imageBox = document.createElement("div");
        imageBox.className = "product-image";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";
        image.decoding = "async";

        image.addEventListener("error", () => {
            imageBox.textContent = "Image unavailable";
        }, { once: true });

        imageBox.appendChild(image);

        const info = document.createElement("div");
        info.className = "product-info";

        const categoryText = document.createElement("span");
        categoryText.className = "product-category";
        categoryText.textContent = product.category;

        const title = document.createElement("h3");
        title.textContent = product.name;

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = `$${product.price.toFixed(2)}`;

        const addButton = document.createElement("button");
        addButton.className = "add-to-cart";
        addButton.type = "button";
        addButton.textContent = "Add to cart";
        addButton.setAttribute("aria-label", `Add ${product.name} to cart`);

        addButton.addEventListener("click", () => addToCart(product.id));

        bottom.append(price, addButton);
        info.append(categoryText, title, description, bottom);
        card.append(imageBox, info);
        productGrid.appendChild(card);
    });
}

function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    saveCart();
    renderCart();
    statusMessage.textContent = "Product added to your cart!";
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

function renderCart() {
    cartItems.replaceChildren();

    let totalQuantity = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;

        totalQuantity += item.quantity;
        totalPrice += product.price * item.quantity;

        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("p");
        details.textContent =
            `${product.name} × ${item.quantity} — $${(product.price * item.quantity).toFixed(2)}`;

        const removeButton = document.createElement("button");
        removeButton.className = "remove-button";
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.setAttribute("aria-label", `Remove ${product.name}`);

        removeButton.addEventListener("click", () => removeFromCart(product.id));

        row.append(details, removeButton);
        cartItems.appendChild(row);
    });

    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Your cart is empty. Explore our products above!";
        cartItems.appendChild(emptyMessage);
    }

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
}

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
sortFilter.addEventListener("change", renderProducts);

clearCartButton.addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCart();
    statusMessage.textContent = "Cart cleared.";
});

renderProducts();
renderCart();
