/* =========================
   PRODUCT DATABASE
========================= */

const products = [

    {
        id: 1,
        name: "Nova X1 Headset",
        category: "Accessories",
        price: 129.90,
        icon: "🎧"
    },

    {
        id: 2,
        name: "Nova Gaming PC",
        category: "PC",
        price: 1499.00,
        icon: "🖥️"
    },

    {
        id: 3,
        name: "Nova Mechanical Keyboard",
        category: "Gaming",
        price: 89.90,
        icon: "⌨️"
    },

    {
        id: 4,
        name: "Pro Wireless Mouse",
        category: "Gaming",
        price: 59.90,
        icon: "🖱️"
    },

    {
        id: 5,
        name: "27\" QHD Monitor",
        category: "PC",
        price: 299.90,
        icon: "🖥️"
    },

    {
        id: 6,
        name: "USB-C Dock Pro",
        category: "Accessories",
        price: 79.90,
        icon: "🔌"
    },

    {
        id: 7,
        name: "Nova Gaming Controller",
        category: "Gaming",
        price: 69.90,
        icon: "🎮"
    },

    {
        id: 8,
        name: "2TB NVMe SSD",
        category: "PC",
        price: 139.90,
        icon: "💾"
    }

];



/* =========================
   SHOP STATE
========================= */

let selectedCategory = "All";

let cart = [];



/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    const filteredProducts = products.filter(product => {

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;


        const matchesSearch =
            product.name
                .toLowerCase()
                .includes(search);


        return matchesCategory && matchesSearch;

    });


    const grid =
        document.getElementById("productsGrid");


    if (filteredProducts.length === 0) {

        grid.innerHTML = `
            <p style="color:#999;">
                No products found.
            </p>
        `;

        return;
    }


    grid.innerHTML =
        filteredProducts.map(product => `

            <article class="product">

                <div class="product-image">
                    ${product.icon}
                </div>

                <div class="product-info">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h3 class="product-name">
                        ${product.name}
                    </h3>

                    <div class="product-price">
                        CHF ${product.price.toFixed(2)}
                    </div>

                    <button
                        class="add-button"
                        onclick="addToCart(${product.id})"
                    >
                        Add to cart
                    </button>

                </div>

            </article>

        `).join("");

}



/* =========================
   CATEGORY FILTER
========================= */

function setCategory(category, button) {

    selectedCategory = category;


    document
        .querySelectorAll(".filter")
        .forEach(filter => {

            filter.classList.remove("active");

        });


    button.classList.add("active");


    renderProducts();

}



/* =========================
   ADD TO CART
========================= */

function addToCart(productId) {

    const existingItem =
        cart.find(item => item.id === productId);


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            id: productId,

            quantity: 1

        });

    }


    updateCart();


    showToast("Added to cart ✓");

}



/* =========================
   UPDATE CART
========================= */

function updateCart() {

    const cartCount =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    document
        .getElementById("cartCount")
        .textContent = cartCount;


    const cartItems =
        document.getElementById("cartItems");


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p style="color:#999;">
                Your cart is empty.
            </p>
        `;

    } else {

        cartItems.innerHTML =
            cart.map(item => {

                const product =
                    products.find(
                        p => p.id === item.id
                    );


                return `

                    <div class="cart-item">

                        <div class="cart-icon">
                            ${product.icon}
                        </div>

                        <div>

                            <h4>
                                ${product.name}
                            </h4>

                            <small>
                                CHF ${product.price.toFixed(2)}
                                × ${item.quantity}
                            </small>

                            <br>

                            <button
                                class="remove-button"
                                onclick="removeFromCart(${product.id})"
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                `;

            }).join("");

    }


    const total =
        cart.reduce((sum, item) => {

            const product =
                products.find(
                    p => p.id === item.id
                );

            return sum +
                product.price *
                item.quantity;

        }, 0);


    document
        .getElementById("cartTotal")
        .textContent =
            `CHF ${total.toFixed(2)}`;

}



/* =========================
   REMOVE FROM CART
========================= */

function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );


    updateCart();

}



/* =========================
   OPEN CART
========================= */

function openCart() {

    document
        .getElementById("cartOverlay")
        .classList.remove("hidden");


    updateCart();

}



/* =========================
   CLOSE CART
========================= */

function closeCart(event) {

    if (
        !event ||
        event.target.id === "cartOverlay"
    ) {

        document
            .getElementById("cartOverlay")
            .classList.add("hidden");

    }

}



/* =========================
   CHECKOUT
========================= */

function checkout() {

    if (cart.length === 0) {

        showToast("Your cart is empty.");

        return;

    }


    alert(
        "Demo checkout\n\n" +
        "No real payment will be processed.\n" +
        "This is a school-project demonstration."
    );


    cart = [];


    updateCart();


    closeCart();


    showToast(
        "Demo order placed ✓"
    );

}



/* =========================
   TOAST MESSAGE
========================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent = message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 1800);

}



/* =========================
   INITIALIZE
========================= */

renderProducts();

updateCart();
