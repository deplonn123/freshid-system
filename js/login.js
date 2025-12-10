// =============================================
// FRESH-ID - Login Page JavaScript
// =============================================

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Simple validation
    if (email && password) {
        // Store email in localStorage if remember me is checked
        if (rememberMe) {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('userEmail');
            localStorage.removeItem('rememberMe');
        }
        
        // Store login session
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', email);
        
        // Show loading animation
        const submitBtn = document.querySelector('.btn-login');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Masuk...';
        submitBtn.disabled = true;
        
        // Simulate login delay
        setTimeout(() => {
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        }, 1000);
    }
});

// Check if user wants to be remembered
window.addEventListener('DOMContentLoaded', function() {
    const rememberMe = localStorage.getItem('rememberMe');
    const savedEmail = localStorage.getItem('userEmail');
    
    if (rememberMe === 'true' && savedEmail) {
        document.getElementById('email').value = savedEmail;
        document.getElementById('rememberMe').checked = true;
    }
});

// Add enter key support
document.getElementById('password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
});
