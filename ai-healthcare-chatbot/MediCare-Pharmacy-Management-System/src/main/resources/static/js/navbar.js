function renderNavbar(activePage) {
  const session = getSession();
  const mount = document.getElementById("navbar-mount");
  if (!mount) return;

  let linksHtml = "";

  if (!session) {
    linksHtml = `
      <a href="/index.html" class="${activePage === "home" ? "active" : ""}">Home</a>
      <a href="/login.html" class="${activePage === "login" ? "active" : ""}">Login</a>
      <a href="/register.html" class="${activePage === "register" ? "active" : ""}">Register</a>
    `;
  } else if (session.role === "ADMIN") {
    linksHtml = `
      <a href="/admin/dashboard.html" class="${activePage === "admin-dashboard" ? "active" : ""}">Dashboard</a>
      <a href="/admin/manage-medicines.html" class="${activePage === "admin-medicines" ? "active" : ""}">Medicines</a>
      <a href="/admin/customers.html" class="${activePage === "admin-customers" ? "active" : ""}">Customers</a>
      <a href="/admin/orders.html" class="${activePage === "admin-orders" ? "active" : ""}">Orders</a>
      <span class="text-muted">Hi, ${escapeHtml(session.name)}</span>
      <button id="logout-btn">Logout</button>
    `;
  } else {
    linksHtml = `
      <a href="/customer/dashboard.html" class="${activePage === "dashboard" ? "active" : ""}">Home</a>
      <a href="/customer/catalog.html" class="${activePage === "catalog" ? "active" : ""}">Medicines</a>
      <a href="/customer/my-orders.html" class="${activePage === "orders" ? "active" : ""}">My Orders</a>
      <a href="/customer/profile.html" class="${activePage === "profile" ? "active" : ""}">Profile</a>
      <a href="/customer/cart.html" class="cart-badge ${activePage === "cart" ? "active" : ""}">Cart<span class="count" id="cart-count">0</span></a>
      <button id="logout-btn">Logout</button>
    `;
  }

  mount.innerHTML = `
    <nav class="navbar">
      <a href="/index.html" class="brand"><span class="icon">&#128138;</span> MediCare</a>
      <div class="nav-links">${linksHtml}</div>
    </nav>
  `;

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
      showToast("Logged out successfully", "success");
      setTimeout(() => (window.location.href = "/index.html"), 400);
    });
  }

  if (session && session.role === "CUSTOMER") {
    refreshCartCount();
  }

  syncNavbarHeight();
}

function syncNavbarHeight() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  const apply = () => {
    document.documentElement.style.setProperty("--navbar-height", navbar.offsetHeight + "px");
  };
  apply();
  window.addEventListener("resize", apply);
}

async function refreshCartCount() {
  const session = getSession();
  if (!session) return;
  try {
    const res = await api.get("/cart/" + session.id);
    const count = (res.data || []).reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById("cart-count");
    if (badge) badge.textContent = count;
  } catch (e) {
    /* ignore - navbar should not break the page */
  }
}

function requireRole(role) {
  const session = getSession();
  if (!session || session.role !== role) {
    window.location.href = "/login.html";
    return null;
  }
  return session;
}

function redirectIfLoggedIn() {
  const session = getSession();
  if (session) {
    window.location.href = session.role === "ADMIN" ? "/admin/dashboard.html" : "/customer/dashboard.html";
  }
}
