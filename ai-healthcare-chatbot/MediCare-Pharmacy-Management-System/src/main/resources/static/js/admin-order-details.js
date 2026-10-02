const session = requireRole("ADMIN");
if (session) {
  renderNavbar("admin-orders");
  renderSidebar("orders");
  loadOrder();
}

const STATUS_OPTIONS = ["PLACED", "PROCESSED", "SHIPPED", "DELIVERED"];

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

    card.innerHTML = `
      <div class="flex-between mb-16">
        <div>
          <h2 class="section-title" style="margin-bottom:4px;">Order #${order.id}</h2>
          <p class="text-muted">Customer: ${escapeHtml(order.customerName)} (ID #${order.customerId})</p>
          <p class="text-muted">Placed on ${formatDateTime(order.orderDate)}</p>
        </div>
        <div>
          <select class="form-control" id="status-select">
            ${STATUS_OPTIONS.map((s) => `<option value="${s}" ${s === order.status ? "selected" : ""} ${STATUS_OPTIONS.indexOf(s) < STATUS_OPTIONS.indexOf(order.status) ? "disabled" : ""}>${s}</option>`).join("")}
          </select>
        </div>
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

    document.getElementById("status-select").addEventListener("change", async (e) => {
      try {
        await api.put("/orders/" + order.id + "/status", { status: e.target.value });
        showToast("Order status updated to " + e.target.value, "success");
        loadOrder();
      } catch (err) {
        showToast(err.message || "Failed to update status", "error");
        loadOrder();
      }
    });
  } catch (err) {
    card.innerHTML = `<p class="text-muted">Order not found.</p>`;
    showToast(err.message || "Failed to load order", "error");
  }
}
