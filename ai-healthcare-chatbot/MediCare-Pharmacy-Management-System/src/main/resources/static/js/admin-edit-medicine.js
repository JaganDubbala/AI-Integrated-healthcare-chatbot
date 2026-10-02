const session = requireRole("ADMIN");
if (session) {
  renderNavbar("admin-medicines");
  renderSidebar("medicines");
  loadMedicine();
}

const form = document.getElementById("medicine-form");

function getIdFromQuery() {
  return new URLSearchParams(window.location.search).get("id");
}

async function loadMedicine() {
  const id = getIdFromQuery();
  if (!id) {
    showToast("No medicine specified", "error");
    window.location.href = "/admin/manage-medicines.html";
    return;
  }

  try {
    const res = await api.get("/drugs/" + id);
    const d = res.data;
    document.getElementById("name").value = d.name;
    document.getElementById("description").value = d.description || "";
    document.getElementById("category").value = d.category;
    document.getElementById("manufacturer").value = d.manufacturer;
    document.getElementById("price").value = d.price;
    document.getElementById("stockQuantity").value = d.stockQuantity;
    document.getElementById("expiryDate").value = d.expiryDate;
  } catch (err) {
    showToast(err.message || "Failed to load medicine", "error");
  }
}

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

  const id = getIdFromQuery();
  const btn = document.getElementById("save-btn");
  btn.disabled = true;
  btn.textContent = "Saving...";

  try {
    await api.put("/drugs/" + id, data);
    showToast("Medicine updated successfully", "success");
    setTimeout(() => (window.location.href = "/admin/manage-medicines.html"), 400);
  } catch (err) {
    applyValidationErrors(form, err.payload);
    showToast(err.message || "Failed to update medicine", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Save Changes";
  }
});
