const products = [
  {
    id: 1,
    name: "Nova X1 Wireless Headset",
    category: "Accessories",
    price: 129.90,
    rating: 4.8,
    reviews: 124,
    icon: "🎧",
    new: true,
    description:
      "Low-latency wireless audio with all-day comfort and a clean microphone for gaming, calls and music.",
    features: [
      "Wireless connection",
      "40-hour battery",
      "Noise-reducing microphone",
      "USB-C charging"
    ]
  },

  {
    id: 2,
    name: "Nova Gaming PC",
    category: "PC",
    price: 1499,
    rating: 4.9,
    reviews: 87,
    icon: "🖥️",
    new: true,
    description:
      "A fictional high-performance gaming desktop built for smooth gaming and demanding applications.",
    features: [
      "High-performance CPU",
      "Dedicated graphics",
      "32 GB memory",
      "2 TB NVMe storage"
    ]
  },

  {
    id: 3,
    name: "Nova Mechanical Keyboard",
    category: "Gaming",
    price: 89.90,
    rating: 4.7,
    reviews: 201,
    icon: "⌨️",
    new: false,
    description:
      "Compact mechanical keyboard with responsive switches and a comfortable typing feel.",
    features: [
      "Mechanical switches",
      "RGB lighting",
      "USB-C",
      "Compact layout"
    ]
  },

  {
    id: 4,
    name: "Pro Wireless Mouse",
    category: "Gaming",
    price: 59.90,
    rating: 4.6,
    reviews: 176,
    icon: "🖱️",
    new: false,
    description:
      "Lightweight wireless gaming mouse with accurate tracking and a long-lasting battery.",
    features: [
      "Wireless",
      "High-precision sensor",
      "Lightweight design",
      "Programmable buttons"
    ]
  },

  {
    id: 5,
    name: '27" QHD Monitor',
    category: "PC",
    price: 299.90,
    rating: 4.8,
    reviews: 93,
    icon: "🖥️",
    new: true,
    description:
      "A crisp QHD display for gaming, school work and creative projects.",
    features: [
      "QHD resolution",
      "High refresh rate",
      "Adaptive sync",
      "Height adjustable"
    ]
  },

  {
    id: 6,
    name: "USB-C Dock Pro",
    category: "Accessories",
    price: 79.90,
    rating: 4.5,
    reviews: 61,
    icon: "🔌",
    new: false,
    description:
      "Expand your laptop with a practical collection of ports in one compact dock.",
    features: [
      "HDMI output",
      "USB-A ports",
      "USB-C",
      "Ethernet"
    ]
  },

  {
    id: 7,
    name: "Nova Gaming Controller",
    category: "Gaming",
    price: 69.90,
    rating: 4.7,
    reviews: 142,
    icon: "🎮",
    new: false,
    description:
      "Comfortable wireless controller for PC gaming and compatible games.",
    features: [
      "Wireless mode",
      "Ergonomic grip",
      "Vibration feedback",
      "USB-C"
    ]
  },

  {
    id: 8,
    name: "2TB NVMe SSD",
    category: "PC",
    price: 139.90,
    rating: 4.9,
    reviews: 118,
    icon: "💾",
    new: false,
    description:
      "Fast fictional NVMe storage for games, projects and everyday files.",
    features: [
      "2 TB capacity",
      "NVMe interface",
      "High read speeds",
      "Compact M.2 form factor"
    ]
  },

  {
    id: 9,
    name: "Nova Webcam 4K",
    category: "Accessories",
    price: 119.90,
    rating: 4.6,
    reviews: 72,
    icon: "📷",
    new: true,
    description:
      "A fictional 4K webcam for video calls, streaming and online learning.",
    features: [
      "4K video",
      "Auto focus",
      "Built-in microphone",
      "Privacy cover"
    ]
  },

  {
    id: 10,
    name: "RGB Gaming Desk",
    category: "Gaming",
    price: 249.90,
    rating: 4.4,
    reviews: 55,
    icon: "🪑",
    new: false,
    description:
      "A clean gaming desk concept with cable management and ambient RGB lighting.",
    features: [
      "Cable management",
      "RGB lighting",
      "Large surface",
      "Headset hook"
    ]
  }
];

