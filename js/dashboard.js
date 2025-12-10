// =============================================
// FRESH-ID - Dashboard JavaScript
// =============================================

// Check authentication
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'index.html';
    }
}

// Load user email
function loadUserInfo() {
    const userEmail = sessionStorage.getItem('userEmail');
    if (userEmail) {
        const emailElements = document.querySelectorAll('#userEmail');
        emailElements.forEach(el => {
            el.textContent = userEmail;
        });
    }
}

// Logout function
function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    }
}

// Toggle sidebar on mobile
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(e) {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// Simulate real-time data updates
function updateDashboardStats() {
    // Generate random values for demonstration
    const nh3 = (Math.random() * 50).toFixed(2);
    const h2s = (Math.random() * 30).toFixed(2);
    const ch4 = (Math.random() * 100).toFixed(2);
    const temp = (25 + Math.random() * 10).toFixed(1);
    const humidity = Math.floor(50 + Math.random() * 30);
    
    // Update values
    const nh3El = document.getElementById('nh3-value');
    const h2sEl = document.getElementById('h2s-value');
    const ch4El = document.getElementById('ch4-value');
    const tempEl = document.getElementById('temp-value');
    const humidityEl = document.getElementById('humidity-value');
    
    if (nh3El) nh3El.textContent = nh3;
    if (h2sEl) h2sEl.textContent = h2s;
    if (ch4El) ch4El.textContent = ch4;
    if (tempEl) tempEl.textContent = temp;
    if (humidityEl) humidityEl.textContent = humidity;
    
    // Update status based on threshold
    updateStatus('nh3-status', parseFloat(nh3), 25);
    updateStatus('h2s-status', parseFloat(h2s), 15);
    updateStatus('ch4-status', parseFloat(ch4), 50);
    updateStatus('temp-status', parseFloat(temp), 35);
    updateStatus('humidity-status', parseFloat(humidity), 80);
}

function updateStatus(elementId, value, threshold) {
    const statusEl = document.getElementById(elementId);
    if (!statusEl) return;
    
    if (value > threshold) {
        statusEl.textContent = 'Tinggi';
        statusEl.style.background = 'rgba(239, 68, 68, 0.1)';
        statusEl.style.borderColor = 'var(--danger-color)';
        statusEl.style.color = 'var(--danger-color)';
    } else if (value > threshold * 0.7) {
        statusEl.textContent = 'Perhatian';
        statusEl.style.background = 'rgba(245, 158, 11, 0.1)';
        statusEl.style.borderColor = 'var(--warning-color)';
        statusEl.style.color = 'var(--warning-color)';
    } else {
        statusEl.textContent = 'Normal';
        statusEl.style.background = 'rgba(16, 185, 129, 0.1)';
        statusEl.style.borderColor = 'var(--success-color)';
        statusEl.style.color = 'var(--success-color)';
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserInfo();
    
    // Update stats immediately
    updateDashboardStats();
    
    // Update stats every 3 seconds
    setInterval(updateDashboardStats, 3000);
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Handle window resize
window.addEventListener('resize', function() {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
    }
});
