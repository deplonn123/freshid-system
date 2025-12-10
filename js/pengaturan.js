// Pengaturan Theme dan Mode
const THEME_COLORS = {
    blue: '#5DADE2',
    green: '#27AE60',
    purple: '#9B59B6',
    red: '#E74C3C'
};

// Load saved settings on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
});

// Load settings from localStorage
function loadSettings() {
    // Load dark mode
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = darkMode;
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }
    }

    // Load theme color
    const themeColor = localStorage.getItem('themeColor') || 'blue';
    const themeColorSelect = document.getElementById('themeColor');
    if (themeColorSelect) {
        themeColorSelect.value = themeColor;
        applyThemeColor(themeColor);
    }

    // Load sensor settings
    const sensorInterval = localStorage.getItem('sensorInterval');
    if (sensorInterval) {
        const intervalInput = document.querySelector('input[type="number"][value="5"]');
        if (intervalInput) intervalInput.value = sensorInterval;
    }

    const nh3Limit = localStorage.getItem('nh3Limit');
    if (nh3Limit) {
        const nh3Input = document.querySelector('input[type="number"][value="35"]');
        if (nh3Input) nh3Input.value = nh3Limit;
    }

    const h2sLimit = localStorage.getItem('h2sLimit');
    if (h2sLimit) {
        const h2sInput = document.querySelector('input[type="number"][value="20"]');
        if (h2sInput) h2sInput.value = h2sLimit;
    }

    const ch4Limit = localStorage.getItem('ch4Limit');
    if (ch4Limit) {
        const ch4Input = document.querySelector('input[type="number"][value="80"]');
        if (ch4Input) ch4Input.value = ch4Limit;
    }
}

// Toggle Dark Mode
function toggleDarkMode(enabled) {
    if (enabled) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
    }
}

// Change Theme Color
function changeThemeColor(color) {
    applyThemeColor(color);
    localStorage.setItem('themeColor', color);
    // Reload theme globally if function exists
    if (window.reloadTheme) {
        window.reloadTheme();
    }
}

// Apply theme color to page
function applyThemeColor(color) {
    const colorValue = THEME_COLORS[color] || THEME_COLORS.blue;
    document.documentElement.style.setProperty('--primary-blue', colorValue);
    
    // Update header background
    const header = document.querySelector('.top-header');
    if (header) {
        header.style.background = colorValue;
    }

    // Update buttons
    const buttons = document.querySelectorAll('.btn-primary, .icon-btn');
    buttons.forEach(btn => {
        if (btn.classList.contains('btn-primary')) {
            btn.style.background = colorValue;
        }
    });
}

// Save all settings
function saveSettings() {
    // Save sensor settings
    const sensorInterval = document.querySelector('input[type="number"][min="1"]')?.value;
    if (sensorInterval) {
        localStorage.setItem('sensorInterval', sensorInterval);
    }

    const inputs = document.querySelectorAll('input[type="number"][step="0.1"]');
    if (inputs[0]) localStorage.setItem('nh3Limit', inputs[0].value);
    if (inputs[1]) localStorage.setItem('h2sLimit', inputs[1].value);
    if (inputs[2]) localStorage.setItem('ch4Limit', inputs[2].value);

    // Save notification settings
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((cb, index) => {
        if (index > 0) { // Skip dark mode toggle
            localStorage.setItem(`notification_${index}`, cb.checked);
        }
    });

    // Show success message
    showNotification('Pengaturan berhasil disimpan!', 'success');
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#27AE60' : '#E74C3C'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {
    from {
        transform: translateX(400px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(400px);
        opacity: 0;
    }
}

/* Dark Mode Styles */
body.dark-mode {
    background: #1a1a1a;
    color: #e0e0e0;
}

body.dark-mode .card {
    background: #2d2d2d;
    border: 1px solid #404040;
}

body.dark-mode .card-header {
    border-bottom-color: #404040;
}

body.dark-mode .card-header h2 {
    color: #e0e0e0;
}

body.dark-mode .form-input,
body.dark-mode .filter-select {
    background: #1a1a1a;
    border-color: #404040;
    color: #e0e0e0;
}

body.dark-mode .form-input:focus,
body.dark-mode .filter-select:focus {
    border-color: var(--primary-blue);
}

body.dark-mode .setting-group label {
    color: #e0e0e0;
}

body.dark-mode .setting-group small {
    color: #999;
}

body.dark-mode .sensor-card {
    background: #2d2d2d;
    border: 1px solid #404040;
}

body.dark-mode .main-content {
    background: #1a1a1a;
}
`;
document.head.appendChild(style);
