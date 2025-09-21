const { ipcRenderer } = require('electron');

let billData = null;

document.addEventListener('DOMContentLoaded', () => {
    // Listen for bill data from main process
    ipcRenderer.on('print:setBillData', (event, data) => {
        billData = data;
        populateBillData();
    });
});

function populateBillData() {
    if (!billData) return;

    // Bill info
    document.getElementById('billNumber').textContent = billData.bill_number;
    document.getElementById('billDate').textContent = formatDate(billData.created_at);

    // Customer info
    document.getElementById('customerName').textContent = billData.customer_name;
    document.getElementById('customerPhone').textContent = billData.customer_phone || 'N/A';
    document.getElementById('customerAddress').textContent = billData.customer_address || 'N/A';

    // Room details
    document.getElementById('roomNumber').textContent = billData.room_number;
    document.getElementById('roomType').textContent = billData.room_type === 'ac' ? 'AC Room' : 'Non-AC Room';
    document.getElementById('checkInDate').textContent = formatDate(billData.check_in_date);
    document.getElementById('checkOutDate').textContent = formatDate(billData.check_out_date);
    document.getElementById('days').textContent = billData.days;
    document.getElementById('ratePerDay').textContent = billData.price_per_day;
    document.getElementById('totalAmount').textContent = billData.total_amount;

    // Bill summary
    const subtotal = parseFloat(billData.total_amount);
    const tax = subtotal * 0.12; // 12% GST
    const grandTotal = subtotal + tax;

    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('tax').textContent = tax.toFixed(2);
    document.getElementById('grandTotal').textContent = grandTotal.toFixed(2);
}

function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'Asia/Kolkata'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}