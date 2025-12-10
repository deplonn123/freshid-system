// =============================================
// Sampel Page JavaScript
// Untuk Sapi, Ayam, Ikan, Susu
// ============================================= //

// Generate boxes
function generateBoxes() {
    const container = document.getElementById('sampleBoxes');
    container.innerHTML = '';
    
    for (let i = 1; i <= totalBoxes; i++) {
        const boxData = generateBoxData();
        const box = createBoxElement(i, boxData);
        container.appendChild(box);
    }
}

// Generate random box data
function generateBoxData() {
    const nh3 = (10 + Math.random() * 30).toFixed(2);
    const h2s = (5 + Math.random() * 20).toFixed(2);
    const ch4 = (20 + Math.random() * 70).toFixed(2);
    const temp = (24 + Math.random() * 12).toFixed(1);
    const humidity = Math.floor(50 + Math.random() * 35);
    
    return { nh3, h2s, ch4, temp, humidity };
}

// Create box element
function createBoxElement(boxNumber, data) {
    const boxDiv = document.createElement('div');
    boxDiv.className = 'sample-box';
    boxDiv.innerHTML = `
        <div class="box-header">
            <h3><i class="fas fa-box"></i> Box ${boxNumber} - ${sampleType}</h3>
            <div class="box-status ${getBoxStatus(data).class}">
                <i class="fas fa-circle"></i> ${getBoxStatus(data).text}
            </div>
        </div>
        
        <div class="box-sensors">
            <div class="sensor-item nh3">
                <div class="sensor-label">
                    <i class="fas fa-vial"></i>
                    <span>NH₃ (TGS2602)</span>
                </div>
                <div class="sensor-reading">${data.nh3} <span>ppm</span></div>
            </div>
            
            <div class="sensor-item h2s">
                <div class="sensor-label">
                    <i class="fas fa-flask"></i>
                    <span>H₂S (TGS2602)</span>
                </div>
                <div class="sensor-reading">${data.h2s} <span>ppm</span></div>
            </div>
            
            <div class="sensor-item ch4">
                <div class="sensor-label">
                    <i class="fas fa-fire"></i>
                    <span>CH₄ (TGS2611)</span>
                </div>
                <div class="sensor-reading">${data.ch4} <span>ppm</span></div>
            </div>
            
            <div class="sensor-item temp">
                <div class="sensor-label">
                    <i class="fas fa-temperature-high"></i>
                    <span>Suhu (DHT22)</span>
                </div>
                <div class="sensor-reading">${data.temp} <span>°C</span></div>
            </div>
            
            <div class="sensor-item humidity">
                <div class="sensor-label">
                    <i class="fas fa-tint"></i>
                    <span>Kelembaban (DHT22)</span>
                </div>
                <div class="sensor-reading">${data.humidity} <span>%</span></div>
            </div>
        </div>
        
        <div class="box-chart">
            <canvas id="chart-box-${boxNumber}"></canvas>
        </div>
        
        <div class="box-footer">
            <button class="btn btn-sm btn-secondary" onclick="viewDetails(${boxNumber})">
                <i class="fas fa-eye"></i> Detail
            </button>
            <button class="btn btn-sm btn-primary" onclick="exportBoxData(${boxNumber})">
                <i class="fas fa-download"></i> Export
            </button>
        </div>
    `;
    
    // Create chart after element is added to DOM
    setTimeout(() => {
        createBoxChart(boxNumber, data);
    }, 100);
    
    return boxDiv;
}

// Get box status
function getBoxStatus(data) {
    const nh3 = parseFloat(data.nh3);
    const h2s = parseFloat(data.h2s);
    const ch4 = parseFloat(data.ch4);
    
    if (nh3 > 35 || h2s > 20 || ch4 > 80) {
        return { class: 'danger', text: 'Tidak Segar' };
    } else if (nh3 > 25 || h2s > 15 || ch4 > 60) {
        return { class: 'warning', text: 'Kurang Segar' };
    }
    return { class: 'fresh', text: 'Segar' };
}

