// =============================================
// FRESH-ID - Monitoring Page JavaScript
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

// Chart instances
let gasChart = null;
let environmentChart = null;

// Data storage
const maxDataPoints = 20;
const chartData = {
    labels: [],
    nh3: [],
    h2s: [],
    ch4: [],
    temp: [],
    humidity: []
};

// Historical data for table
const historicalData = [];

// Initialize charts
function initCharts() {
    // Gas Chart
    const gasCtx = document.getElementById('gasChart').getContext('2d');
    gasChart = new Chart(gasCtx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: 'NH₃ (ppm)',
                    data: chartData.nh3,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'H₂S (ppm)',
                    data: chartData.h2s,
                    borderColor: '#ec4899',
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'CH₄ (ppm)',
                    data: chartData.ch4,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#f1f5f9',
                        font: {
                            family: 'Poppins',
                            size: 12
                        },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#cbd5e1',
                    borderColor: '#6366f1',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' ppm';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            family: 'Poppins'
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            family: 'Poppins'
                        },
                        callback: function(value) {
                            return value + ' ppm';
                        }
                    },
                    beginAtZero: true
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
    
    // Environment Chart
    const envCtx = document.getElementById('environmentChart').getContext('2d');
    environmentChart = new Chart(envCtx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: 'Suhu (°C)',
                    data: chartData.temp,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    yAxisID: 'y'
                },
                {
                    label: 'Kelembaban (%)',
                    data: chartData.humidity,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#f1f5f9',
                        font: {
                            family: 'Poppins',
                            size: 12
                        },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#cbd5e1',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            family: 'Poppins'
                        }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            family: 'Poppins'
                        },
                        callback: function(value) {
                            return value + '°C';
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            family: 'Poppins'
                        },
                        callback: function(value) {
                            return value + '%';
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
}

// Generate sensor data
function generateSensorData() {
    const now = new Date();
    const timeLabel = now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    
    // Generate realistic sensor values
    const nh3 = (15 + Math.random() * 20).toFixed(2);
    const h2s = (8 + Math.random() * 15).toFixed(2);
    const ch4 = (30 + Math.random() * 60).toFixed(2);
    const temp = (26 + Math.random() * 8).toFixed(1);
    const humidity = Math.floor(55 + Math.random() * 25);
    
    return {
        time: timeLabel,
        fullTime: now.toLocaleString('id-ID'),
        nh3: parseFloat(nh3),
        h2s: parseFloat(h2s),
        ch4: parseFloat(ch4),
        temp: parseFloat(temp),
        humidity: humidity
    };
}

// Update live values
function updateLiveValues(data) {
    document.getElementById('live-nh3').textContent = data.nh3.toFixed(2);
    document.getElementById('live-h2s').textContent = data.h2s.toFixed(2);
    document.getElementById('live-ch4').textContent = data.ch4.toFixed(2);
    document.getElementById('live-temp').textContent = data.temp.toFixed(1);
    document.getElementById('live-humidity').textContent = data.humidity;
}

// Update charts
function updateCharts(data) {
    // Add new data
    chartData.labels.push(data.time);
    chartData.nh3.push(data.nh3);
    chartData.h2s.push(data.h2s);
    chartData.ch4.push(data.ch4);
    chartData.temp.push(data.temp);
    chartData.humidity.push(data.humidity);
    
    // Remove old data if exceeds max points
    if (chartData.labels.length > maxDataPoints) {
        chartData.labels.shift();
        chartData.nh3.shift();
        chartData.h2s.shift();
        chartData.ch4.shift();
        chartData.temp.shift();
        chartData.humidity.shift();
    }
    
    // Update charts
    gasChart.update('none');
    environmentChart.update('none');
}

// Update data table
function updateDataTable(data) {
    historicalData.unshift(data);
    
    // Keep only last 50 records
    if (historicalData.length > 50) {
        historicalData.pop();
    }
    
    const tableBody = document.getElementById('dataTableBody');
    tableBody.innerHTML = '';
    
    historicalData.slice(0, 10).forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.fullTime}</td>
            <td>${record.nh3.toFixed(2)}</td>
            <td>${record.h2s.toFixed(2)}</td>
            <td>${record.ch4.toFixed(2)}</td>
            <td>${record.temp.toFixed(1)}</td>
            <td>${record.humidity}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Main update function
function updateMonitoringData() {
    const data = generateSensorData();
    updateLiveValues(data);
    updateCharts(data);
    updateDataTable(data);
}

// Clear charts
function clearCharts() {
    if (confirm('Reset semua data grafik?')) {
        chartData.labels = [];
        chartData.nh3 = [];
        chartData.h2s = [];
        chartData.ch4 = [];
        chartData.temp = [];
        chartData.humidity = [];
        
        gasChart.update();
        environmentChart.update();
    }
}

// Export data
function exportData() {
    if (historicalData.length === 0) {
        alert('Tidak ada data untuk di-export');
        return;
    }
    
    // Create CSV content
    let csv = 'Waktu,NH3 (ppm),H2S (ppm),CH4 (ppm),Suhu (°C),Kelembaban (%)\n';
    
    historicalData.forEach(record => {
        csv += `${record.fullTime},${record.nh3},${record.h2s},${record.ch4},${record.temp},${record.humidity}\n`;
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const now = new Date();
    const filename = `monitoring-data-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserInfo();
    initCharts();
    
    // Start real-time updates
    updateMonitoringData();
    setInterval(updateMonitoringData, 2000); // Update every 2 seconds
    
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
});

// Handle window resize
window.addEventListener('resize', function() {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
    }
});
