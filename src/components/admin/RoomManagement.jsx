import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Wifi, WifiOff, Hotel } from 'lucide-react';
import { motion } from 'framer-motion';
import { DataTable } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { useRoomStore } from '../../stores/roomStore';
import { formatCurrency } from '../../utils/currency';

const RoomManagement = () => {
  const { rooms, isLoading, error, fetchRooms, addRoom, updateRoom, deleteRoom } = useRoomStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    room_number: '',
    room_type: 'ac',
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
      room_type: 'ac',
      price_per_day: '',
      description: '',
      is_active: true
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getRoomTypeDisplay = (type) => {
    return type === 'ac' ? 'AC Room' : 'Non-AC Room';
  };

  const getStatusBadge = (status) => {
    return status ? (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800">
        Active
      </span>
    ) : (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-800">
        Inactive
      </span>
    );
  };

  const columns = [
    {
      header: 'Room Number',
      accessor: 'room_number',
      render: (value, room) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Hotel className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <span className="font-medium text-white">{room.room_number}</span>
            <p className="text-xs text-slate-400">{getRoomTypeDisplay(room.room_type)}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Type',
      accessor: 'room_type',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          value === 'ac' 
            ? 'bg-blue-900/30 text-blue-400 border border-blue-800' 
            : 'bg-orange-900/30 text-orange-400 border border-orange-800'
        }`}>
          {getRoomTypeDisplay(value)}
        </span>
      )
    },
    {
      header: 'Price Per Day',
      accessor: 'price_per_day',
      render: (value) => (
        <span className="font-semibold text-green-400">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'is_active',
      render: (value) => getStatusBadge(value)
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (value) => (
        <span className="text-slate-300 text-sm">
          {value || 'No description'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      sortable: false,
      render: (value, room) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(room)}
            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
            title="Edit Room"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(room.id)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Room Management</h1>
        </div>
        <div className="card bg-red-900/20 border-red-800">
          <p className="text-red-400">Error loading rooms: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Room Management</h1>
          <p className="text-slate-400">Manage hotel rooms and pricing</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Room
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Hotel className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Rooms</p>
              <p className="text-2xl font-bold text-white">{rooms.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <Wifi className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Active Rooms</p>
              <p className="text-2xl font-bold text-white">
                {rooms.filter(r => r.is_active).length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Wifi className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">AC Rooms</p>
              <p className="text-2xl font-bold text-white">
                {rooms.filter(r => r.room_type === 'ac').length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <WifiOff className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Non-AC Rooms</p>
              <p className="text-2xl font-bold text-white">
                {rooms.filter(r => r.room_type === 'non_ac').length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Rooms Table */}
      <DataTable
        data={rooms}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No rooms found. Add your first room to get started."
        searchable={true}
        sortable={true}
        pagination={true}
        pageSize={10}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingRoom ? 'Edit Room' : 'Add New Room'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="room_number" className="block text-sm font-medium text-slate-300 mb-2">
              Room Number *
            </label>
            <input
              type="text"
              id="room_number"
              name="room_number"
              value={formData.room_number}
              onChange={handleInputChange}
              className={`input-field ${
                formErrors.room_number ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="e.g., 101, A1, etc."
            />
            {formErrors.room_number && (
              <p className="text-red-400 text-sm mt-1">{formErrors.room_number}</p>
            )}
          </div>

          <div>
            <label htmlFor="room_type" className="block text-sm font-medium text-slate-300 mb-2">
              Room Type *
            </label>
            <select
              id="room_type"
              name="room_type"
              value={formData.room_type}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="ac">AC Room</option>
              <option value="non_ac">Non-AC Room</option>
            </select>
          </div>

          <div>
            <label htmlFor="price_per_day" className="block text-sm font-medium text-slate-300 mb-2">
              Price Per Day (Rs.) *
            </label>
            <input
              type="number"
              id="price_per_day"
              name="price_per_day"
              value={formData.price_per_day}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={`input-field ${
                formErrors.price_per_day ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="0.00"
            />
            {formErrors.price_per_day && (
              <p className="text-red-400 text-sm mt-1">{formErrors.price_per_day}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="input-field"
              placeholder="Room description..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="rounded border-slate-600 bg-dark-800 text-primary-600 focus:ring-primary-600"
            />
            <label htmlFor="is_active" className="text-sm text-slate-300">
              Active Room
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary flex-1"
              disabled={isLoading}
            >
              {editingRoom ? 'Update Room' : 'Add Room'}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default RoomManagement;