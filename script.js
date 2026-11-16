// --- CART LOGIC ---
const cartCountElement = document.querySelector(".cart-count");
const cartItemsContainer = document.querySelector("#cart-items");
const emptyCartMessage = document.querySelector("#empty-cart");
const cartSummary = document.querySelector("#cart-summary");
const totalPriceElement = document.querySelector("#total-price");
const menuCakesGrid = document.querySelector("#menu-cakes-grid");
const menuBaklavaGrid = document.querySelector("#menu-baklava-grid");
const menuPuddingsGrid = document.querySelector("#menu-puddings-grid");
const menuZnoudGrid = document.querySelector("#menu-znoud-grid"); 
const feedbackForm = document.querySelector("#feedback-form");
const feedbackFormContainer = document.querySelector("#feedback-form-container");
const feedbackSuccess = document.querySelector("#feedback-success");
const menuBtn = document.querySelector("#menu-btn");


const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("shakarchi-cart")) || [];

    let totalItem = 0;
    cart.forEach((item) => {
        totalItem += item.quantity;
    });

    if (cartCountElement) {
        cartCountElement.textContent = totalItem;
    }
};

updateCartCount();
// --- GLOBAL ADD TO CART LOGIC ---
document.body.addEventListener("click", (event) => {
    const button = event.target.closest(".add-to-cart-btn");
    
    if (!button) return;

    const name = button.dataset.name;
    const price = parseInt(button.dataset.price);
    const image = button.dataset.image;

    let cart = JSON.parse(localStorage.getItem("shakarchi-cart")) || [];
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, image: image, quantity: 1 });
    }
    
    localStorage.setItem("shakarchi-cart", JSON.stringify(cart));
    updateCartCount();

    button.textContent = "✓";
    setTimeout(() => {
        button.textContent = "+";
    }, 1000);
});
// --- CART PAGE LOGIC ---

