const productsContainer = document.getElementById("products");
const API_URL = "http://localhost:5000/api/products?category=Homme";

async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    const products = await res.json();

    productsContainer.innerHTML = "";

    products.forEach(product => {
      const card = document.createElement("div");

      card.className = "bg-white rounded shadow p-4";

      card.innerHTML = `
        <img 
          src="${product.image}" 
          alt="${product.name}" 
          class="h-48 w-full object-cover mb-4 rounded"
        >
        <h2 class="text-xl font-bold">${product.name}</h2>
        <p class="text-gray-600 text-sm mb-2">${product.description || ""}</p>
        <p class="font-bold text-purple-700">${product.price} FCFA</p>
      `;

      productsContainer.appendChild(card);
    });

  } catch (err) {
    productsContainer.innerHTML = "<p>❌ Impossible de charger les produits</p>";
    console.error(err);
  }
}

loadProducts();
