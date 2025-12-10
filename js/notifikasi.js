// Generate sample notifications
function generateNotifications() {
    const notifications = [
        {
            id: 1,
            type: 'danger',
            icon: 'exclamation-circle',
            title: 'Sampel Ikan Box 2 Tidak Segar',
            message: 'Kadar NH₃ mencapai 42 ppm, melebihi batas aman. Segera lakukan pengecekan.',
            time: new Date(Date.now() - 5 * 60000), // 5 minutes ago
            read: false,
            link: 'sampel-ikan.html'
        },
        {
            id: 2,
            type: 'warning',
            icon: 'exclamation-triangle',
            title: 'Suhu Tinggi pada Sampel Ayam Box 1',
            message: 'Suhu mencapai 32°C. Periksa sistem pendingin.',
            time: new Date(Date.now() - 25 * 60000), // 25 minutes ago
            read: false,
            link: 'sampel-ayam.html'
        },
        {
            id: 3,
            type: 'danger',
            icon: 'times-circle',
            title: 'Sensor TGS2602 Tidak Merespon',
            message: 'Sensor NH₃/H₂S pada Box Sapi 3 tidak mengirim data. Periksa koneksi.',
            time: new Date(Date.now() - 45 * 60000), // 45 minutes ago
            read: false,
            link: 'data-sensor.html'
        },
        {
            id: 4,
            type: 'info',
            icon: 'info-circle',
            title: 'Update Sistem Tersedia',
            message: 'Versi 2.1.0 tersedia dengan perbaikan bug dan fitur baru.',
            time: new Date(Date.now() - 2 * 3600000), // 2 hours ago
            read: false,
            link: 'pengaturan.html'
        },
        {
            id: 5,
            type: 'warning',
            icon: 'exclamation-triangle',
            title: 'CH₄ Meningkat pada Sampel Susu',
            message: 'Kadar CH₄ pada Box 1 mencapai 75 ppm dan terus meningkat.',
            time: new Date(Date.now() - 3 * 3600000), // 3 hours ago
            read: false,
            link: 'sampel-susu.html'
        },
        {
            id: 6,
            type: 'success',
            icon: 'check-circle',
            title: 'Kalibrasi Sensor Berhasil',
            message: 'Semua sensor berhasil dikalibrasi dan siap digunakan.',
            time: new Date(Date.now() - 5 * 3600000), // 5 hours ago
            read: true,
            link: 'data-sensor.html'
        },
        {
            id: 7,
            type: 'info',
            icon: 'user-plus',
            title: 'Pengguna Baru Terdaftar',
            message: 'Operator baru "Ahmad Rizki" telah ditambahkan ke sistem.',
            time: new Date(Date.now() - 24 * 3600000), // 1 day ago
            read: true,
            link: 'manajemen-pengguna.html'
        },
        {
            id: 8,
            type: 'success',
            icon: 'file-alt',
            title: 'Laporan Bulanan Siap',
            message: 'Laporan pengujian bulan ini telah dibuat dan siap diunduh.',
            time: new Date(Date.now() - 2 * 24 * 3600000), // 2 days ago
            read: true,
            link: 'laporan.html'
        }
    ];

    return notifications;
}

// Format time ago
function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Baru saja';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit yang lalu`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam yang lalu`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} hari yang lalu`;
    
    return date.toLocaleDateString('id-ID');
}

// Create notification element
function createNotificationElement(notification) {
    const div = document.createElement('div');
    div.className = `notification-item ${notification.type} ${notification.read ? 'read' : 'unread'}`;
    div.dataset.id = notification.id;
    
    div.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${notification.icon}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-header">
                <h4>${notification.title}</h4>
                <span class="notification-time">${timeAgo(notification.time)}</span>
            </div>
            <p>${notification.message}</p>
            <div class="notification-actions">
                <button class="btn-text" onclick="markAsRead(${notification.id})">
                    <i class="fas fa-check"></i> Tandai Dibaca
                </button>
                <button class="btn-text" onclick="viewNotification('${notification.link}')">
                    <i class="fas fa-arrow-right"></i> Lihat Detail
                </button>
            </div>
        </div>
        ${!notification.read ? '<div class="unread-indicator"></div>' : ''}
    `;
    
    return div;
}

// Populate notifications
function populateNotifications() {
    const container = document.getElementById('notificationsList');
    container.innerHTML = '';
    
    notifications.forEach(notification => {
        container.appendChild(createNotificationElement(notification));
    });
    
    updateStats();
}

// Update statistics
function updateStats() {
    const unread = notifications.filter(n => !n.read).length;
    const warnings = notifications.filter(n => n.type === 'warning' && !n.read).length;
    const info = notifications.filter(n => n.type === 'info' && !n.read).length;
    
    document.getElementById('unreadCount').textContent = unread;
    document.getElementById('warningCount').textContent = warnings;
    document.getElementById('infoCount').textContent = info;
}

// Mark notification as read
function markAsRead(id) {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
        populateNotifications();
    }
}

// Mark all as read
function markAllAsRead() {
    notifications.forEach(n => n.read = true);
    populateNotifications();
}

// View notification detail
function viewNotification(link) {
    window.location.href = link;
}

// Initialize
let notifications = [];

document.addEventListener('DOMContentLoaded', function() {
    notifications = generateNotifications();
    populateNotifications();
    
    // Update time every minute
    setInterval(() => {
        document.querySelectorAll('.notification-time').forEach((el, index) => {
            el.textContent = timeAgo(notifications[index].time);
        });
    }, 60000);
});