const renderCart = () => {
    // 1. Get the cart
    let cart = JSON.parse(localStorage.getItem("shakarchi-cart")) || [];

    // 2. If empty, show message and hide summary
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "";
        emptyCartMessage.style.display = "block";
        cartSummary.style.display = "none";
        return; // Stop the function here
    }

    // 3. If not empty, show the content
    emptyCartMessage.style.display = "none";
    cartSummary.style.display = "block";

    // 4. Generate HTML for every item
    let cartHTML = "";
    let totalPrice = 0;

    cart.forEach((item) => {
        totalPrice += item.price * item.quantity;

        // ... inside cart.forEach((item) => { ...

        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <!-- Use item.image here -->
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='images/logo-icon.png'">
                    <div>
                        <h4>${item.name}</h4>
                        <p>${item.price} د.ع</p>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <button class="decrease-btn" data-name="${item.name}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-btn" data-name="${item.name}">+</button>
                    <button class="remove-btn" data-name="${item.name}">×</button>
                </div>
            </div>
        `;
// ...
    });

    // 5. Put the HTML on the page
    cartItemsContainer.innerHTML = cartHTML;
    totalPriceElement.textContent = totalPrice.toLocaleString(); // Adds commas (e.g. 10,000)
    
    // --- Attach events to the +/- and remove buttons ---
    
    const increaseBtns = document.querySelectorAll(".increase-btn");
    increaseBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const name = btn.dataset.name;
            let cart = JSON.parse(localStorage.getItem("shakarchi-cart")) || [];

            const item = cart.find((i) => i.name === name);

            if (item) {
                item.quantity +=1;
                localStorage.setItem("shakarchi-cart", JSON.stringify(cart));

                renderCart(); // Re-draw the page
                updateCartCount(); // Update header number
            }
        });
    });

    // 2. Decrease Quantity

    const decreaseBtns = document.querySelectorAll(".decrease-btn");
    decreaseBtns.forEach((btn) => {
        btn.addEventListener("click" , () => {
            const name = btn.dataset.name;
            let cart = JSON.parse(localStorage.getItem("shakarchi-cart")) || [];

            const item = cart.find((i) => i.name === name);

            if(item) {
                item.quantity -= 1;
                
                if (item.quantity === 0) {
                    cart = cart.filter((i) => i.name !== name);
                }
                localStorage.setItem("shakarchi-cart", JSON.stringify(cart));
                
                renderCart();
                updateCartCount();
            }
        });
    });

    const removeBtns = document.querySelectorAll(".remove-btn");
    removeBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const name = btn.dataset.name;
            let cart = JSON.parse(localStorage.getItem("shakarchi-cart")) || [];

            cart = cart.filter((i) => i.name !== name);

            localStorage.setItem("shakarchi-cart", JSON.stringify(cart));
            renderCart();
            updateCartCount();
        });
    });
    // --- CHECKOUT BUTTON LOGIC ---

    const checkoutBtn = document.querySelector("#checkout-btn");

    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            let cart = JSON.parse(localStorage.getItem("shakarchi-cart")) || [];

            if (cart.length === 0) return;
// 1. Build the message
            let message = "سڵاو، دەمەوێت ئەم داواکارییە بکەم:\n\n";
            let total = 0;

            cart.forEach((item) => {
                message += `- ${item.name} (${item.quantity} دانە) = ${item.price * item.quantity} د.ع\n`;
                total += item.price * item.quantity;
            });

            message += `\nکۆی گشتی: ${total.toLocaleString()} د.ع`;
            message += `\n\nتکایە داواکارییەکەم پشتڕاست بکەنەوە.`;

            // 2. Encode the message so it works in a URL (replaces spaces with %20, etc.)
            const encodedMessage = encodeURIComponent(message);

            // 3. The phone number (Change this to the real Shakarchi number, including country code, no +)
            // Example for Iraq: 9647501234567
            const phoneNumber = "9647500000000"; 

            // 4. Open WhatsApp
            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
        };
    }
}

// 6. Run the render function when the page loads
if (cartItemsContainer) {
    renderCart();
}

// --- MENU PAGE LOGIC ---

// data

// --- MENU PAGE DATA ---

const cakesData = [
    { name: "کێکی گڵاس کرێم", price: 500, image: "images/کێکی گڵاس کرێم ٥٠٠.jpg" },
    { name: "کێکی گڵاس مۆز", price: 1000, image: "images/کێکی گڵاس مۆز ١٠٠٠.jpg" },
    { name: "کێکی نۆتێلا", price: 2000, image: "images/کێکی نۆتێلا ٢٠٠٠.jpg" },
    { name: "مینی کێک", price: 3000, image: "images/مینی کێک ٣٠٠٠.jpg" },
    { name: "ترالیچه", price: 3000, image: "images/تراجیلە ٣٠٠٠.jpg" },
    { name: "کێکی چوار گۆشە", price: 5000, image: "images/کێکی چوارگۆشە ٥٠٠٠.jpg" },
    { name: "کێکی پارچە بەدەستوری ئێرانی 500گ", price: 3500, image: "images/کێکی پارچە بە دەستوری ئێرانی ٥٠٠ کگم ٣٥٠٠.jpg" },
    { name: "کێکی پارچەی دەستوری لوبنانی 500گ", price: 4000, image: "images/کێکی پارچەی دەستوری لوبنانی ٥٠٠کگم ٤٠٠٠.jpg" },
    { name: "کێکی پارچە بەدەستوری ئێرانی 1ک", price: 7000, image: "images/کێکی پارچە بە دەستوری ئێرانی (١ کیلۆ) ٧٠٠٠.jpg" },
    { name: "کێکی پارچەی دەستوری لوبنانی 1ک", price: 8000, image: "images/کێکی پارچەی بە دەستوری لوبنانی (١ کیلۆ) ٨٠٠٠.jpg" },
    { name: "کێکی قاڵب (کیلۆ)", price: 9000, image: "images/کێکی قاڵب کیلۆی بە ٩٠٠٠.jpg" }
];

const baklavaData = [
    { name: "باقڵاوە تێکەڵ 250گ", price: 6000, image: "images/باقلاوا تێکەڵ ٢٥٠ گرام ٦٠٠٠.jpg" },
    { name: "باقڵاوای تێکەڵ (نیو کیلۆ)", price: 4500, image: "images/پاقلاواوای تێکەڵ نیو کیلۆ ٤٥٠٠.jpg" },
    { name: "باقڵاوای هێڵانە 500گ", price: 4500, image: "images/پاقلاوای هێلانە ٥٠٠گ ٤٥٠٠.jpg" },
    { name: "کلۆشکور (نیو کیلۆ)", price: 6000, image: "images/کلوشکور(نیو کیلۆ) ٦٠٠٠.jpg" },
    { name: "برمە (نیو کیلۆ)", price: 6000, image: "images/برمە (نیو کیلۆ) ٦٠٠٠.jpg" },
    { name: "باقڵوا مربع (نیو کیلۆ)", price: 6000, image: "images/پاقلاوا مربع (نیو کیلۆ) ٦٠٠٠.jpg" },
    { name: "دەمەماس (نیو کیلۆ)", price: 6000, image: "images/دەمەماسی (نیو کیلۆ) ٦٠٠٠.jpg" },
    { name: "باقڵاوای موشەکەل (1 کیلۆ)", price: 12000, image: "images/پاقلاوا بە موشەکەل(یەک کیلۆ) ١٢٠٠٠.jpg" },
    { name: "سوار (نیو کیلۆ)", price: 12000, image: "images/سوار (نیو کیلۆ) ١٢٠٠٠.jpg" },
    { name: "باقڵاوەی گوێز بەدەستوری تورکی", price: 14000, image: "images/پاقلاوای گوێز بە دەستوری تورکی سینی ١٤٠٠٠.jpg" },
    { name: "باقڵاوای فستق بە موشەکەلی (1 کیلۆ)", price: 24000, image: "images/پاقلاوای فستق بە موشەکەلی(یەک کیلۆ) ٢٤٠٠٠.jpg" }
];

const puddingsData = [
    { name: "محەلەبی سادە", price: 1000, image: "images/محەلەبی سادە١٠٠٠.jpg" },
    { name: "وشکەی ئێرانی (نیو کیلۆ)", price: 3500, image: "images/وشکەی ئێرانی نیو کیلۆ ٣٥٠٠.jpg" }
];

const znoudData = [
    { name: "زنود الست (نیو کیلۆ)", price: 4500, image: "images/زنود الست کیلۆ ٤٥٠٠.jpg" },
    { name: "زنود الست (1 کیلۆ)", price: 9000, image: "images/زنود الست ١ کیلۆ ٩٠٠٠.jpg" },
    { name: "قەمەری (نیو کیلۆ)", price: 6000, image: "images/قەمەری(نیو کیلۆ)٦٠٠٠.jpg" },
    { name: "دهێنەی نەجهف (نیو کیلۆ)", price: 4500, image: "images/دهینەی نەجەفی (نیو کیلۆ) ٤٥٠٠.jpg" }
];


const renderMenuItems = (data, container) => {
    if (!container) return;

    let htmlString ="";
    data.forEach((item) => {
htmlString += `
            <div class="dish-card">
                <img src="${item.image}" alt="${item.name}">
                <div class="dish-card-body">
                    <h3>${item.name}</h3>
                    <div class="dish-footer">
                        <span class="dish-price">${item.price} د.ع</span>
                        <button class="add-to-cart-btn" 
                                data-name="${item.name}" 
                                data-price="${item.price}" 
                                data-image="${item.image}">+</button>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = htmlString;
};

if (menuCakesGrid) {
    renderMenuItems(cakesData, menuCakesGrid);
    renderMenuItems(baklavaData, menuBaklavaGrid);
    renderMenuItems(puddingsData, menuPuddingsGrid);
    renderMenuItems(znoudData, menuZnoudGrid); 
}

// --- FEEDBACK PAGE LOGIC ---

if (feedbackForm) {
    feedbackForm.addEventListener("submit", (event) => {
        event.preventDefault();

        feedbackFormContainer.style.display= "none";
        feedbackSuccess.style.display = "block";
    });
}

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        siteNav.classList.toggle("active");
    });
}