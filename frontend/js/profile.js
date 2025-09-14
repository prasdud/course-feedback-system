let currentProfile = null;

// Check authentication and load profile on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth()) return;
    
    // Load profile data
    loadProfile();
    
    // Setup form handlers
    document.getElementById('updateProfileForm').addEventListener('submit', handleProfileUpdate);
    document.getElementById('changePasswordForm').addEventListener('submit', handlePasswordChange);
});

// Go back to appropriate dashboard
function goBack() {
    if (api.isAdmin()) {
        window.location.href = 'admin.html';
    } else if (api.isStudent()) {
        window.location.href = 'feedback.html';
    } else {
        window.location.href = 'index.html';
    }
}

// Load user profile
async function loadProfile() {
    const loadingEl = document.getElementById('profileLoading');
    const infoEl = document.getElementById('profileInfo');

    try {
        loadingEl.style.display = 'block';
        infoEl.style.display = 'none';
        
        const data = await api.getProfile();
        currentProfile = data.user || data;
        document.getElementById('profilePic').src = currentProfile.profile_picture || 'https://www.shutterstock.com/shutterstock/photos/147002768/display_1500/stock-vector-human-head-vector-isolated-147002768.jpg';

        // Update profile display
        document.getElementById('profileName').textContent   = currentProfile.name    || '-';
        document.getElementById('profileEmail').textContent  = currentProfile.email   || '-';
        document.getElementById('profileRole').textContent   = (currentProfile.role || '')
            ? currentProfile.role.charAt(0).toUpperCase() + currentProfile.role.slice(1)
            : '-';
        document.getElementById('profileJoined').textContent = currentProfile.createdAt
            ? new Date(currentProfile.createdAt).toLocaleDateString()
            : '-';

        // Extra fields that might not exist
        document.getElementById('profilePhone').textContent   = currentProfile.phone   || '-';
        document.getElementById('profileDob').textContent     = currentProfile.dob
            ? new Date(currentProfile.dob).toLocaleDateString()
            : '-';
        document.getElementById('profileAddress').textContent = currentProfile.address || '-';


        loadingEl.style.display = 'none';
        infoEl.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading profile:', error);
        loadingEl.textContent = 'Error loading profile';
        showMessage('Error loading profile: ' + error.message);
    }
}

// Show update profile form
function showUpdateForm() {
    if (!currentProfile) return;

    document.getElementById('updateName').value    = currentProfile.name    || '';
    document.getElementById('updateEmail').value   = currentProfile.email   || ''; // readonly
    document.getElementById('updatePhone').value   = currentProfile.phone   || '';
    document.getElementById('updateDob').value     = currentProfile.dob     || '';
    document.getElementById('updateAddress').value = currentProfile.address || '';

    document.getElementById('updateProfileSection').style.display = 'block';
    document.getElementById('profileInfo').style.display = 'none';
}

// Cancel profile update
function cancelUpdate() {
    document.getElementById('updateProfileSection').style.display = 'none';
    document.getElementById('profileInfo').style.display = 'block';
    
    // Reset form
    document.getElementById('updateProfileForm').reset();
}

// Handle profile update
async function handleProfileUpdate(e) {
    e.preventDefault();

    const name = document.getElementById('updateName').value.trim();
    const phone = document.getElementById('updatePhone').value.trim();
    const dob = document.getElementById('updateDob').value;
    const address = document.getElementById('updateAddress').value.trim();
    const submitBtn = e.target.querySelector('button[type="submit"]');

    if (!name) {
        showMessage('Name is required');
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Updating...';

        await api.updateProfile({ name, phone, dob, address });

        showMessage('Profile updated successfully!', 'success');

        await loadProfile();
        cancelUpdate();
    } catch (error) {
        console.error('Error updating profile:', error);
        showMessage('Error updating profile: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Update Profile';
    }
}

// Updated profile picture upload handler
document.getElementById('updateProfilePicBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('profilePicInput');
    if (!fileInput.files[0]) {
        showMessage('Please select an image first');
        return;
    }

    const file = fileInput.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showMessage('Please select a valid image file');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showMessage('Image size must be less than 5MB');
        return;
    }

    const reader = new FileReader();
    const updateBtn = document.getElementById('updateProfilePicBtn');
    
    updateBtn.disabled = true;
    updateBtn.textContent = 'Uploading...';

    reader.onloadend = async () => {
        try {
            // Get the base64 data
            const base64Data = reader.result;
            
            // For Base64ImageField, we need to send it in the format: "data:image/jpeg;base64,..."
            // The reader.result already includes this format
            
            console.log('Uploading image with data URL length:', base64Data.length);
            
            const response = await api.updateProfile({
                profile_picture: base64Data
            });

            // Update the UI
            const newProfilePicUrl = response.user ? response.user.profile_picture : response.profile_picture;
            if (newProfilePicUrl) {
                document.getElementById('profilePic').src = newProfilePicUrl;
                currentProfile.profile_picture = newProfilePicUrl;
            }

            showMessage('Profile picture updated successfully!', 'success');
            
            // Clear the file input
            fileInput.value = '';
            
        } catch (err) {
            console.error('Error updating profile picture:', err);
            showMessage('Error updating profile picture: ' + err.message);
        } finally {
            updateBtn.disabled = false;
            updateBtn.textContent = 'Update Profile Picture';
        }
    };

    reader.onerror = () => {
        showMessage('Error reading file');
        updateBtn.disabled = false;
        updateBtn.textContent = 'Update Profile Picture';
    };

    reader.readAsDataURL(file);
});

// Handle password change
async function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Validation
    if (!currentPassword) {
        showMessage('Current password is required');
        return;
    }
    
    if (!newPassword) {
        showMessage('New password is required');
        return;
    }
    
    if (newPassword.length < 6) {
        showMessage('New password must be at least 6 characters long');
        return;
    }
    
    if (currentPassword === newPassword) {
        showMessage('New password must be different from current password');
        return;
    }
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Changing...';
        
        // Only send currentPassword and newPassword
        await api.changePassword({
            current_password: currentPassword,
            new_password: newPassword
        });
        
        showMessage('Password changed successfully!', 'success');
        
        // Clear form
        document.getElementById('changePasswordForm').reset();
        
    } catch (error) {
        console.error('Error changing password:', error);
        showMessage('Error changing password: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Change Password';
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