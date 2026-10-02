function renderSidebar(active) {
  const mount = document.getElementById("sidebar-mount");
  if (!mount) return;
  const items = [
    { key: "dashboard", href: "/admin/dashboard.html", label: "Dashboard", icon: "&#128202;" },
    { key: "medicines", href: "/admin/manage-medicines.html", label: "Manage Medicines", icon: "&#128138;" },
    { key: "customers", href: "/admin/customers.html", label: "Customers", icon: "&#128101;" },
    { key: "orders", href: "/admin/orders.html", label: "Orders", icon: "&#128230;" }
  ];

  mount.innerHTML = `
    <aside class="sidebar">
      ${items.map((i) => `<a href="${i.href}" class="${active === i.key ? "active" : ""}">${i.icon} ${i.label}</a>`).join("")}
    </aside>
  `;
}
