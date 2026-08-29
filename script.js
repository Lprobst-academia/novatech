/* =========================================
   NOVATECH V2
   Static e-commerce demo
========================================= */


/* =========================================
   PRODUCT DATABASE
========================================= */

const products = [

    {
        id: 1,
        name: "Nova X1 Headset",
        category: "Accessories",
        price: 129.90,
        rating: 4.8,
        reviews: 124,
        icon: "🎧"
    },

    {
        id: 2,
        name: "Nova Gaming PC",
        category: "PC",
        price: 1499.00,
        rating: 4.9,
        reviews: 87,
        icon: "🖥️"
    },

    {
        id: 3,
        name: "Nova Mechanical Keyboard",
        category: "Gaming",
        price: 89.90,
        rating: 4.7,
        reviews: 201,
        icon: "⌨️"
    },

    {
        id: 4,
        name: "Pro Wireless Mouse",
        category: "Gaming",
        price: 59.90,
        rating: 4.6,
        reviews: 176,
        icon: "🖱️"
    },

    {
        id: 5,
        name: "27\" QHD Monitor",
        category: "PC",
        price: 299.90,
        rating: 4.8,
        reviews: 93,
        icon: "🖥️"
    },

    {
        id: 6,
        name: "USB-C Dock Pro",
        category: "Accessories",
        price: 79.90,
        rating: 4.5,
        reviews: 61,
        icon: "🔌"
    },

    {
        id: 7,
        name: "Nova Gaming Controller",
        category: "Gaming",
        price: 69.90,
        rating: 4.7,
        reviews: 142,
        icon: "🎮"
    },

    {
        id: 8,
        name: "2TB NVMe SSD",
        category: "PC",
        price: 139.90,
        rating: 4.9,
        reviews: 118,
        icon: "💾"
    },

    {
        id: 9,
        name: "Nova Webcam 4K",
        category: "Accessories",
        price: 119.90,
        rating: 4.6,
        reviews: 72,
        icon: "📷"
    },

    {
        id: 10,
        name: "RGB Gaming Desk",
        category: "Gaming",
        price: 249.90,
        rating: 4.4,
        reviews: 55,
        icon: "🪑"
    }

];



/* =========================================
   STATE
========================================= */

let selectedCategory = "All";

let cart =
    JSON.parse(
        localStorage.getItem("novatechCart")
    ) || [];

let wishlist =
    JSON.parse(
        localStorage.getItem("novatechWishlist")
    ) || [];

let checkoutStep = 1;



/* =========================================
   SAVE DATA
========================================= */

function saveData() {

    localStorage.setItem(
        "novatechCart",
        JSON.stringify(cart)
    );

    localStorage.setItem(
        "novatechWishlist",
        JSON.stringify(wishlist)
    );

}



/* =========================================
   RENDER PRODUCTS
========================================= */

function renderProducts() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    const sort =
        document
            .getElementById("sortSelect")
            .value;


    let filtered =
        products.filter(product => {

            const categoryMatch =
                selectedCategory === "All" ||
                product.category === selectedCategory;


            const searchMatch =
                product.name
                    .toLowerCase()
                    .includes(search);


            return categoryMatch && searchMatch;

        });


    /* SORT */

    if (sort === "low") {

        filtered.sort(
            (a, b) => a.price - b.price
        );

    }

    if (sort === "high") {

        filtered.sort(
            (a, b) => b.price - a.price
        );

    }

    if (sort === "rating") {

        filtered.sort(
            (a, b) => b.rating - a.rating
        );

    }


    const grid =
        document.getElementById(
            "productsGrid"
        );


    if (filtered.length === 0) {

        grid.innerHTML = `
            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:60px;
                color:#858b98;
            ">
                <h3>No products found</h3>
                <p>Try another search.</p>
            </div>
        `;

        return;

    }


    grid.innerHTML =
        filtered.map(product => {

            const saved =
                wishlist.includes(product.id);


            return `

                <article class="product">

                    <div class="product-image">

                        <button
                            class="
                                wishlist-button
                                ${saved ? "saved" : ""}
                            "
                            onclick="toggleWishlist(${product.id})"
                            title="Add to wishlist"
                        >
                            ${saved ? "♥" : "♡"}
                        </button>

                        <span>
                            ${product.icon}
                        </span>

                    </div>


                    <div class="product-info">

                        <span class="product-category">
                            ${product.category}
                        </span>

                        <h3 class="product-name">
                            ${product.name}
                        </h3>

                        <div class="rating">

                            ${stars(product.rating)}

                            <span>
                                ${product.rating}
                                (${product.reviews})
                            </span>

                        </div>


                        <div class="product-bottom">

                            <div class="product-price">
                                CHF ${product.price.toFixed(2)}
                            </div>

                            <button
                                class="add-button"
                                onclick="addToCart(${product.id})"
                            >
                                Add +
                            </button>

                        </div>

                    </div>

                </article>

            `;

        }).join("");

}



