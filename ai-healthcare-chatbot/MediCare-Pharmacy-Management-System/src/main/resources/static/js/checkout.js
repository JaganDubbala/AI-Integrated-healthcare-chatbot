const session = requireRole("CUSTOMER");
if (session) {
  renderNavbar("cart");
  loadCheckout();
}

async function loadCheckout() {
  try {
    const [cartRes, customerRes] = await Promise.all([
      api.get("/cart/" + session.id),
      api.get("/customers/" + session.id)
    ]);

    const items = cartRes.data || [];
    document.getElementById("delivery-address").textContent = customerRes.data.address;

    const itemsContainer = document.getElementById("checkout-items");
    const placeOrderBtn = document.getElementById("place-order-btn");

    if (items.length === 0) {
      itemsContainer.innerHTML = `<div class="empty-state"><div class="icon">&#128722;</div><p>Your cart is empty.</p><a href="/customer/catalog.html" class="btn btn-primary">Browse Medicines</a></div>`;
      placeOrderBtn.disabled = true;
      return;
    }

    itemsContainer.innerHTML = items.map((i) => `
      <div class="cart-summary">
        <span>${escapeHtml(i.drugName)} &times; ${i.quantity}</span>
        <span>${formatCurrency(i.totalPrice)}</span>
      </div>
    `).join("");

    const total = items.reduce((s, i) => s + Number(i.totalPrice), 0);
    document.getElementById("checkout-total").textContent = formatCurrency(total);

    placeOrderBtn.addEventListener("click", async () => {
      placeOrderBtn.disabled = true;
      placeOrderBtn.textContent = "Placing order...";
      try {
        const res = await api.post("/orders", { customerId: session.id });
        sessionStorage.setItem("medicare_last_order", JSON.stringify(res.data));
        showToast("Order placed successfully!", "success");
        refreshCartCount();
        setTimeout(() => (window.location.href = "/customer/order-confirmation.html"), 400);
      } catch (err) {
        showToast(err.message || "Failed to place order", "error");
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = "Place Order";
      }
    });
  } catch (err) {
    showToast(err.message || "Failed to load checkout", "error");
  }
}
