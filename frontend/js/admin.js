// Check admin access on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!requireAdmin()) return;
    
    // Load initial data
    loadMetrics();
    
    // Setup course form handler
    document.getElementById('courseForm').addEventListener('submit', handleAddCourse);
});

// Show/hide sections
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load data based on section
        switch(sectionName) {
            case 'feedback':
                loadFeedback();
                break;
            case 'students':
                loadStudents();
                break;
            case 'courses':
                loadCourses();
                break;
            case 'metrics':
                loadMetrics();
                break;
        }
    }
}

// Load metrics
async function loadMetrics() {
    const loadingEl = document.getElementById('metricsLoading');
    const contentEl = document.getElementById('metricsContent');
    
    try {
        loadingEl.style.display = 'block';
        contentEl.style.display = 'none';
        
        const data = await api.getMetrics();
        
        document.getElementById('totalStudents').textContent = data.totalStudents || 0;
        document.getElementById('totalCourses').textContent = data.totalCourses || 0;
        document.getElementById('totalFeedback').textContent = data.totalFeedback || 0;
        document.getElementById('avgRating').textContent = (data.avgRating || 0).toFixed(1);
        
        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading metrics:', error);
        loadingEl.textContent = 'Error loading metrics';
    }
}

// Load all feedback
async function loadFeedback() {
    const loadingEl = document.getElementById('feedbackLoading');
    const listEl = document.getElementById('feedbackList');
    
    try {
        loadingEl.style.display = 'block';
        listEl.innerHTML = '';
        
      const data = await api.getAdminFeedback();

      if (data.feedbacks && data.feedbacks.length > 0) {
          listEl.innerHTML = data.feedbacks.map(feedback => `
              <div class="feedback-item">
                  <div class="feedback-header">
                      <strong>${feedback.student_name || 'Anonymous'}</strong>
                      <span class="rating">${'★'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)} (${feedback.rating}/5)</span>
                  </div>
                  <p><strong>Course:</strong> ${feedback.course_name || 'Unknown Course'}</p>
                  <p><strong>Message:</strong> ${feedback.message}</p>
                  <small>Submitted: ${new Date(feedback.created_at).toLocaleDateString()}</small>
              </div>
          `).join('');
      } else {
          listEl.innerHTML = '<p class="loading">No feedback found.</p>';
      }


        
        loadingEl.style.display = 'none';
        
    } catch (error) {
        console.error('Error loading feedback:', error);
        loadingEl.textContent = 'Error loading feedback';
    }
}

// Load students
async function loadStudents() {
    const loadingEl = document.getElementById('studentsLoading');
    const tableEl = document.getElementById('studentsTable');
    
    try {
        loadingEl.style.display = 'block';
        tableEl.innerHTML = '';
        
        const data = await api.getStudents();
        
        if (data.students && data.students.length > 0) {
            tableEl.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.students.map(student => `
                            <tr>
                                <td>${student.name}</td>
                                <td>${student.email}</td>
                                <td>${student.isBlocked ? 'Blocked' : 'Active'}</td>
                                <td>${new Date(student.createdAt).toLocaleDateString()}</td>
                                <td>
                                    ${student.isBlocked 
                                        ? `<button class="action-btn unblock" onclick="unblockStudent('${student._id}')">Unblock</button>`
                                        : `<button class="action-btn block" onclick="blockStudent('${student._id}')">Block</button>`
                                    }
                                    <button class="action-btn delete" onclick="deleteStudent('${student._id}')">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            tableEl.innerHTML = '<p class="loading">No students found.</p>';
        }
        
        loadingEl.style.display = 'none';
        
    } catch (error) {
        console.error('Error loading students:', error);
        loadingEl.textContent = 'Error loading students';
    }
}

// Load courses
async function loadCourses() {
    const loadingEl = document.getElementById('coursesLoading');
    const listEl = document.getElementById('coursesList');
    
    try {
        loadingEl.style.display = 'block';
        listEl.innerHTML = '';
        
        const data = await api.getCourses();
        
        if (data.courses && data.courses.length > 0) {
            listEl.innerHTML = data.courses.map(course => `
                <div class="feedback-item">
                    <h3>${course.name}</h3>
                    <p>${course.description || 'No description'}</p>
                    <small>ID: ${course.id || course._id || 'No ID'}</small><br>
                    <small>Created: ${course.created_at ? new Date(course.created_at).toLocaleDateString() : 'Unknown'}</small>
                </div>
            `).join('');
        } else {
            listEl.innerHTML = '<p class="loading">No courses found.</p>';
        }
        
        loadingEl.style.display = 'none';
        
    } catch (error) {
        console.error('Error loading courses:', error);
        loadingEl.textContent = 'Error loading courses';
    }
}

// Student management functions
async function blockStudent(studentId) {
    if (!confirm('Are you sure you want to block this student?')) return;
    
    try {
        await api.blockStudent(studentId);
        showMessage('Student blocked successfully', 'success');
        loadStudents(); // Reload students list
    } catch (error) {
        showMessage('Error blocking student: ' + error.message);
    }
}

async function unblockStudent(studentId) {
    try {
        await api.unblockStudent(studentId);
        showMessage('Student unblocked successfully', 'success');
        loadStudents(); // Reload students list
    } catch (error) {
        showMessage('Error unblocking student: ' + error.message);
    }
}

async function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;
    
    try {
        await api.deleteStudent(studentId);
        showMessage('Student deleted successfully', 'success');
        loadStudents(); // Reload students list
    } catch (error) {
        showMessage('Error deleting student: ' + error.message);
    }
}

// Course management
function showAddCourseForm() {
    document.getElementById('addCourseForm').style.display = 'block';
}

function hideAddCourseForm() {
    document.getElementById('addCourseForm').style.display = 'none';
    document.getElementById('courseForm').reset();
}

async function handleAddCourse(e) {
    e.preventDefault();
    
    const name = document.getElementById('courseName').value;
    const description = document.getElementById('courseDescription').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Adding...';
        
        await api.createCourse({ name, description });
        
        showMessage('Course added successfully!', 'success');
        hideAddCourseForm();
        loadCourses(); // Reload courses list
        
    } catch (error) {
        showMessage('Error adding course: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Course';
    }
}

// Export feedback
async function exportFeedback() {
    try {
        const blob = await api.exportFeedback();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'feedback-export.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showMessage('Feedback exported successfully!', 'success');
    } catch (error) {
        showMessage('Error exporting feedback: ' + error.message);
    }
}

// Message functions
function showMessage(message, type = 'error') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}