const session = requireRole("CUSTOMER");
if (session) {
  renderNavbar("catalog");
  loadDetails();
}

function getIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadDetails() {
  const id = getIdFromQuery();
  const card = document.getElementById("detail-card");
  if (!id) {
    card.innerHTML = `<p class="text-muted">No medicine specified.</p>`;
    return;
  }

  try {
    const res = await api.get("/drugs/" + id);
    const d = res.data;
    const disableAdd = d.expired || !d.inStock;

    card.innerHTML = `
      <div class="med-icon" style="width:64px;height:64px;font-size:2.2rem;">&#128138;</div>
      <span class="category-tag">${escapeHtml(d.category)}</span>
      <h2 style="margin:10px 0 4px;">${escapeHtml(d.name)}</h2>
      <p class="text-muted">${escapeHtml(d.manufacturer)}</p>
      <p>${escapeHtml(d.description || "No description available.")}</p>
      <div class="price" style="font-size:1.5rem;">${formatCurrency(d.price)}</div>
      <p class="text-muted">Expiry date: ${formatDate(d.expiryDate)}</p>
      ${d.expired ? `<span class="badge badge-danger">Expired - not available for order</span>` :
        (!d.inStock ? `<span class="badge badge-danger">Out of stock</span>` :
        `<span class="badge badge-success">In stock: ${d.stockQuantity} units</span>`)}
      <div class="flex gap-12 mt-16">
        <input type="number" id="qty-input" class="form-control" value="1" min="1" style="max-width:100px;" ${disableAdd ? "disabled" : ""} />
        <button id="add-cart-btn" class="btn btn-primary" ${disableAdd ? "disabled" : ""}>Add to Cart</button>
      </div>
    `;

    const addBtn = document.getElementById("add-cart-btn");
    if (addBtn) {
      addBtn.addEventListener("click", async () => {
        const qty = Math.max(1, parseInt(document.getElementById("qty-input").value, 10) || 1);
        try {
          await api.post("/cart/add", { customerId: session.id, drugId: d.id, quantity: qty });
          showToast("Medicine added to cart", "success");
          refreshCartCount();
        } catch (err) {
          showToast(err.message || "Could not add to cart", "error");
        }
      });
    }
  } catch (err) {
    card.innerHTML = `<p class="text-muted">Medicine not found.</p>`;
    showToast(err.message || "Failed to load medicine", "error");
  }
}
