// Authentication JavaScript

// Toggle password visibility
function togglePassword(fieldId = 'password') {
    const input = document.getElementById(fieldId);
    const icon = document.getElementById(fieldId === 'password' ? 
        (document.getElementById('toggleIconPassword') ? 'toggleIconPassword' : 'toggleIcon') : 
        'toggleIconConfirm');
    
    if (input.type === 'password') {
        input.type = 'text';
        if (icon) icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        if (icon) icon.className = 'fas fa-eye';
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    if (successDiv) successDiv.style.display = 'none';
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'flex';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Show success message
function showSuccess(message) {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'flex';
        
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 5000);
    }
}

// Get users from localStorage
function getUsers() {
    const users = localStorage.getItem('freshid_users');
    return users ? JSON.parse(users) : [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem('freshid_users', JSON.stringify(users));
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('freshid_current_user') !== null;
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('freshid_current_user');
    return user ? JSON.parse(user) : null;
}

// Login user
function loginUser(user) {
    const userData = {
        email: user.email,
        username: user.username,
        fullname: user.fullname,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem('freshid_current_user', JSON.stringify(userData));
    sessionStorage.setItem('freshid_just_logged_in', 'true');
}

// Logout user
function logoutUser() {
    localStorage.removeItem('freshid_current_user');
    localStorage.removeItem('freshid_remember');
    sessionStorage.clear();
    window.location.replace('login.html');
}

// Global logout function (alias)
function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        logoutUser();
    }
    return false;
}

// Check authentication on protected pages
function checkAuth() {
    const currentPage = window.location.pathname.toLowerCase();
    const publicPages = ['login.html', 'register.html', 'reset-password.html', 'index.html'];
    
    // Skip auth check on public pages
    const isPublicPage = publicPages.some(page => currentPage.includes(page));
    if (isPublicPage) {
        return;
    }
    
    // Check if user is logged in
    if (!isLoggedIn()) {
        // Prevent redirect loop
        if (!currentPage.includes('login.html')) {
            window.location.replace('login.html');
        }
        return;
    }
}

// Register Form Handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim().toLowerCase();
        const username = document.getElementById('username').value.trim().toLowerCase();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        // Validation
        if (!fullname || !email || !username || !password) {
            showError('Semua field harus diisi!');
            return;
        }
        
        if (password.length < 6) {
            showError('Password minimal 6 karakter!');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Password dan konfirmasi password tidak cocok!');
            return;
        }
        
        if (!terms) {
            showError('Anda harus menyetujui Syarat & Ketentuan!');
            return;
        }
        
        // Check if user already exists
        const users = getUsers();
        const userExists = users.find(u => u.email === email || u.username === username);
        
        if (userExists) {
            showError('Email atau username sudah terdaftar!');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            fullname: fullname,
            email: email,
            username: username,
            password: password, // In production, this should be hashed!
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        saveUsers(users);
        
        showSuccess('Registrasi berhasil! Mengalihkan ke halaman login...');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
}

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim().toLowerCase();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Validation
        if (!email || !password) {
            showError('Email dan password harus diisi!');
            return;
        }
        
        // Check user credentials
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            showError('Email atau password salah!');
            return;
        }
        
        // Login successful
        loginUser(user);
        
        if (remember) {
            localStorage.setItem('freshid_remember', 'true');
        }
        
        showSuccess('Login berhasil! Mengalihkan ke dashboard...');
        
        setTimeout(() => {
            window.location.replace('dashboard-new.html');
        }, 1000);
    });
}

// Redirect if already logged in (on login/register pages)
(function() {
    const currentPage = window.location.pathname.toLowerCase();
    const authPages = ['login.html', 'register.html'];
    const isAuthPage = authPages.some(page => currentPage.includes(page));
    
    // Don't redirect if coming from login form submission
    const justLoggedIn = sessionStorage.getItem('freshid_just_logged_in');
    if (justLoggedIn) {
        sessionStorage.removeItem('freshid_just_logged_in');
        return;
    }
    
    if (isAuthPage && isLoggedIn() && !sessionStorage.getItem('freshid_redirecting')) {
        sessionStorage.setItem('freshid_redirecting', 'true');
        window.location.replace('dashboard-new.html');
    }
})();

// Update user info in header
function updateUserInfo() {
    const user = getCurrentUser();
    if (user) {
        // Update user name in header if element exists
        const userNameElements = document.querySelectorAll('.user-name, .user-info-modern strong');
        userNameElements.forEach(el => {
            el.textContent = user.fullname || user.username;
        });
        
        // Update user avatar with initials
        const avatarElements = document.querySelectorAll('.user-avatar');
        avatarElements.forEach(el => {
            const initials = user.fullname 
                ? user.fullname.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                : user.username.substring(0, 2).toUpperCase();
            el.textContent = initials;
        });
    }
}

// Call on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateUserInfo);
} else {
    updateUserInfo();
}

// Add logout functionality
function setupLogout() {
    // Add logout to user menu clicks
    const userMenus = document.querySelectorAll('.user-menu-modern, .user-profile');
    userMenus.forEach(menu => {
        menu.style.cursor = 'pointer';
        menu.addEventListener('click', function(e) {
            if (confirm('Apakah Anda yakin ingin logout?')) {
                logoutUser();
            }
        });
    });
}

// Setup logout on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLogout);
} else {
    setupLogout();
}
