const session = requireRole("CUSTOMER");
if (session) {
  renderNavbar("profile");
  loadProfile();
}

const form = document.getElementById("profile-form");

async function loadProfile() {
  try {
    const res = await api.get("/customers/" + session.id);
    const c = res.data;
    document.getElementById("name").value = c.name;
    document.getElementById("email").value = c.email;
    document.getElementById("phone").value = c.phone;
    document.getElementById("address").value = c.address;
  } catch (err) {
    showToast(err.message || "Failed to load profile", "error");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearFieldErrors(form);

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  let valid = true;
  if (!name) {
    showFieldError("name", "Name is required");
    valid = false;
  }
  if (!/^[0-9]{10}$/.test(phone)) {
    showFieldError("phone", "Phone number must be exactly 10 digits");
    valid = false;
  }
  if (!address) {
    showFieldError("address", "Address is required");
    valid = false;
  }
  if (!valid) return;

  const btn = document.getElementById("save-btn");
  btn.disabled = true;
  btn.textContent = "Saving...";

  try {
    const res = await api.put("/customers/" + session.id, { name, phone, address });
    const updatedSession = { ...session, name: res.data.name };
    localStorage.setItem("medicare_user", JSON.stringify(updatedSession));
    showToast("Profile updated successfully", "success");
    renderNavbar("profile");
  } catch (err) {
    applyValidationErrors(form, err.payload);
    showToast(err.message || "Failed to update profile", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Save Changes";
  }
});
