const session = requireRole("CUSTOMER");
if (session) {
  renderNavbar("catalog");
  loadMedicines();
}

document.getElementById("search-btn").addEventListener("click", loadMedicines);
document.getElementById("clear-btn").addEventListener("click", () => {
  document.getElementById("search-name").value = "";
  document.getElementById("search-category").value = "";
  loadMedicines();
});
document.getElementById("search-name").addEventListener("keyup", (e) => {
  if (e.key === "Enter") loadMedicines();
});

async function loadMedicines() {
  const name = document.getElementById("search-name").value.trim();
  const category = document.getElementById("search-category").value.trim();
  const list = document.getElementById("medicine-list");
  list.innerHTML = `<p class="text-muted">Loading medicines...</p>`;

  try {
    let path = "/drugs";
    if (name || category) {
      const params = new URLSearchParams();
      if (name) params.set("name", name);
      if (category) params.set("category", category);
      path = "/drugs/search?" + params.toString();
    }
    const res = await api.get(path);
    renderMedicines(res.data || []);
  } catch (err) {
    list.innerHTML = "";
    showToast(err.message || "Failed to load medicines", "error");
  }
}

function renderMedicines(drugs) {
  const list = document.getElementById("medicine-list");
  if (drugs.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="icon">&#128269;</div><p>No medicines found.</p></div>`;
    return;
  }

  list.innerHTML = drugs.map((d) => `
    <div class="medicine-card">
      <div class="med-icon">&#128138;</div>
      <span class="category-tag">${escapeHtml(d.category)}</span>
      <h3>${escapeHtml(d.name)}</h3>
      <div class="muted">${escapeHtml(d.manufacturer)}</div>
      <div class="price">${formatCurrency(d.price)}</div>
      ${d.expired ? `<span class="badge badge-danger">Expired</span>` :
        (!d.inStock ? `<span class="badge badge-danger">Out of stock</span>` :
        `<span class="badge badge-success">In stock: ${d.stockQuantity}</span>`)}
      <div class="flex gap-8 mt-16">
        <a href="/customer/medicine-details.html?id=${d.id}" class="btn btn-outline btn-sm">Details</a>
        <button class="btn btn-primary btn-sm add-cart-btn" data-id="${d.id}" ${(d.expired || !d.inStock) ? "disabled" : ""}>Add to Cart</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".add-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
  });
}

async function addToCart(drugId) {
  try {
    await api.post("/cart/add", { customerId: session.id, drugId, quantity: 1 });
    showToast("Medicine added to cart", "success");
    refreshCartCount();
  } catch (err) {
    showToast(err.message || "Could not add to cart", "error");
  }
}
