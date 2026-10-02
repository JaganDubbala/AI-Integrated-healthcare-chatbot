const session = requireRole("CUSTOMER");
if (session) {
  renderNavbar("orders");
  loadOrder();
}

const STATUS_STEPS = ["PLACED", "PROCESSED", "SHIPPED", "DELIVERED"];

function getIdFromQuery() {
  return new URLSearchParams(window.location.search).get("id");
}

async function loadOrder() {
  const id = getIdFromQuery();
  const card = document.getElementById("order-detail-card");
  if (!id) {
    card.innerHTML = `<p class="text-muted">No order specified.</p>`;
    return;
  }

  try {
    const res = await api.get("/orders/" + id);
    const order = res.data;
    const currentIndex = STATUS_STEPS.indexOf(order.status);

    card.innerHTML = `
      <div class="flex-between mb-16">
        <div>
          <h2 class="section-title" style="margin-bottom:4px;">Order #${order.id}</h2>
          <p class="text-muted">Placed on ${formatDateTime(order.orderDate)}</p>
        </div>
        <span class="badge badge-info">${order.status}</span>
      </div>

      <div class="status-stepper">
        ${STATUS_STEPS.map((step, idx) => `
          <div class="step ${idx <= currentIndex ? "done" : ""}">
            <div class="dot">${idx <= currentIndex ? "&#10003;" : idx + 1}</div>
            <span>${step}</span>
          </div>
        `).join("")}
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Medicine</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
          <tbody>
            ${order.items.map((i) => `
              <tr>
                <td>${escapeHtml(i.drugName)}</td>
                <td>${i.quantity}</td>
                <td>${formatCurrency(i.price)}</td>
                <td>${formatCurrency(i.subtotal)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div class="cart-summary total"><span>Total Amount</span><span>${formatCurrency(order.totalAmount)}</span></div>
    `;
  } catch (err) {
    card.innerHTML = `<p class="text-muted">Order not found.</p>`;
    showToast(err.message || "Failed to load order", "error");
  }
}