let category = "All";

let cart = JSON.parse(
  localStorage.getItem("novaCart") || "[]"
);

let wishlist = JSON.parse(
  localStorage.getItem("novaWishlist") || "[]"
);

let discount = 0;
let discountCode = "";
let paymentType = "card";

let lastOrder = JSON.parse(
  localStorage.getItem("novaLastOrder") || "null"
);

const money = value =>
  "CHF " + Number(value).toFixed(2);

const byId = id =>
  products.find(product => product.id === id);

function save() {
  localStorage.setItem(
    "novaCart",
    JSON.stringify(cart)
  );

  localStorage.setItem(
    "novaWishlist",
    JSON.stringify(wishlist)
  );
}

function stars(rating) {
  return "★".repeat(Math.round(rating));
}

/* PRODUCTS */

function renderProducts() {

  const search =
    document
      .getElementById("searchInput")
      .value
      .trim()
      .toLowerCase();

  const sort =
    document.getElementById("sortSelect").value;

  let list = products.filter(product => {

    const categoryMatch =
      category === "All" ||
      product.category === category;

    const searchMatch =
      product.name
        .toLowerCase()
        .includes(search);

    return categoryMatch && searchMatch;
  });

  if (sort === "low") {
    list.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    list.sort((a, b) => b.price - a.price);
  }

  if (sort === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  }

  if (sort === "newest") {
    list.sort(
      (a, b) => Number(b.new) - Number(a.new)
    );
  }

  document.getElementById("resultCount").textContent =
    `${list.length} product${list.length === 1 ? "" : "s"} available`;

  const grid =
    document.getElementById("productsGrid");

  if (!list.length) {

    grid.innerHTML = `
      <div style="
        grid-column:1/-1;
        text-align:center;
        padding:60px;
        color:#69746d
      ">
        <h3>No products found</h3>
        <p>Try another search or category.</p>
      </div>
    `;

    return;
  }

  grid.innerHTML = list.map(product => {

    const saved =
      wishlist.includes(product.id);

    return `
      <article class="product">

        <div class="product-image">

          <button
            class="wish ${saved ? "saved" : ""}"
            onclick="toggleWishlist(${product.id})"
          >
            ${saved ? "♥" : "♡"}
          </button>

          ${
            product.new
              ? `
                <span style="
                  position:absolute;
                  left:12px;
                  top:12px;
                  background:#e9f8ee;
                  color:#168a40;
                  font-size:9px;
                  font-weight:900;
                  padding:5px 7px;
                  border-radius:6px
                ">
                  NEW
                </span>
              `
              : ""
          }

          <span>${product.icon}</span>

        </div>

        <div class="product-info">

          <span class="category">
            ${product.category}
          </span>

          <h3>${product.name}</h3>

          <div class="rating">
            ${stars(product.rating)}
            <span>
              ${product.rating} · ${product.reviews} reviews
            </span>
          </div>

          <div class="product-bottom">

            <div class="price">
              ${money(product.price)}
            </div>

            <button
              class="add"
              onclick="addToCart(${product.id})"
            >
              Add +
            </button>

          </div>

          <button
            class="view"
            onclick="openProduct(${product.id})"
          >
            View product details
          </button>

        </div>

      </article>
    `;

  }).join("");
}

function setCategory(newCategory, element) {

  category = newCategory;

  document
    .querySelectorAll(".filter")
    .forEach(button =>
      button.classList.remove("active")
    );

  element.classList.add("active");

  renderProducts();
}

/* CART */

function addToCart(id) {

  const existing =
    cart.find(item => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id,
      qty: 1
    });
  }

  save();
  updateCart();

  toast("Added to cart ✓");
}

function changeQty(id, amount) {

  const item =
    cart.find(product => product.id === id);

  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    cart = cart.filter(
      product => product.id !== id
    );
  }

  save();
  updateCart();
}

function removeItem(id) {

  cart = cart.filter(
    item => item.id !== id
  );

  save();
  updateCart();

  toast("Removed from cart");
}

