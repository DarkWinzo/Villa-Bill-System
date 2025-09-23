import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Wifi, WifiOff } from 'lucide-react';
import { DataTable } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { useRoomStore } from '../../stores/roomStore';

const RoomManagement = () => {
  const { rooms, loading, error, fetchRooms, addRoom, updateRoom, deleteRoom } = useRoomStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    room_number: '',
    room_type: 'Standard',
    price_per_day: '',
    description: '',
    is_active: true
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.room_number.trim()) {
      errors.room_number = 'Room number is required';
    }
    
    if (!formData.price_per_day || formData.price_per_day <= 0) {
      errors.price_per_day = 'Valid price per day is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const roomData = {
        ...formData,
        price_per_day: parseFloat(formData.price_per_day)
      };

      if (editingRoom) {
        await updateRoom(editingRoom.id, roomData);
      } else {
        await addRoom(roomData);
      }
      
      handleCloseModal();
    } catch (err) {
      console.error('Error saving room:', err);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      room_number: room.room_number,
      room_type: room.room_type,
      price_per_day: room.price_per_day.toString(),
      description: room.description || '',
      is_active: room.is_active
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteRoom(roomId);
      } catch (err) {
        console.error('Error deleting room:', err);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
    setFormData({
      room_number: '',
      room_type: 'Standard',
      price_per_day: '',
      description: '',
      is_active: true
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getStatusIcon = (status) => {
    return status ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />;
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    return status 
      ? `${baseClasses} bg-green-100 text-green-800`
      : `${baseClasses} bg-red-100 text-red-800`;
  };

  const columns = [
    {
      key: 'room_number',
      label: 'Room Number',
      render: (value, room) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(room.is_active)}
          <span className="font-medium">{room.room_number}</span>
        </div>
      )
    },
    {
      key: 'room_type',
      label: 'Type'
    },
    {
      key: 'price_per_day',
      label: 'Price Per Day',
      render: (value, room) => `₱${room.price_per_day.toFixed(2)}`
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (value, room) => (
        <span className={getStatusBadge(room.is_active)}>
          {room.is_active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, room) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(room)}
            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
            title="Edit Room"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(room.id)}
            className="p-1 text-red-600 hover:text-red-800 transition-colors"
            title="Delete Room"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error loading rooms: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Room</span>
        </button>
      </div>

      <DataTable
        data={rooms}
        columns={columns}
        loading={loading}
        emptyMessage="No rooms found"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingRoom ? 'Edit Room' : 'Add New Room'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="room_number" className="block text-sm font-medium text-gray-700 mb-1">
              Room Number
            </label>
            <input
              type="text"
              id="room_number"
              name="room_number"
              value={formData.room_number}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.room_number ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 101, A1, etc."
            />
            {formErrors.room_number && (
              <p className="text-red-500 text-sm mt-1">{formErrors.room_number}</p>
            )}
          </div>

          <div>
            <label htmlFor="room_type" className="block text-sm font-medium text-gray-700 mb-1">
              Room Type
            </label>
            <select
              id="room_type"
              name="room_type"
              value={formData.room_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="VIP">VIP</option>
              <option value="Family">Family</option>
            </select>
          </div>

          <div>
            <label htmlFor="price_per_day" className="block text-sm font-medium text-gray-700 mb-1">
              Price Per Day (₱)
            </label>
            <input
              type="number"
              id="price_per_day"
              name="price_per_day"
              value={formData.price_per_day}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.price_per_day ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {formErrors.price_per_day && (
              <p className="text-red-500 text-sm mt-1">{formErrors.price_per_day}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Room description..."
            />
          </div>

          <div>
            <label htmlFor="is_active" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="is_active"
              name="is_active"
              value={formData.is_active}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingRoom ? 'Update Room' : 'Add Room'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoomManagement;