const { ipcRenderer } = require('electron');

let currentUser = null;
let rooms = [];
let bills = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    currentUser = await ipcRenderer.invoke('auth:getCurrentUser');
    if (!currentUser || currentUser.role !== 'cashier') {
        window.location.href = 'login.html';
        return;
    }

    // Set current user display
    document.getElementById('currentUser').textContent = `Welcome, ${currentUser.username}`;

    // Initialize the application
    await initializeApp();
    setupEventListeners();
});

async function initializeApp() {
    try {
        await loadRooms();
        await loadBills();
        updateStats();
        renderRecentBills();
        renderAvailableRooms();
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('Error loading data. Please refresh the page.');
    }
}

function setupEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    // Quick actions
    document.getElementById('createBillBtn').addEventListener('click', async () => {
        await loadRoomsForBilling();
        const billNumber = await ipcRenderer.invoke('billing:generateBillNumber');
        document.getElementById('billNumber').value = billNumber;
        document.getElementById('billForm').reset();
        document.getElementById('billNumber').value = billNumber;
        openModal('billModal');
    });

    document.getElementById('viewRoomsBtn').addEventListener('click', () => {
        // Scroll to rooms section
        document.querySelector('.available-rooms').scrollIntoView({ behavior: 'smooth' });
    });

    // Bill form
    document.getElementById('billForm').addEventListener('submit', handleBillSubmit);

    // Date change handlers for bill calculation
    document.getElementById('checkInDate').addEventListener('change', calculateBillAmount);
    document.querySelector('input[name="check_out_date"]').addEventListener('change', calculateBillAmount);
    document.getElementById('billRoom').addEventListener('change', updateRoomPrice);

    // Modal close handlers
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal.id);
        });
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

async function loadRooms() {
    try {
        rooms = await ipcRenderer.invoke('rooms:getAll');
    } catch (error) {
        console.error('Error loading rooms:', error);
        alert('Error loading rooms');
    }
}

async function loadBills() {
    try {
        bills = await ipcRenderer.invoke('billing:getAll');
    } catch (error) {
        console.error('Error loading bills:', error);
        alert('Error loading bills');
    }
}

function updateStats() {
    const today = new Date().toDateString();
    const todayBills = bills.filter(bill => 
        new Date(bill.created_at).toDateString() === today
    );
    
    const todayRevenue = todayBills.reduce((sum, bill) => 
        sum + parseFloat(bill.total_amount), 0
    );

    document.getElementById('todayBills').textContent = todayBills.length;
    document.getElementById('todayRevenue').textContent = `Rs. ${todayRevenue.toFixed(2)}`;
}

function renderRecentBills() {
    const tbody = document.querySelector('#recentBillsTable tbody');
    tbody.innerHTML = '';

    // Show last 5 bills
    const recentBills = bills.slice(0, 5);

    recentBills.forEach(bill => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${bill.bill_number}</td>
            <td>${bill.customer_name}</td>
            <td>${bill.room_number}</td>
            <td>₹${bill.total_amount}</td>
            <td>
                <button class="print-btn" onclick="printBill(${bill.id})">Print</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    if (recentBills.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" style="text-align: center; color: #666;">No bills found</td>';
        tbody.appendChild(row);
    }
}

function renderAvailableRooms() {
    const container = document.getElementById('roomsList');
    container.innerHTML = '';

    rooms.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card available';
        roomCard.innerHTML = `
            <div class="room-number">${room.room_number}</div>
            <div class="room-type">${room.room_type === 'ac' ? 'AC Room' : 'Non-AC Room'}</div>
            <div class="room-price">₹${room.price_per_day}/day</div>
        `;
        
        roomCard.addEventListener('click', () => {
            selectRoomForBilling(room);
        });
        
        container.appendChild(roomCard);
    });
}

async function selectRoomForBilling(room) {
    await loadRoomsForBilling();
    const billNumber = await ipcRenderer.invoke('billing:generateBillNumber');
    
    document.getElementById('billForm').reset();
    document.getElementById('billNumber').value = billNumber;
    document.getElementById('billRoom').value = room.id;
    document.getElementById('pricePerDayBill').value = room.price_per_day;
    
    openModal('billModal');
}

async function handleBillSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const billData = {
        bill_number: formData.get('bill_number'),
        room_id: parseInt(formData.get('room_id')),
        customer_name: formData.get('customer_name'),
        customer_phone: formData.get('customer_phone'),
        customer_address: formData.get('customer_address'),
        check_in_date: formData.get('check_in_date'),
        check_out_date: formData.get('check_out_date'),
        price_per_day: parseFloat(formData.get('price_per_day')),
        created_by: currentUser.id
    };

    try {
        await ipcRenderer.invoke('billing:create', billData);
        await loadBills();
        updateStats();
        renderRecentBills();
        closeModal('billModal');
        alert('Bill created successfully!');
    } catch (error) {
        console.error('Error creating bill:', error);
        alert('Error creating bill: ' + error.message);
    }
}

async function loadRoomsForBilling() {
    const select = document.getElementById('billRoom');
    select.innerHTML = '<option value="">Select Room</option>';
    
    rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.id;
        option.textContent = `${room.room_number} - ${room.room_type === 'ac' ? 'AC' : 'Non-AC'} (₹${room.price_per_day}/day)`;
        option.dataset.price = room.price_per_day;
        select.appendChild(option);
    });
}

function updateRoomPrice() {
    const select = document.getElementById('billRoom');
    const selectedOption = select.options[select.selectedIndex];
    if (selectedOption && selectedOption.dataset.price) {
        document.getElementById('pricePerDayBill').value = selectedOption.dataset.price;
        calculateBillAmount();
    }
}

function calculateBillAmount() {
    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.querySelector('input[name="check_out_date"]').value;
    const pricePerDay = parseFloat(document.getElementById('pricePerDayBill').value);

    if (checkIn && checkOut && pricePerDay) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (days > 0) {
            document.getElementById('days').value = days;
            document.getElementById('totalAmount').value = (days * pricePerDay).toFixed(2);
        }
    }
}

async function printBill(id) {
    try {
        const result = await ipcRenderer.invoke('billing:print', id);
        if (!result.success) {
            alert('Error printing bill: ' + result.message);
        }
    } catch (error) {
        console.error('Error printing bill:', error);
        alert('Error printing bill');
    }
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Make functions global for onclick handlers
window.printBill = printBill;
window.closeModal = closeModal;