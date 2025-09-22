import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Hotel, Plus, Edit, Trash2, Search, Filter } from 'lucide-react'
import { useRoomStore } from '../../stores/roomStore'
import { DataTable } from '../common/DataTable'
import { Modal } from '../common/Modal'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { roomSchema } from '../../utils/validation'
import { formatCurrency } from '../../utils/currency'

export const RoomManagement = () => {
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showModal, setShowModal] = useState(false)
  
  const { rooms, isLoading, fetchRooms, addRoom, updateRoom, deleteRoom } = useRoomStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(roomSchema)
  })

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const handleAddRoom = () => {
    setSelectedRoom(null)
    reset()
    setShowModal(true)
  }

  const handleEditRoom = (room) => {
    setSelectedRoom(room)
    setValue('room_number', room.room_number)
    setValue('room_type', room.room_type)
    setValue('price_per_day', room.price_per_day)
    setValue('description', room.description || '')
    setShowModal(true)
  }

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteRoom(roomId)
      } catch (error) {
        console.error('Error deleting room:', error)
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      if (selectedRoom) {
        await updateRoom(selectedRoom.id, data)
      } else {
        await addRoom(data)
      }
      setShowModal(false)
      reset()
      setSelectedRoom(null)
    } catch (error) {
      console.error('Error saving room:', error)
    }
  }

  const columns = [
    {
      header: 'Room Number',
      accessor: 'room_number',
      render: (value) => (
        <div className="font-semibold text-white">{value}</div>
      )
    },
    {
      header: 'Type',
      accessor: 'room_type',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value === 'ac' 
            ? 'bg-blue-900/30 text-blue-400 border border-blue-800' 
            : 'bg-green-900/30 text-green-400 border border-green-800'
        }`}>
          {value === 'ac' ? 'AC Room' : 'Non-AC Room'}
        </span>
      )
    },
    {
      header: 'Price/Day',
      accessor: 'price_per_day',
      render: (value) => (
        <div className="font-semibold text-primary-400">
          {formatCurrency(value)}
        </div>
      )
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (value) => (
        <div className="text-slate-300 max-w-xs truncate">
          {value || 'No description'}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      sortable: false,
      render: (value, room) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditRoom(room)}
            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
            title="Edit Room"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteRoom(value)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
            title="Delete Room"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Room Management</h1>
          <p className="text-slate-400">Manage hotel rooms and pricing</p>
        </div>
        <button
          onClick={handleAddRoom}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Room
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Hotel className="w-6 h-6 text-blue-400" />
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
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <Hotel className="w-6 h-6 text-green-400" />
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

      {/* Add/Edit Room Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedRoom(null)
          reset()
        }}
        title={selectedRoom ? 'Edit Room' : 'Add New Room'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Room Number
              </label>
              <input
                {...register('room_number')}
                type="text"
                className="input-field"
                placeholder="e.g., 101"
              />
              {errors.room_number && (
                <p className="mt-1 text-sm text-red-400">{errors.room_number.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Room Type
              </label>
              <select
                {...register('room_type')}
                className="input-field"
              >
                <option value="">Select Type</option>
                <option value="ac">AC Room</option>
                <option value="non_ac">Non-AC Room</option>
              </select>
              {errors.room_type && (
                <p className="mt-1 text-sm text-red-400">{errors.room_type.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Price per Day (Rs.)
            </label>
            <input
              {...register('price_per_day')}
              type="number"
              step="0.01"
              className="input-field"
              placeholder="e.g., 8500.00"
            />
            {errors.price_per_day && (
              <p className="mt-1 text-sm text-red-400">{errors.price_per_day.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="input-field resize-none"
              placeholder="Room description, amenities, etc."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-row gap-3 pt-4 lg:flex-col">
            <button
              type="button"
              onClick={() => {
                setShowModal(false)
                setSelectedRoom(null)
                reset()
              }}
              className="btn-secondary w-auto order-2 lg:w-full lg:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 order-1 flex items-center justify-center gap-2 lg:w-full lg:order-2"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {selectedRoom ? 'Update' : 'Add'} Room
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}