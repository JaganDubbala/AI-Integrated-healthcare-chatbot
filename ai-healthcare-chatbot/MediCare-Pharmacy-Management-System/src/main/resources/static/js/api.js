const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("medicare_token");
}

function getSession() {
  const raw = localStorage.getItem("medicare_user");
  return raw ? JSON.parse(raw) : null;
}

function saveSession(loginResponse) {
  localStorage.setItem("medicare_token", loginResponse.token);
  localStorage.setItem("medicare_user", JSON.stringify({
    id: loginResponse.id,
    name: loginResponse.name,
    email: loginResponse.email,
    role: loginResponse.role
  }));
}

function clearSession() {
  localStorage.removeItem("medicare_token");
  localStorage.removeItem("medicare_user");
}

async function apiRequest(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const response = await fetch(API_BASE + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (e) {
    payload = null;
  }

  if (!response.ok) {
    const message = (payload && payload.message) ? payload.message : ("Request failed (" + response.status + ")");
    const error = new Error(message);
    error.payload = payload;
    error.status = response.status;
    throw error;
  }

  return payload;
}

const api = {
  get: (path) => apiRequest("GET", path),
  post: (path, body) => apiRequest("POST", path, body),
  put: (path, body) => apiRequest("PUT", path, body),
  del: (path) => apiRequest("DELETE", path)
};
