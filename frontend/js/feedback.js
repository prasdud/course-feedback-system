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
        
        const data = await api.getMyFeedback(); // call the new backend endpoint
        myFeedback = data.feedbacks || [];

        console.log('Loaded my feedback:', myFeedback); // Debug log

        if (myFeedback.length > 0) {
            listEl.innerHTML = myFeedback.map(f => {
                // Get feedback ID - handle different possible ID formats
                const feedbackId = f.id || f._id || f.pk || String(f._id);
                console.log('Feedback ID for display:', feedbackId, 'Original feedback object:', f); // Debug log
                
                return `
                    <div class="feedback-item" id="feedback-${feedbackId}">
                        <div class="feedback-header">
                            <span class="rating">${'★'.repeat(f.rating)}${'☆'.repeat(5 - f.rating)} (${f.rating}/5)</span>
                            <button onclick="editFeedback('${feedbackId}')">Edit</button>
                            <button onclick="deleteFeedback('${feedbackId}')">Delete</button>
                        </div>
                        <p><strong>Course:</strong> ${f.course_name}</p>
                        <p>${f.message}</p>
                        <small>Submitted: ${new Date(f.created_at).toLocaleDateString()}</small>
                    </div>
                `;
            }).join('');
        } else {
            listEl.innerHTML = '<p class="loading">You have not submitted any feedback yet.</p>';
        }
        
    } catch (err) {
        console.error('Error loading feedback:', err);
        listEl.innerHTML = '<p class="loading">Error loading feedback.</p>';
    } finally {
        loadingEl.style.display = 'none';
    }
}

// edit feedback
async function editFeedback(feedbackId) {
    console.log('Editing feedback with ID:', feedbackId); // Debug log
    console.log('Available feedback:', myFeedback); // Debug log
    
    // Try different ways to match the feedback ID
    const feedback = myFeedback.find(f => {
        const fId = f.id || f._id || f.pk || String(f._id);
        console.log('Comparing:', fId, 'with', feedbackId); // Debug log
        return String(fId) === String(feedbackId);
    });
    
    if (!feedback) {
        console.error('Feedback not found for ID:', feedbackId);
        console.error('Available feedback IDs:', myFeedback.map(f => f.id || f._id || f.pk));
        return showMessage('Feedback not found');
    }

    // populate form
    document.getElementById('courseSelect').value = feedback.course_id;
    document.getElementById('message').value = feedback.message;
    selectedRating = feedback.rating;
    updateStarDisplay();

    // change form submit temporarily
    const form = document.getElementById('feedbackForm');
    const originalHandler = handleFeedbackSubmit;
    form.removeEventListener('submit', handleFeedbackSubmit);
    
    form.addEventListener('submit', async function updateHandler(e) {
        e.preventDefault();
        try {
            await api.updateFeedback(feedbackId, {
                rating: selectedRating,
                message: document.getElementById('message').value
            });
            showMessage('Feedback updated!', 'success');
            form.reset();
            selectedRating = 0;
            updateStarDisplay();
            loadMyFeedback();
        } catch (err) {
            showMessage('Error updating feedback: ' + err.message);
        } finally {
            // restore original submit handler
            form.removeEventListener('submit', updateHandler);
            form.addEventListener('submit', originalHandler);
        }
    });
}

// delete feedback
async function deleteFeedback(feedbackId) {
    // Check if feedbackId is valid
    if (!feedbackId || feedbackId === 'undefined' || feedbackId === 'null') {
        console.error('Invalid feedback ID for deletion:', feedbackId);
        return showMessage('Invalid feedback ID');
    }
    
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
        await api.deleteFeedback(feedbackId);
        showMessage('Feedback deleted!', 'success');
        document.getElementById('feedback-' + feedbackId)?.remove();
        // Also remove from local array
        myFeedback = myFeedback.filter(f => {
            let fId = f.id;
            if (!fId || fId === 'undefined') fId = f._id;
            if (!fId || fId === 'undefined') fId = f.pk;
            return String(fId) !== String(feedbackId);
        });
    } catch (err) {
        console.error('Delete error:', err);
        showMessage('Error deleting feedback: ' + err.message);
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