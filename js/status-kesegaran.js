// =============================================
// Status Kesegaran Page JavaScript
// ============================================= //

const boxTypes = ['Ayam', 'Sapi', 'Ikan', 'Susu'];
let allBoxes = [];

// Generate all boxes
function generateAllBoxes() {
    allBoxes = [];
    const container = document.getElementById('boxGrid');
    container.innerHTML = '';
    
    let boxId = 1;
    boxTypes.forEach(type => {
        for (let i = 1; i <= 3; i++) {
            const data = generateBoxData();
            const status = getBoxStatus(data);
            const box = {
                id: boxId,
                type: type,
                number: i,
                data: data,
                status: status
            };
            allBoxes.push(box);
            
            const boxElement = createBoxCard(box);
            container.appendChild(boxElement);
            
            boxId++;
        }
    });
    
    updateSummary();
}

// Generate box data
function generateBoxData() {
    return {
        nh3: (10 + Math.random() * 30).toFixed(2),
        h2s: (5 + Math.random() * 20).toFixed(2),
        ch4: (20 + Math.random() * 70).toFixed(2),
        temp: (24 + Math.random() * 12).toFixed(1),
        humidity: Math.floor(50 + Math.random() * 35)
    };
}

// Get box status
function getBoxStatus(data) {
    const nh3 = parseFloat(data.nh3);
    const h2s = parseFloat(data.h2s);
    const ch4 = parseFloat(data.ch4);
    
    if (nh3 > 35 || h2s > 20 || ch4 > 80) {
        return { class: 'danger', text: 'Tidak Segar', icon: 'fa-times-circle' };
    } else if (nh3 > 25 || h2s > 15 || ch4 > 60) {
        return { class: 'warning', text: 'Kurang Segar', icon: 'fa-exclamation-triangle' };
    }
    return { class: 'fresh', text: 'Segar', icon: 'fa-check-circle' };
}

// Create box card
function createBoxCard(box) {
    const card = document.createElement('div');
    card.className = `status-box ${box.status.class}`;
    card.innerHTML = `
        <div class="status-box-header">
            <div>
                <h4>${box.type} - Box ${box.number}</h4>
                <p class="box-id">ID: BOX-${String(box.id).padStart(3, '0')}</p>
            </div>
            <div class="status-indicator ${box.status.class}">
                <i class="fas ${box.status.icon}"></i>
            </div>
        </div>
        
        <div class="status-box-body">
            <div class="mini-sensor">
                <span class="label">NH₃:</span>
                <span class="value">${box.data.nh3} ppm</span>
            </div>
            <div class="mini-sensor">
                <span class="label">H₂S:</span>
                <span class="value">${box.data.h2s} ppm</span>
            </div>
            <div class="mini-sensor">
                <span class="label">CH₄:</span>
                <span class="value">${box.data.ch4} ppm</span>
            </div>
            <div class="mini-sensor">
                <span class="label">Suhu:</span>
                <span class="value">${box.data.temp} °C</span>
            </div>
            <div class="mini-sensor">
                <span class="label">Kelembaban:</span>
                <span class="value">${box.data.humidity} %</span>
            </div>
        </div>
        
        <div class="status-box-footer">
            <span class="status-text ${box.status.class}">${box.status.text}</span>
            <button class="btn-icon" onclick="viewBoxDetails(${box.id})" title="View Details">
                <i class="fas fa-eye"></i>
            </button>
        </div>
    `;
    return card;
}

// Update summary
function updateSummary() {
    const fresh = allBoxes.filter(b => b.status.class === 'fresh').length;
    const medium = allBoxes.filter(b => b.status.class === 'warning').length;
    const bad = allBoxes.filter(b => b.status.class === 'danger').length;
    
    document.getElementById('freshCount').textContent = fresh;
    document.getElementById('mediumCount').textContent = medium;
    document.getElementById('badCount').textContent = bad;
    document.getElementById('totalBoxes').textContent = allBoxes.length;
}

// View box details
function viewBoxDetails(boxId) {
    const box = allBoxes.find(b => b.id === boxId);
    if (box) {
        const url = `sampel-${box.type.toLowerCase()}.html`;
        window.location.href = url;
    }
}

// Refresh all
function refreshAll() {
    generateAllBoxes();
    alert('Data telah di-refresh!');
}

// Export data
function exportData() {
    try {
        if (allBoxes.length === 0) {
            alert('Tidak ada data untuk di-export');
            return;
        }
        
        let csv = 'ID,Type,Box,NH3 (ppm),H2S (ppm),CH4 (ppm),Suhu (°C),Kelembaban (%),Status\n';
        
        allBoxes.forEach(box => {
            csv += `BOX-${String(box.id).padStart(3, '0')},${box.type},Box ${box.number},${box.data.nh3},${box.data.h2s},${box.data.ch4},${box.data.temp},${box.data.humidity},${box.status.text}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const now = new Date();
        const filename = `status-kesegaran-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}.csv`;
        
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        
        alert('Data berhasil di-export!');
    } catch (error) {
        console.error('Error exporting data:', error);
        alert('Gagal export data: ' + error.message);
    }
}

// Filter boxes
function filterBoxes() {
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (!typeFilter || !statusFilter) return;
    
    const selectedType = typeFilter.value.toLowerCase();
    const selectedStatus = statusFilter.value.toLowerCase();
    
    const boxes = document.querySelectorAll('.status-box-card');
    
    boxes.forEach(box => {
        const boxType = box.querySelector('.box-type').textContent.split(' - ')[0].toLowerCase();
        const boxStatus = box.querySelector('.status-indicator').className.split(' ').pop();
        
        const typeMatch = selectedType === '' || boxType === selectedType;
        const statusMatch = selectedStatus === '' || boxStatus === selectedStatus;
        
        box.style.display = (typeMatch && statusMatch) ? 'block' : 'none';
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    generateAllBoxes();
    
    // Add filter listeners
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (typeFilter) typeFilter.addEventListener('change', filterBoxes);
    if (statusFilter) statusFilter.addEventListener('change', filterBoxes);
    
    // Auto refresh every 5 seconds
    setInterval(generateAllBoxes, 5000);
});
