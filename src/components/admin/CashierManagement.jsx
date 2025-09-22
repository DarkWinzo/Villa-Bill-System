import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Users, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useCashierStore } from '../../stores/cashierStore'
import { cashierSchema } from '../../utils/validation'
import { Modal } from '../common/Modal'
import { DataTable } from '../common/DataTable'
import { LoadingSpinner } from '../common/LoadingSpinner'

export const CashierManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCashier, setEditingCashier] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  
  const { cashiers, isLoading, fetchCashiers, addCashier, updateCashier, deleteCashier } = useCashierStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(cashierSchema)
  })

  useEffect(() => {
    fetchCashiers()
  }, [fetchCashiers])

  const handleOpenModal = (cashier = null) => {
    setEditingCashier(cashier)
    if (cashier) {
      setValue('username', cashier.username)
      setValue('full_name', cashier.full_name || '')
      setValue('email', cashier.email || '')
      setValue('phone', cashier.phone || '')
      setValue('password', '') // Don't pre-fill password for security
    } else {
      reset()
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCashier(null)
    setShowPassword(false)
    reset()
  }

  const onSubmit = async (data) => {
    try {
      if (editingCashier) {
        await updateCashier(editingCashier.id, data)
      } else {
        await addCashier(data)
      }
      handleCloseModal()
    } catch (error) {
      console.error('Error saving cashier:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cashier?')) {
      try {
        await deleteCashier(id)
      } catch (error) {
        console.error('Error deleting cashier:', error)
      }
    }
  }

  const columns = [
    {
      header: 'Username',
      accessor: 'username',
      className: 'font-medium text-white'
    },
    {
      header: 'Full Name',
      accessor: 'full_name',
      render: (value) => value || 'N/A'
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (value) => value || 'N/A'
    },
    {
      header: 'Phone',
      accessor: 'phone',
      render: (value) => value || 'N/A'
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
            title="Edit Cashier"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(value)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
            title="Delete Cashier"
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
      <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-start sm:gap-3">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-white sm:text-2xl">Cashier Management</h1>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2 w-auto justify-center sm:w-full"
        >
          <Plus className="w-5 h-5" />
          Add Cashier
        </button>
      </div>

      <DataTable
        data={cashiers}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No cashiers found. Add your first cashier to get started."
        searchable={true}
        sortable={true}
        pagination={true}
        pageSize={10}
      />

      {/* Add/Edit Cashier Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCashier ? 'Edit Cashier' : 'Add New Cashier'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username *
              </label>
              <input
                {...register('username')}
                type="text"
                className="input-field"
                placeholder="Enter username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name *
              </label>
              <input
                {...register('full_name')}
                type="text"
                className="input-field"
                placeholder="Enter full name"
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-400">{errors.full_name.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className="input-field pr-12"
                placeholder={editingCashier ? "Leave blank to keep current password" : "Enter password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="input-field"
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phone
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="input-field"
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
              )}
            </div>
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
                  {editingCashier ? 'Update' : 'Add'} Cashier
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}