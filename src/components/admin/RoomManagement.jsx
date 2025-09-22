import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Hotel, Edit, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRoomStore } from '../../stores/roomStore'
import { roomSchema } from '../../utils/validation'
import { Modal } from '../common/Modal'
import { DataTable } from '../common/DataTable'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { formatCurrency } from '../../utils/currency'

export const RoomManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  
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

  const handleOpenModal = (room = null) => {
    setEditingRoom(room)
    if (room) {
      setValue('room_number', room.room_number)
      setValue('room_type', room.room_type)
      setValue('price_per_day', room.price_per_day)
      setValue('description', room.description || '')
    } else {
      reset()
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingRoom(null)
    reset()
  }

  const onSubmit = async (data) => {
    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, data)
      } else {
        await addRoom(data)
      }
      handleCloseModal()
    } catch (error) {
      console.error('Error saving room:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteRoom(id)
      } catch (error) {
        console.error('Error deleting room:', error)
      }
    }
  }

  const columns = [
    {
      header: 'Room Number',
      accessor: 'room_number',
      className: 'font-medium text-white'
    },
    {
      header: 'Type',
      accessor: 'room_type',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value === 'ac' 
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
            : 'bg-green-500/20 text-green-400 border border-green-500/30'
        }`}>
          {value === 'ac' ? 'AC Room' : 'Non-AC Room'}
        </span>
      )
    },
    {
      header: 'Price/Day',
      accessor: 'price_per_day',
      render: (value) => (
        <span className="font-semibold text-primary-400">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (value) => value || 'No description'
    },
    {
      header: 'Created',
      accessor: 'created_at',
      render: (value) => new Date(value).toLocaleDateString('en-LK')
    },
    {
      header: 'Actions',
      accessor: 'id',
      sortable: false,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
            title="Edit Room"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(value)}
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-row items-center justify-between gap-4 lg:flex-col lg:items-start lg:gap-3">
        <div className="flex items-center gap-3">
          <Hotel className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-white lg:text-2xl">Room Management</h1>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2 w-auto justify-center lg:w-full"
        >
          <Plus className="w-5 h-5" />
          Add Room
        </button>
      </div>

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
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingRoom ? 'Edit Room' : 'Add New Room'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Room Number *
              </label>
              <input
                {...register('room_number')}
                type="text"
                className="input-field"
                placeholder="e.g., 101, A-201"
              />
              {errors.room_number && (
                <p className="mt-1 text-sm text-red-400">{errors.room_number.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Room Type *
              </label>
              <select
                {...register('room_type')}
                className="input-field"
              >
                <option value="">Select room type</option>
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
              Price per Day (Rs.) *
            </label>
            <input
              {...register('price_per_day')}
              type="number"
              step="0.01"
              min="0"
              className="input-field"
              placeholder="e.g., 8500.00"
            />
            {errors.price_per_day && (
              <p className="mt-1 text-sm text-red-400">{errors.price_per_day.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows="3"
              className="input-field resize-none"
              placeholder="Room features, amenities, etc."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-row gap-3 pt-4 lg:flex-col">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary w-auto order-2 lg:w-full lg:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-auto order-1 flex items-center justify-center gap-2 lg:w-full lg:order-2"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <>
                  {editingRoom ? 'Update' : 'Add'} Room
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}