/* =========================================
   STARS
========================================= */

function stars(rating) {

    const full =
        Math.round(rating);


    return "★".repeat(full);

}



/* =========================================
   CATEGORY
========================================= */

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



/* =========================================
   CART
========================================= */

function addToCart(productId) {

    const existing =
        cart.find(
            item => item.id === productId
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: productId,

            quantity: 1

        });

    }


    saveData();

    updateCart();

    showToast("Added to cart ✓");

}



function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );


    saveData();

    updateCart();

}



function changeQuantity(productId, amount) {

    const item =
        cart.find(
            item => item.id === productId
        );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;

    }


    saveData();

    updateCart();

}



function updateCart() {

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    document
        .getElementById("cartCount")
        .textContent = count;


    const container =
        document.getElementById(
            "cartItems"
        );


    if (cart.length === 0) {

        container.innerHTML = `
            <div style="
                text-align:center;
                padding:60px 10px;
                color:#858b98;
            ">
                <div style="
                    font-size:50px;
                    margin-bottom:15px;
                ">
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p style="margin-top:8px;">
                    Add something you like!
                </p>
            </div>
        `;

    } else {

        container.innerHTML =
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

                        <div class="cart-item-content">

                            <h4>
                                ${product.name}
                            </h4>

                            <div class="cart-item-price">
                                CHF ${product.price.toFixed(2)}
                            </div>


                            <div class="quantity">

                                <button
                                    onclick="
                                        changeQuantity(
                                            ${product.id},
                                            -1
                                        )
                                    "
                                >
                                    −
                                </button>

                                <span>
                                    ${item.quantity}
                                </span>

                                <button
                                    onclick="
                                        changeQuantity(
                                            ${product.id},
                                            1
                                        )
                                    "
                                >
                                    +
                                </button>

                            </div>


                            <button
                                class="remove-button"
                                onclick="
                                    removeFromCart(
                                        ${product.id}
                                    )
                                "
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                `;

            }).join("");

    }


    const subtotal =
        getCartTotal();


    const shipping =
        subtotal === 0
            ? 0
            : subtotal >= 100
                ? 0
                : 6.90;


    document
        .getElementById("cartSubtotal")
        .textContent =
            `CHF ${subtotal.toFixed(2)}`;


    document
        .getElementById("shipping")
        .textContent =
            shipping === 0
                ? "FREE"
                : `CHF ${shipping.toFixed(2)}`;


    document
        .getElementById("cartTotal")
        .textContent =
            `CHF ${(subtotal + shipping).toFixed(2)}`;

}



function getCartTotal() {

    return cart.reduce(
        (sum, item) => {

            const product =
                products.find(
                    p => p.id === item.id
                );


            return sum +
                product.price *
                item.quantity;

        },
        0
    );

}



/* =========================================
   OPEN / CLOSE CART
========================================= */

function openCart() {

    updateCart();


    document
        .getElementById("cartOverlay")
        .classList.remove("hidden");

}


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



/* =========================================
   WISHLIST
========================================= */

function toggleWishlist(productId) {

    if (wishlist.includes(productId)) {

        wishlist =
            wishlist.filter(
                id => id !== productId
            );

        showToast("Removed from wishlist");

    } else {

        wishlist.push(productId);

        showToast("Added to wishlist ♥");

    }


    saveData();

    updateWishlistCount();

    renderProducts();

}



function updateWishlistCount() {

    document
        .getElementById("wishlistCount")
        .textContent =
            wishlist.length;

}



function showWishlist() {

    const overlay =
        document.getElementById(
            "wishlistOverlay"
        );


    const container =
        document.getElementById(
            "wishlistItems"
        );


    if (wishlist.length === 0) {

        container.innerHTML = `
            <div style="
                text-align:center;
                padding:60px 10px;
                color:#858b98;
            ">
                <div style="
                    font-size:50px;
                ">
                    ♡
                </div>

                <h3>
                    Your wishlist is empty
                </h3>

                <p style="margin-top:8px;">
                    Save products you like here.
                </p>
            </div>
        `;

    } else {

        container.innerHTML =
            wishlist.map(id => {

                const product =
                    products.find(
                        p => p.id === id
                    );


                return `

                    <div class="wishlist-item">

                        <div class="wishlist-item-icon">
                            ${product.icon}
                        </div>

                        <div class="wishlist-item-info">

                            <h4>
                                ${product.name}
                            </h4>

                            <span>
                                CHF ${product.price.toFixed(2)}
                            </span>

                        </div>

                        <button
                            class="wishlist-add"
                            onclick="addToCart(${product.id})"
                        >
                            Add
                        </button>

                    </div>

                `;

            }).join("");

    }


    overlay.classList.remove("hidden");

}



function closeWishlist(event) {

    if (
        !event ||
        event.target.id === "wishlistOverlay"
    ) {

        document
            .getElementById(
                "wishlistOverlay"
            )
            .classList.add("hidden");

    }

}



/* =========================================
   CHECKOUT
========================================= */

function startCheckout() {

    if (cart.length === 0) {

        showToast("Your cart is empty.");

        return;

    }


    closeCart();


    checkoutStep = 1;


    showCheckoutStep(1);


    document
        .getElementById(
            "checkoutOverlay"
        )
        .classList.remove("hidden");

}



function closeCheckout() {

    document
        .getElementById(
            "checkoutOverlay"
        )
        .classList.add("hidden");

}



function showCheckoutStep(step) {

    checkoutStep = step;


    document
        .querySelectorAll(".checkout-step")
        .forEach(element => {

            element.classList.add("hidden");

        });


    document
        .getElementById(
            `checkoutStep${step}`
        )
        .classList.remove("hidden");


    document
        .getElementById(
            "checkoutSuccess"
        )
        .classList.add("hidden");


    document
        .querySelectorAll(".step")
        .forEach((element, index) => {

            element.classList.toggle(
                "active",
                index < step
            );

        });


    if (step === 3) {

        renderCheckoutReview();

    }

}



/* =========================================
   NEXT CHECKOUT STEP
========================================= */

function nextCheckoutStep() {

    if (checkoutStep === 1) {

        const name =
            document
                .getElementById(
                    "customerName"
                )
                .value.trim();


        const email =
            document
                .getElementById(
                    "customerEmail"
                )
                .value.trim();


        const address =
            document
                .getElementById(
                    "customerAddress"
                )
                .value.trim();


        if (
            !name ||
            !email ||
            !address
        ) {

            showToast(
                "Please fill in the required fields."
            );

            return;

        }

    }


    if (checkoutStep === 2) {

        const card =
            document
                .querySelector(
                    '#checkoutStep2 input[type="text"]'
                )
                .value.trim();


        if (!card) {

            showToast(
                "Enter a demo card number."
            );

            return;

        }

    }


    showCheckoutStep(
        checkoutStep + 1
    );

}



/* =========================================
   REVIEW
========================================= */

function renderCheckoutReview() {

    const review =
        document.getElementById(
            "checkoutReview"
        );


    review.innerHTML =
        cart.map(item => {

            const product =
                products.find(
                    p => p.id === item.id
                );


            const total =
                product.price *
                item.quantity;


            return `

                <div class="review-item">

                    <span>
                        ${product.name}
                        × ${item.quantity}
                    </span>

                    <strong>
                        CHF ${total.toFixed(2)}
                    </strong>

                </div>

            `;

        }).join("");


    const subtotal =
        getCartTotal();


    const shipping =
        subtotal >= 100
            ? 0
            : 6.90;


    document
        .getElementById("reviewTotal")
        .textContent =
            `CHF ${(subtotal + shipping).toFixed(2)}`;

}



/* =========================================
   PLACE ORDER
========================================= */

function placeOrder() {

    const orderNumber =
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    document
        .getElementById(
            "orderNumber"
        )
        .textContent =
            orderNumber;


    document
        .querySelectorAll(".checkout-step")
        .forEach(element => {

            element.classList.add("hidden");

        });


    document
        .getElementById(
            "checkoutSuccess"
        )
        .classList.remove("hidden");


    document
        .querySelectorAll(".step")
        .forEach(step => {

            step.classList.add("active");

        });


    cart = [];


    saveData();

    updateCart();

}



/* =========================================
   TOAST
========================================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent = message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 1800);

}



/* =========================================
   INITIALIZE
========================================= */

renderProducts();

updateCart();

updateWishlistCount();
