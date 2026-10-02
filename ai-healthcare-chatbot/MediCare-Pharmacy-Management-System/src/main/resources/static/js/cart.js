const session = requireRole("CUSTOMER");
if (session) {
  renderNavbar("cart");
  loadCart();
}

document.getElementById("checkout-btn").addEventListener("click", () => {
  window.location.href = "/customer/checkout.html";
});

async function loadCart() {
  const container = document.getElementById("cart-items");
  try {
    const res = await api.get("/cart/" + session.id);
    renderCart(res.data || []);
  } catch (err) {
    container.innerHTML = "";
    showToast(err.message || "Failed to load cart", "error");
  }
}

function renderCart(items) {
  const container = document.getElementById("cart-items");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (items.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="icon">&#128722;</div><p>Your cart is empty.</p><a href="/customer/catalog.html" class="btn btn-primary">Browse Medicines</a></div>`;
    document.getElementById("summary-count").textContent = "0";
    document.getElementById("summary-total").textContent = formatCurrency(0);
    checkoutBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;

  container.innerHTML = items.map((item) => `
    <div class="cart-item" data-id="${item.id}">
      <div class="med-icon">&#128138;</div>
      <div class="info">
        <div style="font-weight:600;">${escapeHtml(item.drugName)}</div>
        <div class="text-muted">${formatCurrency(item.price)} each &middot; ${item.availableStock} in stock</div>
      </div>
      <div class="qty-control">
        <button class="qty-decrease">-</button>
        <input type="number" class="qty-input" value="${item.quantity}" min="1" max="${item.availableStock}" />
        <button class="qty-increase">+</button>
      </div>
      <div style="font-weight:700;min-width:90px;text-align:right;">${formatCurrency(item.totalPrice)}</div>
      <button class="btn btn-danger btn-sm remove-btn">Remove</button>
    </div>
  `).join("");

  const totalCount = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + Number(i.totalPrice), 0);
  document.getElementById("summary-count").textContent = totalCount;
  document.getElementById("summary-total").textContent = formatCurrency(totalPrice);

  container.querySelectorAll(".cart-item").forEach((row) => {
    const cartId = row.dataset.id;
    const input = row.querySelector(".qty-input");

    row.querySelector(".qty-decrease").addEventListener("click", () => {
      const val = Math.max(1, parseInt(input.value, 10) - 1);
      input.value = val;
      updateQuantity(cartId, val);
    });
    row.querySelector(".qty-increase").addEventListener("click", () => {
      const max = parseInt(input.max, 10);
      const val = Math.min(max, parseInt(input.value, 10) + 1);
      input.value = val;
      updateQuantity(cartId, val);
    });
    input.addEventListener("change", () => {
      let val = parseInt(input.value, 10) || 1;
      val = Math.max(1, Math.min(parseInt(input.max, 10), val));
      input.value = val;
      updateQuantity(cartId, val);
    });
    row.querySelector(".remove-btn").addEventListener("click", () => removeItem(cartId));
  });
}

async function updateQuantity(cartId, quantity) {
  try {
    await api.put("/cart/" + cartId, { quantity });
    loadCart();
    refreshCartCount();
  } catch (err) {
    showToast(err.message || "Failed to update quantity", "error");
    loadCart();
  }
}

async function removeItem(cartId) {
  try {
    await api.del("/cart/" + cartId);
    showToast("Item removed from cart", "success");
    loadCart();
    refreshCartCount();
  } catch (err) {
    showToast(err.message || "Failed to remove item", "error");
  }
}