function cartSubtotal() {

  return cart.reduce(
    (total, item) =>
      total +
      byId(item.id).price * item.qty,
    0
  );
}

function selectedShipping() {

  const method =
    document.querySelector(
      'input[name="shippingMethod"]:checked'
    )?.value;

  if (method === "express") {
    return 14.90;
  }

  return cartSubtotal() >= 100
    ? 0
    : 6.90;
}

function updateCart() {

  document.getElementById("cartCount").textContent =
    cart.reduce(
      (total, item) => total + item.qty,
      0
    );

  const box =
    document.getElementById("cartItems");

  const bottom =
    document.getElementById("cartBottom");

  if (!cart.length) {

    box.innerHTML = `
      <div style="
        text-align:center;
        padding:70px 10px;
        color:#77817b;
        font-size:14px
      ">
        <div style="font-size:48px">🛒</div>

        <h3 style="
          color:#26332b;
          margin:10px 0
        ">
          Your cart is empty
        </h3>

        <p>Add a product to get started.</p>
      </div>
    `;

    bottom.innerHTML = "";

    return;
  }

  box.innerHTML = cart.map(item => {

    const product = byId(item.id);

    return `
      <div class="cart-item">

        <div class="cart-icon">
          ${product.icon}
        </div>

        <div class="cart-content">

          <h4>${product.name}</h4>

          <div class="cart-price">
            ${money(product.price)}
          </div>

          <div class="qty">

            <button
              onclick="changeQty(${product.id},-1)"
            >
              −
            </button>

            <b>${item.qty}</b>

            <button
              onclick="changeQty(${product.id},1)"
            >
              +
            </button>

          </div>

          <button
            class="remove"
            onclick="removeItem(${product.id})"
          >
            Remove
          </button>

        </div>

      </div>
    `;

  }).join("");

  const subtotal = cartSubtotal();
  const shipping = selectedShipping();

  const finalTotal =
    Math.max(
      0,
      subtotal + shipping - discount
    );

  bottom.innerHTML = `
    <div class="cart-summary">

      <div class="promo">

        <input
          id="promoInput"
          placeholder="Promo code"
          value="${discountCode}"
        >

        <button onclick="applyPromo()">
          Apply
        </button>

      </div>

      <div
        id="promoMessage"
        class="promo-message"
      ></div>

      <div class="line">
        <span>Subtotal</span>
        <b>${money(subtotal)}</b>
      </div>

      <div class="line">
        <span>Shipping</span>
        <b>
          ${
            shipping === 0
              ? "FREE"
              : money(shipping)
          }
        </b>
      </div>

      ${
        discount
          ? `
            <div class="line success-text">
              <span>
                Discount (${discountCode})
              </span>

              <b>
                −${money(discount)}
              </b>
            </div>
          `
          : ""
      }

      <hr>

      <div class="line total">
        <span>Total</span>
        <b>${money(finalTotal)}</b>
      </div>

      <button
        class="btn primary full"
        onclick="startCheckout()"
      >
        Proceed to checkout →
      </button>

    </div>
  `;
}

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

/* PROMO */

function applyPromo() {

  const input =
    document
      .getElementById("promoInput")
      .value
      .trim()
      .toUpperCase();

  if (input === "NOVA10") {

    discount =
      Math.min(
        cartSubtotal() * 0.10,
        100
      );

    discountCode = input;

    toast("10% discount applied ✓");

  } else {

    discount = 0;
    discountCode = "";

    if (input) {
      toast("Invalid code — try NOVA10");
    }
  }

  updateCart();
}

/* WISHLIST */

function updateCounts() {

  document.getElementById(
    "wishlistCount"
  ).textContent = wishlist.length;
}

function toggleWishlist(id) {

  if (wishlist.includes(id)) {

    wishlist =
      wishlist.filter(
        productId => productId !== id
      );

    toast("Removed from wishlist");

  } else {

    wishlist.push(id);

    toast("Saved to wishlist ♥");
  }

  save();
  updateCounts();
  renderProducts();
}