// Create chart for box
function createBoxChart(boxNumber, data) {
    const ctx = document.getElementById(`chart-box-${boxNumber}`);
    if (!ctx) return;
    
    new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['10s', '8s', '6s', '4s', '2s', 'Now'],
            datasets: [
                {
                    label: 'NH₃',
                    data: generateHistoricalData(data.nh3),
                    borderColor: '#3498DB',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'H₂S',
                    data: generateHistoricalData(data.h2s),
                    borderColor: '#EC4899',
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'CH₄',
                    data: generateHistoricalData(data.ch4),
                    borderColor: '#E67E22',
                    backgroundColor: 'rgba(230, 126, 34, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
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
                    position: 'bottom',
                    labels: {
                        color: '#2C3E50',
                        font: { size: 10 },
                        usePointStyle: true,
                        padding: 10
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#95A5A6', font: { size: 9 } }
                },
                y: {
                    grid: { color: 'rgba(149, 165, 166, 0.1)' },
                    ticks: { 
                        color: '#95A5A6',
                        font: { size: 9 },
                        callback: function(value) {
                            return value + ' ppm';
                        }
                    }
                }
            }
        }
    });
}

// Generate historical data
function generateHistoricalData(currentValue) {
    const current = parseFloat(currentValue);
    const data = [];
    for (let i = 0; i < 5; i++) {
        data.push((current - 5 + Math.random() * 10).toFixed(2));
    }
    data.push(current);
    return data;
}

// View details
function viewDetails(boxNumber) {
    alert(`Menampilkan detail Box ${boxNumber} - ${sampleType}`);
}

// Export box data
function exportBoxData(boxNumber) {
    try {
        const box = document.querySelector(`.sample-box[data-box="${boxNumber}"]`);
        if (!box) {
            alert('Data box tidak ditemukan');
            return;
        }
        
        const nh3 = box.querySelector('.sensor-value.nh3').textContent.replace(' ppm', '');
        const h2s = box.querySelector('.sensor-value.h2s').textContent.replace(' ppm', '');
        const ch4 = box.querySelector('.sensor-value.ch4').textContent.replace(' ppm', '');
        const temp = box.querySelector('.sensor-value.temp').textContent.replace('°C', '');
        const humidity = box.querySelector('.sensor-value.humidity').textContent.replace('%', '');
        const status = box.querySelector('.box-status').textContent;
        
        let csv = 'Parameter,Value,Unit\n';
        csv += `NH3,${nh3},ppm\n`;
        csv += `H2S,${h2s},ppm\n`;
        csv += `CH4,${ch4},ppm\n`;
        csv += `Temperature,${temp},°C\n`;
        csv += `Humidity,${humidity},%\n`;
        csv += `Status,${status},-\n`;
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        const filename = `${sampleType}-Box${boxNumber}-${new Date().getTime()}.csv`;
        
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        
        alert(`Data Box ${boxNumber} berhasil di-export!`);
    } catch (error) {
        console.error('Error exporting box data:', error);
        alert('Gagal export data: ' + error.message);
    }
}

// Refresh data
function refreshData() {
    generateBoxes();
    alert('Data telah di-refresh!');
}

// Export all data
function exportData() {
    try {
        const boxes = document.querySelectorAll('.sample-box');
        if (boxes.length === 0) {
            alert('Tidak ada data untuk di-export');
            return;
        }
        
        let csv = 'Box,NH3 (ppm),H2S (ppm),CH4 (ppm),Suhu (°C),Kelembaban (%),Status\n';
        
        boxes.forEach((box, index) => {
            const boxNum = index + 1;
            const nh3 = box.querySelector('.sensor-value.nh3').textContent.replace(' ppm', '');
            const h2s = box.querySelector('.sensor-value.h2s').textContent.replace(' ppm', '');
            const ch4 = box.querySelector('.sensor-value.ch4').textContent.replace(' ppm', '');
            const temp = box.querySelector('.sensor-value.temp').textContent.replace('°C', '');
            const humidity = box.querySelector('.sensor-value.humidity').textContent.replace('%', '');
            const status = box.querySelector('.box-status').textContent;
            
            csv += `Box ${boxNum},${nh3},${h2s},${ch4},${temp},${humidity},${status}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        const now = new Date();
        const filename = `${sampleType}-AllBoxes-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}.csv`;
        
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        
        alert(`Semua data ${sampleType} berhasil di-export!`);
    } catch (error) {
        console.error('Error exporting all data:', error);
        alert('Gagal export data: ' + error.message);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    generateBoxes();
    
    // Auto refresh every 5 seconds
    setInterval(generateBoxes, 5000);
});
