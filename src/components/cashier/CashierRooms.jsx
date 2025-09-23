import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Hotel, Search, Filter, Wifi, WifiOff } from 'lucide-react'
import { useRoomStore } from '../../stores/roomStore'
import { DataTable } from '../common/DataTable'
import { formatCurrency } from '../../utils/currency'

export const CashierRooms = () => {
  const { rooms, isLoading, fetchRooms } = useRoomStore()

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const getRoomTypeDisplay = (type) => {
    return type === 'ac' ? 'AC Room' : 'Non-AC Room'
  }

  const getStatusBadge = (status) => {
    return status ? (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800">
        Available
      </span>
    ) : (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-800">
        Occupied
      </span>
    )
  }

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
        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
          value === 'ac' 
            ? 'bg-blue-900/30 text-blue-400 border border-blue-800' 
            : 'bg-orange-900/30 text-orange-400 border border-orange-800'
        }`}>
          {value === 'ac' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
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
    }
  ]

  const availableRooms = rooms.filter(room => room.is_active)
  const acRooms = rooms.filter(room => room.room_type === 'ac')
  const nonAcRooms = rooms.filter(room => room.room_type === 'non_ac')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Hotel className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-white">Room Availability</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search rooms..."
              className="input-field pl-10 w-64"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Hotel className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{availableRooms.length}</p>
            <p className="text-slate-400 text-sm">Available</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Hotel className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-white">{rooms.length - availableRooms.length}</p>
            <p className="text-slate-400 text-sm">Occupied</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Wifi className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{acRooms.length}</p>
            <p className="text-slate-400 text-sm">AC Rooms</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <WifiOff className="w-6 h-6 text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-white">{nonAcRooms.length}</p>
            <p className="text-slate-400 text-sm">Non-AC Rooms</p>
          </div>
        </motion.div>
      </div>

      {rooms.length > 0 ? (
        <DataTable
          data={rooms}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No rooms found"
          searchable={true}
          sortable={true}
          pagination={true}
          pageSize={10}
        />
      ) : (
        <div className="card">
          <div className="text-center py-12">
            <Hotel className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No Rooms Available</h3>
            <p className="text-slate-500">
              Room data will be displayed here once rooms are added to the system.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  )
}