function openWishlist() {

  const box =
    document.getElementById("wishlistItems");

  if (!wishlist.length) {

    box.innerHTML = `
      <div style="
        text-align:center;
        padding:70px 10px;
        color:#77817b
      ">

        <div style="font-size:48px">♡</div>

        <h3 style="
          color:#26332b;
          margin:10px
        ">
          Nothing saved yet
        </h3>

        <p>
          Click the heart on a product to save it.
        </p>

      </div>
    `;

  } else {

    box.innerHTML =
      wishlist.map(id => {

        const product = byId(id);

        return `
          <div class="cart-item">

            <div class="cart-icon">
              ${product.icon}
            </div>

            <div class="cart-content">

              <h4>${product.name}</h4>

              <div class="cart-price">
                ${money(product.price)}
              </div>

              <button
                class="add"
                style="margin-top:9px"
                onclick="addToCart(${product.id})"
              >
                Add to cart
              </button>

              <button
                class="remove"
                onclick="toggleWishlist(${product.id});openWishlist()"
              >
                Remove
              </button>

            </div>

          </div>
        `;

      }).join("");
  }

  document
    .getElementById("wishlistOverlay")
    .classList.remove("hidden");
}

function closeWishlist(event) {

  if (
    !event ||
    event.target.id === "wishlistOverlay"
  ) {
    document
      .getElementById("wishlistOverlay")
      .classList.add("hidden");
  }
}

/* PRODUCT DETAILS */

function openProduct(id) {

  const product = byId(id);

  document.getElementById(
    "productDetail"
  ).innerHTML = `

    <div class="detail">

      <div class="detail-image">
        ${product.icon}
      </div>

      <div>

        <div class="eyebrow">
          ${product.category}
        </div>

        <h2>${product.name}</h2>

        <div class="rating">
          ${stars(product.rating)}
          <span>
            ${product.rating} · ${product.reviews} reviews
          </span>
        </div>

        <div
          class="price"
          style="font-size:24px"
        >
          ${money(product.price)}
        </div>

        <p>${product.description}</p>

        <ul class="detail-list">

          ${product.features
            .map(feature =>
              `<li>${feature}</li>`
            )
            .join("")}

        </ul>

        <button
          class="btn primary full"
          style="margin-top:20px"
          onclick="addToCart(${product.id});closeProduct()"
        >
          Add to cart
        </button>

      </div>

    </div>
  `;

  document
    .getElementById("productOverlay")
    .classList.remove("hidden");
}

function closeProduct(event) {

  if (
    !event ||
    event.target.id === "productOverlay"
  ) {
    document
      .getElementById("productOverlay")
      .classList.add("hidden");
  }
}

/* CHECKOUT */

function startCheckout() {

  if (!cart.length) {
    toast("Your cart is empty");
    return;
  }

  closeCart();

  discount =
    Math.min(discount, cartSubtotal());

  goCheckout(1);

  document
    .getElementById("checkoutOverlay")
    .classList.remove("hidden");
}

function closeCheckout() {

  document
    .getElementById("checkoutOverlay")
    .classList.add("hidden");
}

function clearErrors() {

  document
    .querySelectorAll(".error")
    .forEach(error =>
      error.textContent = ""
    );

  document
    .querySelectorAll(".checkout-step input")
    .forEach(input => {
      input.classList.remove(
        "invalid",
        "valid"
      );
    });
}

function setValid(
  id,
  valid,
  message
) {

  const input =
    document.getElementById(id);

  const error =
    document.getElementById(
      id + "Error"
    );

  if (!input) return false;

  input.classList.toggle(
    "valid",
    valid
  );

  input.classList.toggle(
    "invalid",
    !valid
  );

  if (error) {
    error.textContent =
      valid ? "" : message;
  }

  return valid;
}

/* DELIVERY VALIDATION */

