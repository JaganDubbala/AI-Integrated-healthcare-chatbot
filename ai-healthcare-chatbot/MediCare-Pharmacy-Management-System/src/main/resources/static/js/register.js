redirectIfLoggedIn();
renderNavbar("register");

const form = document.getElementById("register-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearFieldErrors(form);

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const address = document.getElementById("address").value.trim();

  let valid = true;
  if (!name) {
    showFieldError("name", "Name is required");
    valid = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError("email", "Enter a valid email address");
    valid = false;
  }
  if (!/^[0-9]{10}$/.test(phone)) {
    showFieldError("phone", "Phone number must be exactly 10 digits");
    valid = false;
  }
  if (password.length < 6) {
    showFieldError("password", "Password must be at least 6 characters long");
    valid = false;
  }
  if (!address) {
    showFieldError("address", "Address is required");
    valid = false;
  }
  if (!valid) return;

  const btn = document.getElementById("register-btn");
  btn.disabled = true;
  btn.textContent = "Registering...";

  try {
    const res = await api.post("/auth/register", { name, email, phone, password, address });
    saveSession(res.data);
    showToast("Registration successful! Welcome to MediCare.", "success");
    setTimeout(() => (window.location.href = "/customer/dashboard.html"), 500);
  } catch (err) {
    applyValidationErrors(form, err.payload);
    showToast(err.message || "Registration failed", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Register";
  }
});
