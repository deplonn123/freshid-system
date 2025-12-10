// Generate sample report data
function generateReportData() {
    const samples = ['Ayam', 'Sapi', 'Ikan', 'Susu'];
    const statuses = ['Segar', 'Kurang Segar', 'Tidak Segar'];
    const reports = [];

    for (let i = 1; i <= 156; i++) {
        const sample = samples[Math.floor(Math.random() * samples.length)];
        const box = Math.floor(Math.random() * 3) + 1;
        const nh3 = (Math.random() * 50).toFixed(1);
        const h2s = (Math.random() * 30).toFixed(1);
        const ch4 = (Math.random() * 100).toFixed(1);
        const temp = (20 + Math.random() * 15).toFixed(1);
        
        let status;
        if (nh3 > 35 || h2s > 20 || ch4 > 80) {
            status = 'Tidak Segar';
        } else if (nh3 > 25 || h2s > 12 || ch4 > 60) {
            status = 'Kurang Segar';
        } else {
            status = 'Segar';
        }

        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        reports.push({
            id: `RPT-${String(i).padStart(4, '0')}`,
            date: date,
            sample: sample,
            box: `Box ${box}`,
            nh3: nh3,
            h2s: h2s,
            ch4: ch4,
            temp: temp,
            status: status
        });
    }

    return reports.sort((a, b) => b.date - a.date);
}

// Create table row
function createTableRow(report) {
    const row = document.createElement('tr');
    
    let statusClass, statusIcon;
    if (report.status === 'Segar') {
        statusClass = 'badge-success';
        statusIcon = 'check-circle';
    } else if (report.status === 'Kurang Segar') {
        statusClass = 'badge-warning';
        statusIcon = 'exclamation-triangle';
    } else {
        statusClass = 'badge-danger';
        statusIcon = 'times-circle';
    }

    row.innerHTML = `
        <td><strong>${report.id}</strong></td>
        <td>${report.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
        <td><i class="fas fa-drumstick-bite"></i> ${report.sample}</td>
        <td>${report.box}</td>
        <td>${report.nh3}</td>
        <td>${report.h2s}</td>
        <td>${report.ch4}</td>
        <td>${report.temp}</td>
        <td><span class="badge ${statusClass}"><i class="fas fa-${statusIcon}"></i> ${report.status}</span></td>
        <td>
            <button class="btn-icon" onclick="viewReport('${report.id}')" title="Lihat Detail">
                <i class="fas fa-eye"></i>
            </button>
        </td>
    `;
    
    return row;
}

// Populate table
function populateTable(reports) {
    const tbody = document.getElementById('reportsTableBody');
    tbody.innerHTML = '';
    
    reports.slice(0, 10).forEach(report => {
        tbody.appendChild(createTableRow(report));
    });
}

// Filter reports
function filterReports() {
    const sampleFilter = document.getElementById('sampleFilter').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    let filtered = allReports.filter(report => {
        const matchSample = !sampleFilter || report.sample.toLowerCase() === sampleFilter;
        const matchStatus = !statusFilter || report.status.toLowerCase().includes(statusFilter);
        const matchDate = !dateFilter || report.date.toISOString().split('T')[0] === dateFilter;
        const matchSearch = !searchTerm || 
            report.id.toLowerCase().includes(searchTerm) ||
            report.sample.toLowerCase().includes(searchTerm) ||
            report.status.toLowerCase().includes(searchTerm);

        return matchSample && matchStatus && matchDate && matchSearch;
    });

    populateTable(filtered);
}

// View report details
function viewReport(reportId) {
    alert(`Menampilkan detail laporan ${reportId}\n\nFitur ini akan menampilkan detail lengkap pengujian.`);
}

// Generate PDF report
function generateReport() {
    try {
        // Get filtered reports
        const reports = allReports.slice(0, 50); // Export max 50 records
        
        // Create CSV content (as alternative to PDF since jsPDF needs library)
        let csv = 'ID,Tanggal,Sampel,Box,NH3 (ppm),H2S (ppm),CH4 (ppm),Suhu (°C),Status\n';
        
        reports.forEach(report => {
            const dateStr = report.date.toLocaleDateString('id-ID') + ' ' + report.date.toLocaleTimeString('id-ID');
            csv += `${report.id},"${dateStr}",${report.sample},${report.box},${report.nh3},${report.h2s},${report.ch4},${report.temp},${report.status}\n`;
        });
        
        // Create blob and download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const now = new Date();
        const filename = `laporan-pengujian-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Show success notification
        showNotification('Laporan berhasil di-export sebagai CSV', 'success');
    } catch (error) {
        console.error('Error exporting report:', error);
        showNotification('Gagal export laporan: ' + error.message, 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element if doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
    }
    
    // Set background based on type
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    notification.style.display = 'block';
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Initialize
let allReports = [];

document.addEventListener('DOMContentLoaded', function() {
    allReports = generateReportData();
    populateTable(allReports);

    // Add event listeners for filters
    document.getElementById('sampleFilter').addEventListener('change', filterReports);
    document.getElementById('statusFilter').addEventListener('change', filterReports);
    document.getElementById('dateFilter').addEventListener('change', filterReports);
    document.getElementById('searchInput').addEventListener('input', filterReports);
});
