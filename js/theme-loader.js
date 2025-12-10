// Global Theme Loader - Apply theme to all pages
(function() {
    const THEME_COLORS = {
        blue: '#5DADE2',
        green: '#27AE60',
        purple: '#9B59B6',
        red: '#E74C3C'
    };

    // Load and apply theme on page load
    function loadTheme() {
        // Load dark mode
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }

        // Load and apply theme color
        const themeColor = localStorage.getItem('themeColor') || 'blue';
        applyThemeColor(themeColor);
    }

    // Apply theme color to entire page
    function applyThemeColor(color) {
        const colorValue = THEME_COLORS[color] || THEME_COLORS.blue;
        
        // Update CSS variable
        document.documentElement.style.setProperty('--primary-blue', colorValue);
        
        // Update header background
        const header = document.querySelector('.top-header');
        if (header) {
            header.style.background = colorValue;
        }

        // Update sidebar active items
        const activeNavItems = document.querySelectorAll('.nav-item.active, .submenu-item.active');
        activeNavItems.forEach(item => {
            item.style.background = `${colorValue}22`;
            item.style.borderLeftColor = colorValue;
        });

        // Update primary buttons
        const primaryButtons = document.querySelectorAll('.btn-primary');
        primaryButtons.forEach(btn => {
            btn.style.background = colorValue;
        });

        // Update icon buttons hover
        const style = document.createElement('style');
        style.id = 'dynamic-theme-style';
        
        // Remove old style if exists
        const oldStyle = document.getElementById('dynamic-theme-style');
        if (oldStyle) oldStyle.remove();
        
        style.textContent = `
            .icon-btn:hover {
                background: ${colorValue}33 !important;
            }
            .btn-primary {
                background: ${colorValue} !important;
            }
            .btn-primary:hover {
                background: ${adjustColor(colorValue, -20)} !important;
            }
            .nav-item.active {
                background: ${colorValue}22 !important;
                border-left-color: ${colorValue} !important;
            }
            .nav-item:hover {
                background: ${colorValue}15 !important;
            }
            .sensor-card:hover {
                border-left-color: ${colorValue} !important;
            }
            .stat-card:hover {
                border-left-color: ${colorValue} !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Adjust color brightness
    function adjustColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }

    // Initialize theme when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadTheme);
    } else {
        loadTheme();
    }

    // Export functions for use in other scripts
    window.reloadTheme = loadTheme;
})();
