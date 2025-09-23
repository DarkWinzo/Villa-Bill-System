import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PlusCircle, Calculator, Calendar, User, Hotel } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRoomStore } from '../../stores/roomStore'
import { useBillStore } from '../../stores/billStore'
import { billSchema } from '../../utils/validation'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { formatCurrency } from '../../utils/currency'
import { calculateDays } from '../../utils/dateHelpers'
import { billingService } from '../../services/billingService'

export const CreateBill = () => {
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [calculatedDays, setCalculatedDays] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [billNumber, setBillNumber] = useState('')
  
  const { rooms, fetchRooms } = useRoomStore()
  const { createBill, isLoading } = useBillStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(billSchema)
  })

  const watchedFields = watch(['room_id', 'check_in_date', 'check_out_date'])

  useEffect(() => {
    fetchRooms()
    generateBillNumber()
  }, [fetchRooms])

  const generateBillNumber = () => {
    const newBillNumber = billingService.generateBillNumber()
    setBillNumber(newBillNumber)
  }

  useEffect(() => {
    const [roomId, checkIn, checkOut] = watchedFields
    
    if (roomId && checkIn && checkOut) {
      const room = rooms.find(r => r.id === parseInt(roomId))
      if (room) {
        setSelectedRoom(room)
        const days = calculateDays(checkIn, checkOut)
        const total = days * parseFloat(room.price_per_day)
        
        setCalculatedDays(days)
        setTotalAmount(total)
        setValue('price_per_day', room.price_per_day)
      }
    } else {
      setSelectedRoom(null)
      setCalculatedDays(0)
      setTotalAmount(0)
    }
  }, [watchedFields, rooms, setValue])

  const onSubmit = async (data) => {
    try {
      const billData = {
        ...data,
        bill_number: billNumber,
        room_id: parseInt(data.room_id),
        price_per_day: parseFloat(data.price_per_day),
        days: calculatedDays,
        total_amount: totalAmount,
        created_by: 1 // Current user ID - in real app this would come from auth
      }
      
      await createBill(billData)
      
      // Reset form and generate new bill number
      reset()
      generateBillNumber()
      setSelectedRoom(null)
      setCalculatedDays(0)
      setTotalAmount(0)
    } catch (error) {
      console.error('Error creating bill:', error)
    }
  }

  const handleReset = () => {
    reset()
    setSelectedRoom(null)
    setCalculatedDays(0)
    setTotalAmount(0)
    generateBillNumber()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-start sm:gap-3">
        <div className="flex items-center gap-3">
          <PlusCircle className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-white sm:text-2xl">Create New Bill</h1>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Calculator className="w-5 h-5" />
          <span className="text-sm">Bill Calculator</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Bill Information */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <PlusCircle className="w-6 h-6 text-primary-500" />
            <h2 className="text-xl font-semibold text-white">Bill Information</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Bill Number
              </label>
              <input
                type="text"
                value={billNumber}
                readOnly
                className="input-field bg-dark-700 cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Date
              </label>
              <input
                type="text"
                value={new Date().toLocaleDateString('en-LK')}
                readOnly
                className="input-field bg-dark-700 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-white">Customer Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Customer Name *
              </label>
              <input
                {...register('customer_name')}
                type="text"
                className="input-field"
                placeholder="Enter customer name"
              />
              {errors.customer_name && (
                <p className="mt-1 text-sm text-red-400">{errors.customer_name.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone Number
                </label>
                <input
                  {...register('customer_phone')}
                  type="tel"
                  className="input-field"
                  placeholder="Enter phone number"
                />
                {errors.customer_phone && (
                  <p className="mt-1 text-sm text-red-400">{errors.customer_phone.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Address
                </label>
                <input
                  {...register('customer_address')}
                  type="text"
                  className="input-field"
                  placeholder="Enter customer address"
                />
                {errors.customer_address && (
                  <p className="mt-1 text-sm text-red-400">{errors.customer_address.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Hotel className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold text-white">Booking Details</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Room Selection *
              </label>
              <select
                {...register('room_id')}
                className="input-field"
              >
                <option value="">Select a room</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.room_number} - {room.room_type === 'ac' ? 'AC Room' : 'Non-AC Room'} 
                    ({formatCurrency(room.price_per_day)}/day)
                  </option>
                ))}
              </select>
              {errors.room_id && (
                <p className="mt-1 text-sm text-red-400">{errors.room_id.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Check-in Date *
                </label>
                <input
                  {...register('check_in_date')}
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
                {errors.check_in_date && (
                  <p className="mt-1 text-sm text-red-400">{errors.check_in_date.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Check-out Date *
                </label>
                <input
                  {...register('check_out_date')}
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
                {errors.check_out_date && (
                  <p className="mt-1 text-sm text-red-400">{errors.check_out_date.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Summary */}
        {selectedRoom && calculatedDays > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card bg-gradient-to-r from-primary-900/20 to-purple-900/20 border-primary-500/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-primary-400" />
              <h2 className="text-xl font-semibold text-white">Calculation Summary</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-3">
              <div className="text-center p-4 bg-dark-800/50 rounded-xl">
                <p className="text-slate-400 text-sm mb-1">Number of Days</p>
                <p className="text-2xl font-bold text-white">{calculatedDays}</p>
              </div>
              
              <div className="text-center p-4 bg-dark-800/50 rounded-xl">
                <p className="text-slate-400 text-sm mb-1">Rate per Day</p>
                <p className="text-2xl font-bold text-primary-400">
                  {formatCurrency(selectedRoom.price_per_day)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-r from-primary-600/20 to-purple-600/20 rounded-xl border border-primary-500/30">
                <p className="text-slate-400 text-sm mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-primary-300">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-row gap-4 pt-4 lg:flex-col">
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary w-auto order-2 lg:w-full lg:order-1"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={isLoading || !selectedRoom || calculatedDays === 0}
            className="btn-primary flex-1 order-1 flex items-center justify-center gap-2 lg:w-full lg:order-2"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" color="white" />
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                Create Bill
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}