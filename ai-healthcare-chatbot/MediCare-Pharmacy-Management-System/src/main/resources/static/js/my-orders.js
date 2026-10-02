const session = requireRole("CUSTOMER");
if (session) {
  renderNavbar("orders");
  loadOrders();
}

async function loadOrders() {
  const container = document.getElementById("orders-list");
  try {
    const res = await api.get("/orders/customer/" + session.id);
    const orders = res.data || [];

    if (orders.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="icon">&#128230;</div><p>You have not placed any orders yet.</p><a href="/customer/catalog.html" class="btn btn-primary">Browse Medicines</a></div>`;
      return;
    }

    container.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>
            ${orders.map((o) => `
              <tr>
                <td>#${o.id}</td>
                <td>${formatDateTime(o.orderDate)}</td>
                <td>${o.items.length}</td>
                <td>${formatCurrency(o.totalAmount)}</td>
                <td><span class="badge badge-${statusColor(o.status)}">${o.status}</span></td>
                <td><a href="/customer/order-details.html?id=${o.id}" class="btn btn-outline btn-sm">View Details</a></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    container.innerHTML = "";
    showToast(err.message || "Failed to load orders", "error");
  }
}

function statusColor(status) {
  switch (status) {
    case "DELIVERED": return "success";
    case "SHIPPED": return "info";
    case "PROCESSED": return "warning";
    default: return "info";
  }
}
