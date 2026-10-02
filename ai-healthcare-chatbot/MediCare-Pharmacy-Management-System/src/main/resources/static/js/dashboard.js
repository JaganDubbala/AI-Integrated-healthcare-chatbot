const session = requireRole("CUSTOMER");
if (session) {
  renderNavbar("dashboard");
  document.getElementById("welcome-heading").textContent = "Welcome back, " + session.name + "!";
  loadDashboard();
}

async function loadDashboard() {
  try {
    const [ordersRes, cartRes] = await Promise.all([
      api.get("/orders/customer/" + session.id),
      api.get("/cart/" + session.id)
    ]);

    const orders = ordersRes.data || [];
    const cart = cartRes.data || [];

    document.getElementById("stat-orders").textContent = orders.length;
    document.getElementById("stat-pending").textContent = orders.filter((o) => o.status !== "DELIVERED").length;
    document.getElementById("stat-cart").textContent = cart.reduce((s, i) => s + i.quantity, 0);

    const recentContainer = document.getElementById("recent-orders");
    const recent = orders.slice(0, 5);

    if (recent.length === 0) {
      recentContainer.innerHTML = `<div class="empty-state"><div class="icon">&#128230;</div><p>You have not placed any orders yet.</p><a href="/customer/catalog.html" class="btn btn-primary">Start Shopping</a></div>`;
      return;
    }

    recentContainer.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Order ID</th><th>Date</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>
            ${recent.map((o) => `
              <tr>
                <td>#${o.id}</td>
                <td>${formatDateTime(o.orderDate)}</td>
                <td>${formatCurrency(o.totalAmount)}</td>
                <td><span class="badge badge-${statusColor(o.status)}">${o.status}</span></td>
                <td><a href="/customer/order-details.html?id=${o.id}" class="btn btn-outline btn-sm">View</a></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    showToast(err.message || "Failed to load dashboard", "error");
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
