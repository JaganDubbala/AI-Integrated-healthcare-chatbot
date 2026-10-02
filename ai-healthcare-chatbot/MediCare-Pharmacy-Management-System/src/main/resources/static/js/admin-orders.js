const session = requireRole("ADMIN");
if (session) {
  renderNavbar("admin-orders");
  renderSidebar("orders");
  loadOrders();
}

const STATUS_OPTIONS = ["PLACED", "PROCESSED", "SHIPPED", "DELIVERED"];

async function loadOrders() {
  const container = document.getElementById("orders-table");
  try {
    const res = await api.get("/orders");
    const orders = res.data || [];

    if (orders.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="icon">&#128230;</div><p>No orders placed yet.</p></div>`;
      return;
    }

    container.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Update</th><th></th></tr></thead>
          <tbody>
            ${orders.map((o) => `
              <tr>
                <td>#${o.id}</td>
                <td>${escapeHtml(o.customerName)}</td>
                <td>${formatDateTime(o.orderDate)}</td>
                <td>${o.items.length}</td>
                <td>${formatCurrency(o.totalAmount)}</td>
                <td><span class="badge badge-info">${o.status}</span></td>
                <td>
                  <select class="form-control status-select" data-id="${o.id}" data-current="${o.status}" style="padding:6px;">
                    ${STATUS_OPTIONS.map((s) => `<option value="${s}" ${s === o.status ? "selected" : ""} ${STATUS_OPTIONS.indexOf(s) < STATUS_OPTIONS.indexOf(o.status) ? "disabled" : ""}>${s}</option>`).join("")}
                  </select>
                </td>
                <td><a href="/admin/order-details.html?id=${o.id}" class="btn btn-outline btn-sm">Details</a></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;

    container.querySelectorAll(".status-select").forEach((select) => {
      select.addEventListener("change", () => updateStatus(select));
    });
  } catch (err) {
    container.innerHTML = "";
    showToast(err.message || "Failed to load orders", "error");
  }
}

async function updateStatus(select) {
  const id = select.dataset.id;
  const newStatus = select.value;
  const previous = select.dataset.current;

  try {
    await api.put("/orders/" + id + "/status", { status: newStatus });
    showToast("Order #" + id + " status updated to " + newStatus, "success");
    loadOrders();
  } catch (err) {
    showToast(err.message || "Failed to update order status", "error");
    select.value = previous;
  }
}
