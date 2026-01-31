console.log("JS chargé");
const API_URL = "http://localhost:5000/api";

/* ================= TEST FINAL ================= */
console.log("✅ JS chargé");

/* ================= MENU MOBILE ================= */
const menuToggle = document.getElementById("menu-toggle");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const navMenu = document.querySelector("nav ul");
    navMenu.classList.toggle("hidden");
  });
}

/* ================= PANIER ================= */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ================= CHARGEMENT PRODUITS ================= */
async function loadProducts() {
  const productsContainer = document.getElementById("products");

  if (!productsContainer) {
    console.warn("⚠️ Div #products introuvable");
    return;
  }

  try {
    console.log("📡 Requête vers :", `${API_URL}/products`);

    const res = await fetch(`${API_URL}/products`);
    const products = await res.json();

    /* ===== TEST FINAL ===== */
    console.log("📦 Produits reçus :", products);

    productsContainer.innerHTML = "";

    if (!products || products.length === 0) {
      productsContainer.innerHTML =
        "<p class='text-center text-gray-500'>Aucun produit disponible</p>";
      return;
    }

    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "bg-white shadow rounded-lg p-4 text-center";

      card.innerHTML = `
        <img src="${product.image || 'https://via.placeholder.com/300'}" class="w-full rounded mb-4">
        <h3 class="font-bold text-xl">${product.name}</h3>
        <p class="text-gray-600">${product.category || ""}</p>
        <p class="font-bold text-purple-700 mt-2">${product.price} FCFA</p>
        <button
          class="add-to-cart mt-4 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
          data-id="${product._id || product.id}"
          data-name="${product.name}"
          data-price="${product.price}">
          Ajouter au panier
        </button>
      `;

      productsContainer.appendChild(card);
    });

    initAddToCart();

  } catch (error) {
    console.error("❌ Erreur chargement produits :", error);
  }
}

/* ================= AJOUT AU PANIER ================= */
function initAddToCart() {
  const addButtons = document.querySelectorAll(".add-to-cart");

  addButtons.forEach(button => {
    button.addEventListener("click", () => {
      const product = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: parseInt(button.dataset.price),
        quantity: 1
      };

      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));

      const message = document.getElementById("add-message");
      if (message) {
        message.classList.remove("hidden");
        setTimeout(() => message.classList.add("hidden"), 2500);
      } else {
        alert("Produit ajouté au panier 🛒");
      }
    });
  });
}

/* ================= AFFICHAGE PANIER ================= */
function displayCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const emptyCart = document.getElementById("empty-cart");

  if (!cartItems || !cartTotal) return;

  cartItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    emptyCart?.classList.remove("hidden");
  } else {
    emptyCart?.classList.add("hidden");
  }

  cart.forEach(item => {
    total += item.price;

    const li = document.createElement("li");
    li.className = "flex justify-between border-b py-2";
    li.innerHTML = `
      <span>${item.name}</span>
      <span>${item.price} FCFA</span>
    `;

    cartItems.appendChild(li);
  });

  cartTotal.textContent = total;
}

/* ================= COMMANDE ================= */
async function sendOrder(paymentMethod) {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        paymentMethod,
        date: new Date()
      })
    });

    const data = await res.json();

    alert("Commande confirmée ✅");
    localStorage.removeItem("cart");
    window.location.href = "index.html";

  } catch (error) {
    console.error("❌ Erreur commande :", error);
    alert("Erreur lors de la commande ❌");
  }
}

/* ================= LANCEMENT ================= */
loadProducts();
displayCart();

