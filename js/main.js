// =============================================
// FRESH-ID - Main JavaScript
// ============================================= //

// Clear redirect flag when dashboard loads
if (window.location.pathname.toLowerCase().includes('dashboard')) {
    sessionStorage.removeItem('freshid_redirecting');
}

// Sidebar Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchMenu');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const navItems = document.querySelectorAll('.nav-item, .submenu-item');
            const sections = document.querySelectorAll('.sidebar-section, .nav-section');
            
            navItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                const parent = item.closest('.sidebar-section, .nav-section');
                
                if (text.includes(searchTerm)) {
                    item.style.display = 'flex';
                    if (parent) parent.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Hide empty sections
            sections.forEach(section => {
                const visibleItems = section.querySelectorAll('.nav-item:not([style*="display: none"]), .submenu-item:not([style*="display: none"])');
                section.style.display = visibleItems.length > 0 ? 'block' : 'none';
            });
            
            // Show all if search is empty
            if (searchTerm === '') {
                navItems.forEach(item => item.style.display = 'flex');
                sections.forEach(section => section.style.display = 'block');
            }
        });
    }
});

// Toggle sidebar on mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Close sidebar when clicking outside
function closeSidebarOnClickOutside(e) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    if (sidebar && sidebar.classList.contains('active')) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
}

// Toggle submenu
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

// Logout function
function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        // Clear all auth data
        localStorage.removeItem('freshid_current_user');
        localStorage.removeItem('freshid_remember');
        sessionStorage.clear();
        
        // Redirect to login
        window.location.replace('login.html');
    }
    return false;
}

// Search menu
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchMenu');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const navItems = document.querySelectorAll('.nav-item, .submenu-item');
            
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

    // Initialize charts if on dashboard
    if (document.getElementById('gasChart')) {
        initDashboardCharts();
    }

    // Menu toggle button - make it always visible
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.style.display = 'block';
        menuToggle.addEventListener('click', toggleSidebar);
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', closeSidebarOnClickOutside);

    // Submenu toggle
    const navLinks = document.querySelectorAll('.nav-item.has-submenu .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSubmenu(this.parentElement);
        });
    });
});

// Initialize Dashboard Charts
function initDashboardCharts() {
    // Gas Chart
    const gasCtx = document.getElementById('gasChart');
    if (gasCtx) {
        const gasChart = new Chart(gasCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [
                    {
                        label: 'NH₃',
                        data: [1300000, 1500000, 1400000, 1200000, 1100000, 1300000, 1450000, 1350000, 1400000, 1300000, 1450000, 1500000],
                        borderColor: '#3498DB',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 0,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'H₂S',
                        data: [1600000, 1700000, 1650000, 1550000, 1500000, 1600000, 1700000, 1650000, 1700000, 1600000, 1700000, 1750000],
                        borderColor: '#EC4899',
                        backgroundColor: 'rgba(236, 72, 153, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 0,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'CH₄',
                        data: [1400000, 1550000, 1500000, 1450000, 1400000, 1500000, 1600000, 1550000, 1600000, 1500000, 1600000, 1650000],
                        borderColor: '#17A2B8',
                        backgroundColor: 'rgba(23, 162, 184, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 0,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2.5,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(44, 62, 80, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#ECF0F1',
                        borderColor: '#5DADE2',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#95A5A6',
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(149, 165, 166, 0.1)'
                        },
                        ticks: {
                            color: '#95A5A6',
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                return (value / 1000000) + 'M';
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });

        // Update chart with animation
        setInterval(() => {
            gasChart.data.datasets.forEach(dataset => {
                dataset.data.push(1000000 + Math.random() * 800000);
                if (dataset.data.length > 12) {
                    dataset.data.shift();
                }
            });
            gasChart.update('none');
        }, 3000);
    }

    // Pie Chart
    const pieCtx = document.getElementById('pieChart');
    if (pieCtx) {
        new Chart(pieCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Segar', 'Kurang Segar', 'Tidak Segar'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: [
                        '#27AE60',
                        '#E67E22',
                        '#E74C3C'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.2,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(44, 62, 80, 0.95)',
                        titleColor: '#fff',
                        bodyColor: '#ECF0F1',
                        borderColor: '#5DADE2',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 768 && sidebar) {
        sidebar.classList.remove('active');
    }
});

// Update stats with animation
function updateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/,/g, '').replace('%', ''));
        if (!isNaN(target)) {
            animateValue(stat, 0, target, 1500);
        }
    });
}

function animateValue(element, start, end, duration) {
    const isPercentage = element.textContent.includes('%');
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        
        const value = Math.floor(current);
        if (isPercentage) {
            element.textContent = value + '%';
        } else if (value > 1000) {
            element.textContent = value.toLocaleString();
        } else {
            element.textContent = value;
        }
    }, 16);
}

// Initialize
if (document.getElementById('gasChart')) {
    setTimeout(updateStats, 500);
}