function validateDelivery() {

  let valid = true;

  const name =
    document.getElementById("name")
      .value.trim();

  const email =
    document.getElementById("email")
      .value.trim();

  const address =
    document.getElementById("address")
      .value.trim();

  const zip =
    document.getElementById("zip")
      .value.trim();

  const city =
    document.getElementById("city")
      .value.trim();

  const validName =
    /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,60}$/
      .test(name);

  const validEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email);

  const validAddress =
    address.length >= 5;

  /*
    IMPORTANT:
    Swiss postal codes are exactly
    four numerical digits.

    Therefore:
    "8000"  → valid
    "8604"  → valid
    "zuri"  → invalid
    "800"   → invalid
    "80000" → invalid
  */

  const validZip =
    /^\d{4}$/.test(zip);

  const validCity =
    /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/
      .test(city);

  if (
    !setValid(
      "name",
      validName,
      "Enter a valid name."
    )
  ) valid = false;

  if (
    !setValid(
      "email",
      validEmail,
      "Enter a valid email address."
    )
  ) valid = false;

  if (
    !setValid(
      "address",
      validAddress,
      "Enter your street and house number."
    )
  ) valid = false;

  if (
    !setValid(
      "zip",
      validZip,
      "Swiss postal code must contain exactly 4 digits."
    )
  ) valid = false;

  if (
    !setValid(
      "city",
      validCity,
      "Enter a valid city name."
    )
  ) valid = false;

  return valid;
}

/* PAYMENT */

function formatCard(value) {

  const digits =
    value
      .replace(/\D/g, "")
      .slice(0, 16);

  return digits
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function validatePayment() {

  if (paymentType === "wallet") {
    return true;
  }

  let valid = true;

  const card =
    document
      .getElementById("card")
      .value
      .replace(/\D/g, "");

  const expiry =
    document
      .getElementById("expiry")
      .value
      .trim();

  const cvc =
    document
      .getElementById("cvc")
      .value
      .trim();

  const name =
    document
      .getElementById("cardName")
      .value
      .trim();

  const validCard =
    /^\d{16}$/.test(card);

  const expiryMatch =
    expiry.match(
      /^(\d{2})\/(\d{2})$/
    );

  const validExpiry =
    expiryMatch &&
    Number(expiryMatch[1]) >= 1 &&
    Number(expiryMatch[1]) <= 12;

  const validCvc =
    /^\d{3}$/.test(cvc);

  const validName =
    /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,60}$/
      .test(name);

  if (
    !setValid(
      "card",
      validCard,
      "Enter 16 digits for the demo card."
    )
  ) valid = false;

  if (
    !setValid(
      "expiry",
      Boolean(validExpiry),
      "Use MM/YY with a valid month."
    )
  ) valid = false;

  if (
    !setValid(
      "cvc",
      validCvc,
      "CVC must contain exactly 3 digits."
    )
  ) valid = false;

  if (
    !setValid(
      "cardName",
      validName,
      "Enter the name shown on the demo card."
    )
  ) valid = false;

  return valid;
}

/* CHECKOUT NAVIGATION */

function goCheckout(step) {

  if (
    step === 2 &&
    !validateDelivery()
  ) {
    return;
  }

  if (
    step === 3 &&
    !validatePayment()
  ) {
    return;
  }

  document
    .querySelectorAll(".checkout-step")
    .forEach(element =>
      element.classList.add("hidden")
    );

  document
    .getElementById("checkoutSuccess")
    .classList.add("hidden");

  document
    .getElementById("checkout" + step)
    .classList.remove("hidden");

  document
    .querySelectorAll(".step")
    .forEach((element, index) => {

      element.classList.toggle(
        "active",
        index < step
      );

    });

  if (step === 3) {
    renderReview();
  }
}

function selectPayment(
  type,
  button
) {

  paymentType = type;

  document
    .querySelectorAll(".payment-tab")
    .forEach(tab =>
      tab.classList.remove("active")
    );

  button.classList.add("active");

  document
    .getElementById("cardFields")
    .classList.toggle(
      "hidden",
      type !== "card"
    );

  document
    .getElementById("walletFields")
    .classList.toggle(
      "hidden",
      type !== "wallet"
    );
}

function updateCheckoutTotal() {
  /*
    The total is recalculated when
    the review page is generated.
  */
}

