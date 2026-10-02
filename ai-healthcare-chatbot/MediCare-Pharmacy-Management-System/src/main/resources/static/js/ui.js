function showToast(message, type) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = "toast " + (type || "info");
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function showFieldError(inputId, message) {
  const el = document.getElementById(inputId + "-error");
  if (el) {
    el.textContent = message;
    el.classList.add("show");
  }
}

function clearFieldErrors(formEl) {
  formEl.querySelectorAll(".field-error").forEach((el) => {
    el.textContent = "";
    el.classList.remove("show");
  });
}

function applyValidationErrors(formEl, payload) {
  if (payload && payload.data && typeof payload.data === "object") {
    Object.keys(payload.data).forEach((field) => showFieldError(field, payload.data[field]));
  }
}

function formatCurrency(amount) {
  const value = Number(amount || 0);
  return "₹" + value.toFixed(2);
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
