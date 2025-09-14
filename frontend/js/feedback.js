let selectedRating = 0;
let courses = [];
let myFeedback = [];

// Check authentication and load data on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth() || api.isAdmin()) {
        window.location.href = api.isAdmin() ? 'admin.html' : 'index.html';
        return;
    }
    
    // Load initial data
    loadCourses();
    loadMyFeedback();
    
    // Setup form handlers
    setupRatingStars();
    document.getElementById('feedbackForm').addEventListener('submit', handleFeedbackSubmit);
});

// Load available courses
async function loadCourses() {
    const courseSelect = document.getElementById('courseSelect');
    
    try {
        courseSelect.innerHTML = '<option value="">Loading courses...</option>';
        
        const data = await api.getCourses();
        courses = data.courses || data || []; // Handle different response formats
        
        console.log('Raw API response:', data);
        console.log('Loaded courses:', courses);
        
        // Clear loading option
        courseSelect.innerHTML = '<option value="">Select a course...</option>';
        
        if (courses.length > 0) {
            courses.forEach((course, index) => {
                const option = document.createElement('option');
                // For MongoEngine with your serializer, use 'id' field
                const courseId = course.id || course._id || course.pk;
                option.value = courseId;
                option.textContent = course.name;
                courseSelect.appendChild(option);
                
                console.log('Added course option:', {
                    id: option.value,
                    name: option.textContent,
                    originalCourse: course
                });
            });
        } else {
            courseSelect.innerHTML = '<option value="">No courses available</option>';
        }
        
    } catch (error) {
        console.error('Error loading courses:', error);
        courseSelect.innerHTML = '<option value="">Error loading courses</option>';
        showMessage('Error loading courses. Please refresh the page.');
    }
}

// Setup rating stars interaction
function setupRatingStars() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            ratingInput.value = selectedRating;
            updateStarDisplay();
        });
        
        star.addEventListener('mouseover', () => {
            const hoverRating = parseInt(star.dataset.rating);
            updateStarDisplay(hoverRating);
        });
    });
    
    // Reset to selected rating on mouse leave
    document.querySelector('.rating-stars').addEventListener('mouseleave', () => {
        updateStarDisplay();
    });
}

// Update star display
function updateStarDisplay(hoverRating = null) {
    const stars = document.querySelectorAll('.star');
    const displayRating = hoverRating || selectedRating;
    
    stars.forEach((star, index) => {
        const rating = index + 1;
        if (rating <= displayRating) {
            star.textContent = '★';
            star.style.color = '#ffc107';
            star.style.cursor = 'pointer';
        } else {
            star.textContent = '☆';
            star.style.color = '#ddd';
            star.style.cursor = 'pointer';
        }
    });
}

// Handle feedback form submission
async function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    const courseId = document.getElementById('courseSelect').value;
    const rating = selectedRating;
    const message = document.getElementById('message').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Validation
    if (!courseId) {
        showMessage('Please select a course');
        return;
    }
    
    if (!rating || rating < 1 || rating > 5) {
        showMessage('Please select a rating');
        return;
    }
    
    if (!message.trim()) {
        showMessage('Please enter your feedback message');
        return;
    }
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        await api.submitFeedback({
            course: courseId,
            rating: rating,
            message: message.trim()
        });
        
        showMessage('Feedback submitted successfully!', 'success');
        
        // Reset form
        document.getElementById('feedbackForm').reset();
        selectedRating = 0;
        updateStarDisplay();
        
        // Reload my feedback
        loadMyFeedback();
        
    } catch (error) {
        console.error('Error submitting feedback:', error);
        showMessage('Error submitting feedback: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Feedback';
    }
}

// Load user's previous feedback
async function loadMyFeedback() {
    const loadingEl = document.getElementById('myFeedbackLoading');
    const listEl = document.getElementById('myFeedbackList');
    
    try {
        loadingEl.style.display = 'block';
        listEl.innerHTML = '';
        
        // Note: This assumes there's an endpoint to get user's feedback
        // Since it's not in the Postman collection, we'll simulate it
        // In a real scenario, you'd need to add this endpoint to your Django backend
        
        // For now, we'll show a message that this feature needs backend support
        loadingEl.style.display = 'none';
        listEl.innerHTML = `
            <div class="feedback-item">
                <p><em>Previous feedback history will be displayed here.</em></p>
                <small>Note: This requires additional backend endpoint implementation.</small>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading my feedback:', error);
        loadingEl.style.display = 'none';
        listEl.innerHTML = '<p class="loading">Error loading feedback history</p>';
    }
}

// Show message function
function showMessage(message, type = 'error') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}