// Check if user is already authenticated
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;

    // Only redirect if on login page (index.html)
    if ((path.endsWith('index.html') || path === '/' || path === '') && api.isAuthenticated()) {
        redirectToDashboard();
    }
});



// Toggle between login and register forms
function toggleForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginForm.classList.toggle('active');
    registerForm.classList.toggle('active');
    
    // Clear any messages
    hideMessage();
}

// Show message to user
function showMessage(message, type = 'error') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideMessage();
    }, 5000);
}

// Hide message
function hideMessage() {
    const messageEl = document.getElementById('message');
    messageEl.style.display = 'none';
}

// Redirect to appropriate dashboard
function redirectToDashboard() {
    if (api.isAdmin()) {
        window.location.href = 'admin.html';
    } else if (api.isStudent()) {
        window.location.href = 'feedback.html';
    }
}

// Handle login form submission
const loginFormEl = document.getElementById('loginFormElement');
if (loginFormEl) {
    loginFormEl.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';
            
            const response = await api.login({ email, password });
            api.setToken(response.token);

            function parseJwt(token) {
                try {
                    const base64Payload = token.split('.')[1];
                    const payload = atob(base64Payload);
                    return JSON.parse(payload);
                } catch (e) {
                    return {};
                }
            }
            const payload = parseJwt(response.token);
            api.setUserRole((payload.role || '').toLowerCase());

            showMessage('Login successful!', 'success');
            redirectToDashboard();
            
        } catch (error) {
            showMessage(error.message || 'Login failed. Please check your credentials.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    });
}



// Handle register form submission
const registerFormEl = document.getElementById('registerFormElement');
if (registerFormEl) {
    registerFormEl.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Registering...';
            
            await api.register({ name, email, password });
            
            showMessage('Registration successful! Please login.', 'success');
            
            setTimeout(() => {
                toggleForm();
                registerFormEl.reset();
            }, 1500);
            
        } catch (error) {
            showMessage(error.message || 'Registration failed. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register';
        }
    });
}


// Logout function (used in other pages)
function logout() {
    api.clearAuth();
    window.location.href = 'index.html';
}

// Check authentication for protected pages
function requireAuth() {
    if (!api.isAuthenticated()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Check admin role for admin pages
function requireAdmin() {
    if (!requireAuth() || !api.isAdmin()) {
        window.location.href = api.isStudent() ? 'feedback.html' : 'index.html';
        return false;
    }
    return true;
}