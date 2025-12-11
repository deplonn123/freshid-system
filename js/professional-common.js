// FRESH-ID Professional Theme - Common Functionality

// Toggle Sidebar (Mobile)
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Setup Search Functionality
function setupSearch() {
    const searchInput = document.getElementById('searchMenu');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (searchInput && navItems.length > 0) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            navItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// Logout Function
function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = 'login.html';
    }
}

// Check Authentication
function checkAuth() {
    const user = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (!user && !window.location.pathname.includes('login') && 
        !window.location.pathname.includes('register') && 
        !window.location.pathname.includes('reset-password') &&
        !window.location.pathname.includes('index')) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Set Active Menu
function setActiveMenu(menuId) {
    const navItems = document.querySelectorAll('.nav-item');
    const submenuItems = document.querySelectorAll('.submenu-item');
    const allSubmenus = document.querySelectorAll('.has-submenu');
    
    // First, close all dropdowns
    allSubmenus.forEach(item => {
        item.classList.remove('active');
    });
    
    navItems.forEach(item => {
        if (item.getAttribute('data-menu') === menuId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    submenuItems.forEach(item => {
        if (item.getAttribute('data-menu') === menuId) {
            item.classList.add('active');
            // Auto-expand parent submenu
            const parentSubmenu = item.closest('.has-submenu');
            if (parentSubmenu) {
                parentSubmenu.classList.add('active');
            }
        } else {
            item.classList.remove('active');
        }
    });
}

// Toggle Submenu
function toggleSubmenu(element) {
    const parentItem = element.closest('.has-submenu');
    const allSubmenus = document.querySelectorAll('.has-submenu');
    
    // Close other submenus
    allSubmenus.forEach(item => {
        if (item !== parentItem) {
            item.classList.remove('active');
        }
    });
    
    // Toggle current submenu
    parentItem.classList.toggle('active');
}

// Update Notification Badge
function updateNotificationBadge(count) {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Show Loading
function showLoading() {
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    overlay.innerHTML = '<div class="loading" style="width: 40px; height: 40px; border-width: 4px;"></div>';
    document.body.appendChild(overlay);
}

// Hide Loading
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// Show Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    
    const icons = {
        success: '✓',
        warning: '⚠',
        danger: '✕',
        info: 'ℹ'
    };
    
    toast.innerHTML = `<i>${icons[type]}</i> <span>${message}</span>`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Format Date
function formatDate(date) {
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

// Format Number
function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num);
}

// Export to CSV
function exportToCSV(data, filename) {
    const csv = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Export to PDF (requires jsPDF library)
function exportToPDF(elementId, filename) {
    if (typeof jsPDF === 'undefined') {
        showToast('jsPDF library tidak tersedia', 'warning');
        return;
    }
    
    const element = document.getElementById(elementId);
    if (!element) return;
    
    showLoading();
    
    html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(filename);
        hideLoading();
    });
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize Theme
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
}

// Toggle Theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Close Sidebar on Outside Click (Mobile)
document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (sidebar && menuToggle && 
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) && 
        !menuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

// Add Animation Styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
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
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupSearch();
    initTheme();
});
