redirectIfLoggedIn();
renderNavbar("login");

const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearFieldErrors(form);

  const identifier = document.getElementById("identifier").value.trim();
  const password = document.getElementById("password").value;

  let valid = true;
  if (!identifier) {
    showFieldError("identifier", "This field is required");
    valid = false;
  }
  if (!password) {
    showFieldError("password", "Password is required");
    valid = false;
  }
  if (!valid) return;

  const btn = document.getElementById("login-btn");
  btn.disabled = true;
  btn.textContent = "Logging in...";

  try {
    const res = await api.post("/auth/login", { identifier, password });
    saveSession(res.data);
    showToast("Login successful", "success");
    setTimeout(() => {
      window.location.href = res.data.role === "ADMIN" ? "/admin/dashboard.html" : "/customer/dashboard.html";
    }, 400);
  } catch (err) {
    showToast(err.message || "Login failed", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Login";
  }
});
