const API_BASE = "http://127.0.0.1:8000";

// Helper to get JWT token from localStorage
function getToken() {
  return localStorage.getItem("token");
}

// Generic GET request
async function getRequest(url) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    }
  });
  return res.json();
}

// Generic POST request
async function postRequest(url, data) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

// =======================
// Auth Endpoints
// =======================
export async function registerUser(name, email, password) {
  return await fetch(`${API_BASE}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  }).then(res => res.json());
}

export async function loginUser(email, password) {
  return await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  }).then(res => res.json());
}

export async function getProfile() {
  return await getRequest("/auth/profile");
}

export async function updateProfile(data) {
  return await postRequest("/auth/profile/update", data);
}

export async function changePassword(data) {
  return await postRequest("/auth/profile/change-password/", data);
}

// =======================
// Courses
// =======================
export async function getCourses() {
  return await getRequest("/api/courses/");
}

export async function createCourse(name, description) {
  return await postRequest("/api/courses/create/", { name, description });
}

// =======================
// Feedback
// =======================
export async function submitFeedback(courseId, rating, message) {
  return await postRequest("/api/feedback/submit/", { course: courseId, rating, message });
}

export async function getAdminFeedback() {
  return await getRequest("/api/admin/feedback/");
}

export async function exportFeedbackCSV() {
  return await getRequest("/api/admin/feedback/export");
}

export async function getFeedbackTrends() {
  return await getRequest("/api/feedback-trends/");
}

// =======================
// Students (Admin)
// =======================
export async function getStudents() {
  return await getRequest("/api/students/");
}

export async function blockStudent(studentId) {
  return await getRequest(`/api/students/${studentId}/block/`);
}

export async function unblockStudent(studentId) {
  return await getRequest(`/api/students/${studentId}/unblock/`);
}

export async function deleteStudent(studentId) {
  return await getRequest(`/api/students/${studentId}/delete/`);
}
