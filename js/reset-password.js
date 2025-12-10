// Reset Password Functionality
let foundUser = null;

// Email Form Handler
document.getElementById('emailForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('freshid_users') || '[]');
    
    // Find user by email
    foundUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
        // Show reset form
        document.getElementById('emailForm').style.display = 'none';
        document.getElementById('resetForm').style.display = 'block';
        
        // Display user info
        document.getElementById('displayName').textContent = foundUser.name;
        document.getElementById('displayEmail').textContent = foundUser.email;
        
        showSuccess('Akun ditemukan! Silakan masukkan password baru.');
    } else {
        showError('Email tidak ditemukan. Pastikan email sudah terdaftar.');
    }
});

// Reset Form Handler
document.getElementById('resetForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (newPassword.length < 6) {
        showError('Password harus minimal 6 karakter');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showError('Password tidak cocok. Pastikan kedua password sama.');
        return;
    }
    
    // Update password
    const users = JSON.parse(localStorage.getItem('freshid_users') || '[]');
    const userIndex = users.findIndex(user => user.email === foundUser.email);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('freshid_users', JSON.stringify(users));
        
        showSuccess('Password berhasil direset! Mengalihkan ke halaman login...');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        showError('Terjadi kesalahan. Silakan coba lagi.');
    }
});

// Toggle password visibility
function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Back to email form
function backToEmailForm() {
    document.getElementById('resetForm').style.display = 'none';
    document.getElementById('emailForm').style.display = 'block';
    document.getElementById('email').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    foundUser = null;
    hideMessages();
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
}

// Hide all messages
function hideMessages() {
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}
