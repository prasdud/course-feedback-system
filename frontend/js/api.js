// Replace localhost references with:
const API_BASE = window.location.origin;

// Your API calls should now be:
fetch(`${API_BASE}/api/auth/login/`)
fetch(`${API_BASE}/api/feedback/`)

class ApiClient {
    constructor() {
        this.token = localStorage.getItem('token');
        this.userRole = localStorage.getItem('userRole');
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async register(userData) {
        return this.request('/auth/register/', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(credentials) {
        return this.request('/auth/login/', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    async getProfile() {
        return this.request('/auth/profile');
    }

    async updateProfile(profileData) {
        return this.request('/auth/profile/update/', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    async changePassword(passwordData) {
        return this.request('/auth/profile/change-password/', {
            method: 'PUT',
            body: JSON.stringify(passwordData)
        });
    }

    // Course endpoints
    async createCourse(courseData) {
        return this.request('/api/courses/create/', {
            method: 'POST',
            body: JSON.stringify(courseData)
        });
    }

    async getCourses() {
        return this.request('/api/courses/');
    }

    // Get single course
    async getCourse(courseId) {
        return this.request(`/api/courses/${courseId}/`);
    }


    // Update course
    async updateCourse(courseId, data) {
        return this.request(`/api/courses/${courseId}/edit/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Delete course
    async deleteCourse(courseId) {
        return this.request(`/api/courses/${courseId}/delete/`, {
            method: 'DELETE'
        });
    }


    // Feedback endpoints
    async submitFeedback(feedbackData) {
        return this.request('/api/feedback/submit/', {
            method: 'POST',
            body: JSON.stringify(feedbackData)
        });
    }

    // Admin endpoints
    async getAdminFeedback(queryString = '') {
        return this.request('/api/admin/feedback/');
    }

    async exportFeedback() {
        const response = await fetch(`${API_BASE}/api/admin/feedback/export`, {
            headers: this.getHeaders()
        });
        return response.blob();
    }

    async getMetrics() {
        return this.request('/api/metrics/');
    }

    async getStudents() {
        return this.request('/api/students/');
    }

    async blockStudent(studentId) {
        return this.request(`/api/students/${studentId}/block/`, {
            method: 'PUT'
        });
    }

    async unblockStudent(studentId) {
        return this.request(`/api/students/${studentId}/unblock/`, {
            method: 'PUT'
        });
    }

    async deleteStudent(studentId) {
        return this.request(`/api/students/${studentId}/delete/`, {
            method: 'DELETE'
        });
    }

    async getFeedbackTrends() {
        return this.request('/api/feedback-trends/');
    }
    
    // Student feedback endpoints
    async getMyFeedback() {
        return this.request('/api/feedback/');
    }
    
    async updateFeedback(feedbackId, data) {
        return this.request(`/api/feedback/${feedbackId}/edit/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteFeedback(feedbackId) {
        return this.request(`/api/feedback/${feedbackId}/delete/`, {
            method: 'DELETE'
        });
    }
    
    // Helper methods
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    setUserRole(role) {
        this.userRole = role;
        localStorage.setItem('userRole', role);
    }

    clearAuth() {
        this.token = null;
        this.userRole = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
    }

  isAuthenticated() {
      return !!localStorage.getItem('token');
  }

  isAdmin() {
      return localStorage.getItem('userRole') === 'admin';
  }

  isStudent() {
      return localStorage.getItem('userRole') === 'student';
  }
}

const api = new ApiClient();