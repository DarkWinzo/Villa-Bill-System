import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Wifi, WifiOff } from 'lucide-react';
import DataTable from '../common/DataTable';
import Modal from '../common/Modal';
import { useRoomStore } from '../../stores/roomStore';

const RoomManagement = () => {
  const { rooms, loading, error, fetchRooms, addRoom, updateRoom, deleteRoom } = useRoomStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    number: '',
    type: 'Standard',
    hourlyRate: '',
    status: 'Available'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.number.trim()) {
      errors.number = 'Room number is required';
    }
    
    if (!formData.hourlyRate || formData.hourlyRate <= 0) {
      errors.hourlyRate = 'Valid hourly rate is required';
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
        hourlyRate: parseFloat(formData.hourlyRate)
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
      number: room.number,
      type: room.type,
      hourlyRate: room.hourlyRate.toString(),
      status: room.status
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
      number: '',
      type: 'Standard',
      hourlyRate: '',
      status: 'Available'
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
    switch (status) {
      case 'Available':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'Occupied':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      case 'Maintenance':
        return <WifiOff className="w-4 h-4 text-yellow-500" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'Available':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Occupied':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'Maintenance':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const columns = [
    {
      key: 'number',
      label: 'Room Number',
      render: (room) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(room.status)}
          <span className="font-medium">{room.number}</span>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type'
    },
    {
      key: 'hourlyRate',
      label: 'Hourly Rate',
      render: (room) => `₱${room.hourlyRate.toFixed(2)}`
    },
    {
      key: 'status',
      label: 'Status',
      render: (room) => (
        <span className={getStatusBadge(room.status)}>
          {room.status}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (room) => (
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
            disabled={room.status === 'Occupied'}
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
            <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
              Room Number
            </label>
            <input
              type="text"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.number ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 101, A1, etc."
            />
            {formErrors.number && (
              <p className="text-red-500 text-sm mt-1">{formErrors.number}</p>
            )}
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Room Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
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
            <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
              Hourly Rate (₱)
            </label>
            <input
              type="number"
              id="hourlyRate"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.hourlyRate ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {formErrors.hourlyRate && (
              <p className="text-red-500 text-sm mt-1">{formErrors.hourlyRate}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
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