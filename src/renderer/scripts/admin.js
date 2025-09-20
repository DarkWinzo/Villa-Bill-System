const { ipcRenderer } = require('electron');

let currentUser = null;
let rooms = [];
let bills = [];
let editingRoom = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    currentUser = await ipcRenderer.invoke('auth:getCurrentUser');
    if (!currentUser || currentUser.role !== 'admin') {
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
        updateDashboardStats();
        showSection('dashboard');
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('Error loading data. Please refresh the page.');
    }
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            showSection(section);
            
            // Update active nav
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    // Room management
    document.getElementById('addRoomBtn').addEventListener('click', () => {
        editingRoom = null;
        document.getElementById('roomModalTitle').textContent = 'Add Room';
        document.getElementById('roomForm').reset();
        openModal('roomModal');
    });

    document.getElementById('roomForm').addEventListener('submit', handleRoomSubmit);

    // Billing
    document.getElementById('createBillBtn').addEventListener('click', async () => {
        await loadRoomsForBilling();
        const billNumber = await ipcRenderer.invoke('billing:generateBillNumber');
        document.getElementById('billNumber').value = billNumber;
        document.getElementById('billForm').reset();
        document.getElementById('billNumber').value = billNumber;
        openModal('billModal');
    });

    document.getElementById('billForm').addEventListener('submit', handleBillSubmit);

    // Date change handlers for bill calculation
    document.getElementById('checkInDate').addEventListener('change', calculateBillAmount);
    document.getElementById('checkOutDate').addEventListener('change', calculateBillAmount);
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

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

async function loadRooms() {
    try {
        rooms = await ipcRenderer.invoke('rooms:getAll');
        renderRoomsTable();
    } catch (error) {
        console.error('Error loading rooms:', error);
        alert('Error loading rooms');
    }
}

function renderRoomsTable() {
    const tbody = document.querySelector('#roomsTable tbody');
    tbody.innerHTML = '';

    rooms.forEach(room => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${room.room_number}</td>
            <td>${room.room_type === 'ac' ? 'AC Room' : 'Non-AC Room'}</td>
            <td>₹${room.price_per_day}</td>
            <td>${room.description || '-'}</td>
            <td>
                <button class="edit-btn" onclick="editRoom(${room.id})">Edit</button>
                <button class="danger-btn" onclick="deleteRoom(${room.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function loadBills() {
    try {
        bills = await ipcRenderer.invoke('billing:getAll');
        renderBillsTable();
    } catch (error) {
        console.error('Error loading bills:', error);
        alert('Error loading bills');
    }
}

function renderBillsTable() {
    const tbody = document.querySelector('#billsTable tbody');
    tbody.innerHTML = '';

    bills.forEach(bill => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${bill.bill_number}</td>
            <td>${bill.customer_name}</td>
            <td>${bill.room_number} (${bill.room_type === 'ac' ? 'AC' : 'Non-AC'})</td>
            <td>${formatDate(bill.check_in_date)}</td>
            <td>${formatDate(bill.check_out_date)}</td>
            <td>${bill.days}</td>
            <td>₹${bill.total_amount}</td>
            <td>
                <button class="print-btn" onclick="printBill(${bill.id})">Print</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateDashboardStats() {
    document.getElementById('totalRooms').textContent = rooms.length;
    document.getElementById('totalBills').textContent = bills.length;
    
    const totalRevenue = bills.reduce((sum, bill) => sum + parseFloat(bill.total_amount), 0);
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toFixed(2)}`;
}

async function handleRoomSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const roomData = {
        room_number: formData.get('room_number'),
        room_type: formData.get('room_type'),
        price_per_day: parseFloat(formData.get('price_per_day')),
        description: formData.get('description')
    };

    try {
        if (editingRoom) {
            await ipcRenderer.invoke('rooms:update', editingRoom.id, roomData);
        } else {
            await ipcRenderer.invoke('rooms:create', roomData);
        }
        
        await loadRooms();
        updateDashboardStats();
        closeModal('roomModal');
        alert(editingRoom ? 'Room updated successfully!' : 'Room added successfully!');
    } catch (error) {
        console.error('Error saving room:', error);
        alert('Error saving room: ' + error.message);
    }
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
        updateDashboardStats();
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

function editRoom(id) {
    editingRoom = rooms.find(room => room.id === id);
    if (editingRoom) {
        document.getElementById('roomModalTitle').textContent = 'Edit Room';
        document.getElementById('roomNumber').value = editingRoom.room_number;
        document.getElementById('roomType').value = editingRoom.room_type;
        document.getElementById('pricePerDay').value = editingRoom.price_per_day;
        document.getElementById('description').value = editingRoom.description || '';
        openModal('roomModal');
    }
}

async function deleteRoom(id) {
    if (confirm('Are you sure you want to delete this room?')) {
        try {
            await ipcRenderer.invoke('rooms:delete', id);
            await loadRooms();
            updateDashboardStats();
            alert('Room deleted successfully!');
        } catch (error) {
            console.error('Error deleting room:', error);
            alert('Error deleting room: ' + error.message);
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

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN');
}

// Make functions global for onclick handlers
window.editRoom = editRoom;
window.deleteRoom = deleteRoom;
window.printBill = printBill;
window.closeModal = closeModal;