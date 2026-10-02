const session = requireRole("ADMIN");
if (session) {
  renderNavbar("admin-medicines");
  renderSidebar("medicines");
}

const form = document.getElementById("medicine-form");

function readForm() {
  return {
    name: document.getElementById("name").value.trim(),
    description: document.getElementById("description").value.trim(),
    category: document.getElementById("category").value.trim(),
    manufacturer: document.getElementById("manufacturer").value.trim(),
    price: parseFloat(document.getElementById("price").value),
    stockQuantity: parseInt(document.getElementById("stockQuantity").value, 10),
    expiryDate: document.getElementById("expiryDate").value
  };
}

function validateForm(data) {
  let valid = true;
  if (!data.name) {
    showFieldError("name", "Medicine name is required");
    valid = false;
  }
  if (!data.category) {
    showFieldError("category", "Category is required");
    valid = false;
  }
  if (!data.manufacturer) {
    showFieldError("manufacturer", "Manufacturer is required");
    valid = false;
  }
  if (!(data.price > 0)) {
    showFieldError("price", "Price must be greater than zero");
    valid = false;
  }
  if (!(data.stockQuantity >= 0) || isNaN(data.stockQuantity)) {
    showFieldError("stockQuantity", "Stock quantity cannot be negative");
    valid = false;
  }
  if (!data.expiryDate) {
    showFieldError("expiryDate", "Expiry date is required");
    valid = false;
  }
  return valid;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearFieldErrors(form);
  const data = readForm();
  if (!validateForm(data)) return;

  const btn = document.getElementById("save-btn");
  btn.disabled = true;
  btn.textContent = "Saving...";

  try {
    await api.post("/drugs", data);
    showToast("Medicine added successfully", "success");
    setTimeout(() => (window.location.href = "/admin/manage-medicines.html"), 400);
  } catch (err) {
    applyValidationErrors(form, err.payload);
    showToast(err.message || "Failed to add medicine", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Add Medicine";
  }
});
