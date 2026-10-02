const session = requireRole("ADMIN");
if (session) {
  renderNavbar("admin-customers");
  renderSidebar("customers");
  loadCustomers();
}

async function loadCustomers() {
  const container = document.getElementById("customers-table");
  try {
    const res = await api.get("/customers");
    const customers = res.data || [];

    if (customers.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="icon">&#128101;</div><p>No customers registered yet.</p></div>`;
      return;
    }

    container.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th></tr></thead>
          <tbody>
            ${customers.map((c) => `
              <tr>
                <td>#${c.id}</td>
                <td>${escapeHtml(c.name)}</td>
                <td>${escapeHtml(c.email)}</td>
                <td>${escapeHtml(c.phone)}</td>
                <td>${escapeHtml(c.address)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    container.innerHTML = "";
    showToast(err.message || "Failed to load customers", "error");
  }
}
