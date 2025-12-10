// =============================================
// Data Sensor Page JavaScript
// ============================================= //

// Sensor data storage
let sensorHistory = [];

// Generate sensor reading
function generateSensorReading() {
    return {
        timestamp: new Date(),
        nh3: (10 + Math.random() * 30).toFixed(2),
        h2s: (5 + Math.random() * 20).toFixed(2),
        ch4: (20 + Math.random() * 70).toFixed(2),
        temp: (24 + Math.random() * 12).toFixed(1),
        humidity: Math.floor(50 + Math.random() * 35)
    };
}

// Update sensor values
function updateSensorValues() {
    const data = generateSensorReading();
    
    // Update display
    document.getElementById('nh3-value').textContent = data.nh3;
    document.getElementById('h2s-value').textContent = data.h2s;
    document.getElementById('ch4-value').textContent = data.ch4;
    document.getElementById('temp-value').textContent = data.temp;
    document.getElementById('humidity-value').textContent = data.humidity;
    
    // Update status
    updateSensorStatus('nh3', parseFloat(data.nh3), 25, 35);
    updateSensorStatus('h2s', parseFloat(data.h2s), 15, 20);
    updateSensorStatus('ch4', parseFloat(data.ch4), 60, 80);
    updateSensorStatus('temp', parseFloat(data.temp), 30, 35);
    updateSensorStatus('humidity', parseFloat(data.humidity), 75, 85);
    
    // Add to history
    sensorHistory.unshift(data);
    if (sensorHistory.length > 100) {
        sensorHistory.pop();
    }
    
    // Update table
    updateTable();
}

// Update sensor status
function updateSensorStatus(sensor, value, warningThreshold, dangerThreshold) {
    const statusEl = document.getElementById(sensor + '-status');
    if (!statusEl) return;
    
    if (value >= dangerThreshold) {
        statusEl.textContent = 'Bahaya';
        statusEl.className = 'sensor-status danger';
    } else if (value >= warningThreshold) {
        statusEl.textContent = 'Perhatian';
        statusEl.className = 'sensor-status warning';
    } else {
        statusEl.textContent = 'Normal';
        statusEl.className = 'sensor-status';
    }
}

// Update table
function updateTable() {
    const tbody = document.getElementById('dataTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    sensorHistory.slice(0, 50).forEach((data, index) => {
        const status = getOverallStatus(data);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${formatTime(data.timestamp)}</td>
            <td>${data.nh3}</td>
            <td>${data.h2s}</td>
            <td>${data.ch4}</td>
            <td>${data.temp}</td>
            <td>${data.humidity}</td>
            <td><span class="status-badge ${status.class}">${status.text}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Get overall status
function getOverallStatus(data) {
    const nh3 = parseFloat(data.nh3);
    const h2s = parseFloat(data.h2s);
    const ch4 = parseFloat(data.ch4);
    
    if (nh3 > 35 || h2s > 20 || ch4 > 80) {
        return { class: 'danger', text: 'Bahaya' };
    } else if (nh3 > 25 || h2s > 15 || ch4 > 60) {
        return { class: 'warning', text: 'Perhatian' };
    }
    return { class: 'normal', text: 'Normal' };
}

// Format time
function formatTime(date) {
    return date.toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Refresh data
function refreshData() {
    updateSensorValues();
    showNotification('Data berhasil di-refresh', 'success');
}

// Export data
function exportData() {
    let csv = 'No,Waktu,NH3 (ppm),H2S (ppm),CH4 (ppm),Suhu (°C),Kelembaban (%),Status\n';
    
    sensorHistory.forEach((data, index) => {
        const status = getOverallStatus(data);
        csv += `${index + 1},${formatTime(data.timestamp)},${data.nh3},${data.h2s},${data.ch4},${data.temp},${data.humidity},${status.text}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensor-data-${new Date().getTime()}.csv`;
    a.click();
    
    showNotification('Data berhasil di-export', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    // Simple alert for now, can be enhanced with toast notification
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Generate initial data
    for (let i = 0; i < 50; i++) {
        sensorHistory.push(generateSensorReading());
    }
    
    updateSensorValues();
    updateTable();
    
    // Auto update every 3 seconds
    setInterval(updateSensorValues, 3000);
});
