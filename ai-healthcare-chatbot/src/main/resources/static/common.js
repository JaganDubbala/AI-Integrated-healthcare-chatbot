const NAV_USER = [
    ["home.html", "🏠", "Home"],
    ["chatbot.html", "💬", "Chatbot"],
    ["hospitals.html", "🏥", "Hospitals"],
    ["doctors.html", "👨‍⚕️", "Doctors"],
    ["appointments.html", "📅", "Appointments"],
    ["my-appointments.html", "📋", "My Appointments"],
    ["history.html", "💬", "Chat History"],
    ["profile.html", "👤", "Profile"]
];

const NAV_ADMIN = [
    ["admin.html", "📊", "Dashboard"],
    ["admin-patients.html", "👥", "Patients"],
    ["admin-doctors.html", "👨‍⚕️", "Doctors"],
    ["admin-hospitals.html", "🏥", "Hospitals"],
    ["admin-appointments.html", "📅", "Appointments"]
];

function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}

function renderNav(type, activePage) {
    const root = document.getElementById("navbar-root");
    if (!root) return;
    const items = type === "admin" ? NAV_ADMIN : NAV_USER;
    const brandHref = type === "admin" ? "admin.html" : "home.html";
    const links = items.map(([href, icon, label]) =>
        `<a href="${href}"${href === activePage ? ' class="active"' : ""}>${icon} ${esc(label)}</a>`
    ).join("");
    root.innerHTML =
        `<nav class="navbar"><a class="brand" href="${brandHref}">🏥 AI Healthcare</a>` +
        `<div class="nav-links">${links}<a id="logoutNav" href="#">🚪 Logout</a></div></nav>`;
    const logoutLink = document.getElementById("logoutNav");
    if (logoutLink) logoutLink.onclick = e => { e.preventDefault(); logout(); };
}

async function logout() {
    try { await fetch("/api/auth/logout", { method: "POST" }); }
    finally { location.href = "login.html"; }
}

async function currentUser() {
    try {
        const r = await fetch("/api/auth/me");
        if (!r.ok) return null;
        return await r.json();
    } catch (e) {
        return null;
    }
}

async function requireAuth(activePage) {
    const user = await currentUser();
    if (!user) {
        location.href = "login.html";
        return null;
    }
    window.currentUser = user;
    renderNav(user.role === "ADMIN" ? "admin" : "user", activePage);
    return user;
}

async function requireAdmin(activePage) {
    const user = await currentUser();
    if (!user || user.role !== "ADMIN") {
        location.href = "login.html";
        return null;
    }
    window.currentUser = user;
    renderNav("admin", activePage);
    return user;
}
