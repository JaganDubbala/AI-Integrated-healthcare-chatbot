const session = requireRole("ADMIN");
if (session) {
  renderNavbar("admin-medicines");
  renderSidebar("medicines");
  loadMedicines();
}

document.getElementById("search-btn").addEventListener("click", loadMedicines);
document.getElementById("clear-btn").addEventListener("click", () => {
  document.getElementById("search-name").value = "";
  document.getElementById("search-category").value = "";
  loadMedicines();
});

async function loadMedicines() {
  const name = document.getElementById("search-name").value.trim();
  const category = document.getElementById("search-category").value.trim();
  const container = document.getElementById("medicines-table");

  try {
    let path = "/drugs";
    if (name || category) {
      const params = new URLSearchParams();
      if (name) params.set("name", name);
      if (category) params.set("category", category);
      path = "/drugs/search?" + params.toString();
    }
    const res = await api.get(path);
    renderTable(res.data || []);
  } catch (err) {
    container.innerHTML = "";
    showToast(err.message || "Failed to load medicines", "error");
  }
}

function renderTable(drugs) {
  const container = document.getElementById("medicines-table");
  if (drugs.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="icon">&#128138;</div><p>No medicines found.</p></div>`;
    return;
  }

  container.innerHTML = `
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr><th>Name</th><th>Category</th><th>Manufacturer</th><th>Price</th><th>Stock</th><th>Expiry</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${drugs.map((d) => `
            <tr>
              <td>${escapeHtml(d.name)}</td>
              <td>${escapeHtml(d.category)}</td>
              <td>${escapeHtml(d.manufacturer)}</td>
              <td>${formatCurrency(d.price)}</td>
              <td>${d.stockQuantity}</td>
              <td>${formatDate(d.expiryDate)}</td>
              <td>${d.expired ? `<span class="badge badge-danger">Expired</span>` : (d.inStock ? `<span class="badge badge-success">In Stock</span>` : `<span class="badge badge-warning">Out of Stock</span>`)}</td>
              <td class="flex gap-8">
                <a href="/admin/edit-medicine.html?id=${d.id}" class="btn btn-outline btn-sm">Edit</a>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${d.id}" data-name="${escapeHtml(d.name)}">Delete</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  container.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteDrug(btn.dataset.id, btn.dataset.name));
  });
}

async function deleteDrug(id, name) {
  if (!confirm("Delete " + name + "? This cannot be undone.")) return;
  try {
    await api.del("/drugs/" + id);
    showToast("Medicine deleted successfully", "success");
    loadMedicines();
  } catch (err) {
    showToast(err.message || "Failed to delete medicine", "error");
  }
}