function renderReview() {

  const box =
    document.getElementById(
      "reviewBox"
    );

  box.innerHTML =
    cart.map(item => {

      const product =
        byId(item.id);

      return `
        <div class="review-item">

          <span>
            ${product.name} × ${item.qty}
          </span>

          <b>
            ${money(
              product.price * item.qty
            )}
          </b>

        </div>
      `;

    }).join("");

  const subtotal =
    cartSubtotal();

  const shipping =
    selectedShipping();

  const finalTotal =
    Math.max(
      0,
      subtotal +
      shipping -
      discount
    );

  document.getElementById(
    "reviewSubtotal"
  ).textContent =
    money(subtotal);

  document.getElementById(
    "reviewShipping"
  ).textContent =
    shipping === 0
      ? "FREE"
      : money(shipping);

  document.getElementById(
    "reviewDiscount"
  ).textContent =
    discount
      ? `−${money(discount)}`
      : "—";

  document.getElementById(
    "reviewTotal"
  ).textContent =
    money(finalTotal);

  document.getElementById(
    "discountRow"
  ).style.display =
    discount ? "flex" : "none";
}

/* PLACE ORDER */

function placeOrder() {

  const number =
    "NT-" +
    Math.floor(
      100000 +
      Math.random() * 900000
    );

  lastOrder = {
    number,
    name:
      document
        .getElementById("name")
        .value
        .trim(),

    total:
      Math.max(
        0,
        cartSubtotal() +
        selectedShipping() -
        discount
      )
  };

  localStorage.setItem(
    "novaLastOrder",
    JSON.stringify(lastOrder)
  );

  document
    .querySelectorAll(".checkout-step")
    .forEach(element =>
      element.classList.add("hidden")
    );

  document
    .getElementById("checkoutSuccess")
    .classList.remove("hidden");

  document.getElementById(
    "orderNumber"
  ).textContent =
    number;

  document.getElementById(
    "successName"
  ).textContent =
    lastOrder.name.split(" ")[0] ||
    "there";

  cart = [];

  discount = 0;
  discountCode = "";

  save();
  updateCart();
  updateCounts();
}

/* TRACKING */

function openTracking() {

  if (!lastOrder) {
    toast("No demo order yet");
    return;
  }

  document.getElementById(
    "trackingNumber"
  ).textContent =
    lastOrder.number;

  document
    .getElementById("trackingOverlay")
    .classList.remove("hidden");
}

function closeTracking(event) {

  if (
    !event ||
    event.target.id === "trackingOverlay"
  ) {
    document
      .getElementById("trackingOverlay")
      .classList.add("hidden");
  }
}

/* DEMO MODAL */

function openDemo() {

  document
    .getElementById("demoOverlay")
    .classList.remove("hidden");
}

function closeDemo(event) {

  if (
    !event ||
    event.target.id === "demoOverlay"
  ) {
    document
      .getElementById("demoOverlay")
      .classList.add("hidden");
  }
}

/* INPUT FORMATTING */

document.addEventListener(
  "input",
  event => {

    const input = event.target;

    /*
      Postal code:
      ONLY numbers.
      Maximum 4 digits.
    */

    if (input.id === "zip") {

      input.value =
        input.value
          .replace(/\D/g, "")
          .slice(0, 4);
    }

    /*
      Card:
      Numbers only, automatically
      formatted into groups of four.
    */

    if (input.id === "card") {
      input.value =
        formatCard(input.value);
    }

    /*
      Expiry:
      Automatically creates MM/YY.
    */

    if (input.id === "expiry") {

      let value =
        input.value
          .replace(/\D/g, "")
          .slice(0, 4);

      if (value.length > 2) {
        value =
          value.slice(0, 2) +
          "/" +
          value.slice(2);
      }

      input.value = value;
    }

    /*
      CVC:
      Numbers only, maximum 3 digits.
    */

    if (input.id === "cvc") {

      input.value =
        input.value
          .replace(/\D/g, "")
          .slice(0, 3);
    }

  }
);

/* TOAST */

function toast(message) {

  const element =
    document.getElementById("toast");

  element.textContent = message;

  element.classList.add("show");

  clearTimeout(
    window.toastTimer
  );

  window.toastTimer =
    setTimeout(() => {

      element.classList.remove(
        "show"
      );

    }, 1800);
}

/* START */

renderProducts();
updateCart();
updateCounts();
