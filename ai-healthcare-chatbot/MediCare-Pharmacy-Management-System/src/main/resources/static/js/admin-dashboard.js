const session = requireRole("ADMIN");
if (session) {
  renderNavbar("admin-dashboard");
  renderSidebar("dashboard");
  loadDashboard();
}

async function loadDashboard() {
  try {
    const [drugsRes, customersRes, ordersRes] = await Promise.all([
      api.get("/drugs"),
      api.get("/customers"),
      api.get("/orders")
    ]);

    const drugs = drugsRes.data || [];
    const customers = customersRes.data || [];
    const orders = ordersRes.data || [];

    document.getElementById("stat-medicines").textContent = drugs.length;
    document.getElementById("stat-customers").textContent = customers.length;
    document.getElementById("stat-orders").textContent = orders.length;
    document.getElementById("stat-low-stock").textContent = drugs.filter((d) => d.expired || d.stockQuantity <= 5).length;

    const recent = orders.slice(0, 8);
    const container = document.getElementById("recent-orders");

    if (recent.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="icon">&#128230;</div><p>No orders yet.</p></div>`;
      return;
    }

    container.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>
            ${recent.map((o) => `
              <tr>
                <td>#${o.id}</td>
                <td>${escapeHtml(o.customerName)}</td>
                <td>${formatDateTime(o.orderDate)}</td>
                <td>${formatCurrency(o.totalAmount)}</td>
                <td><span class="badge badge-info">${o.status}</span></td>
                <td><a href="/admin/order-details.html?id=${o.id}" class="btn btn-outline btn-sm">View</a></td>
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
