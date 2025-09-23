import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, UserPlus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { useCashierStore } from '../../stores/cashierStore'
import { DataTable } from '../common/DataTable'
import { Modal } from '../common/Modal'
import { LoadingSpinner } from '../common/LoadingSpinner'

export const CashierManagement = () => {
  const { cashiers, isLoading, fetchCashiers, addCashier, updateCashier, deleteCashier } = useCashierStore()
  const [showModal, setShowModal] = useState(false)
  const [selectedCashier, setSelectedCashier] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
    isActive: true
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchCashiers()
  }, [])

  const validateForm = () => {
    const errors = {}
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters'
    }
    
    if (!formData.full_name.trim()) {
      errors.full_name = 'Full name is required'
    }
    
    if (!selectedCashier && !formData.password.trim()) {
      errors.password = 'Password is required'
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      if (selectedCashier) {
        const updateData = { ...formData }
        if (!updateData.password) {
          delete updateData.password // Don't update password if empty
        }
        await updateCashier(selectedCashier.id, updateData)
      } else {
        await addCashier(formData)
      }
      
      handleCloseModal()
    } catch (error) {
      console.error('Error saving cashier:', error)
    }
  }

  const handleEdit = (cashier) => {
    setSelectedCashier(cashier)
    setFormData({
      username: cashier.username,
      full_name: cashier.full_name || cashier.username,
      email: cashier.email,
      password: '',
      isActive: cashier.isActive
    })
    setShowModal(true)
  }

  const handleDelete = async (cashierId) => {
    if (window.confirm('Are you sure you want to delete this cashier?')) {
      try {
        await deleteCashier(cashierId)
      } catch (error) {
        console.error('Error deleting cashier:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedCashier(null)
    setFormData({
      username: '',
      full_name: '',
      email: '',
      password: '',
      isActive: true
    })
    setFormErrors({})
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const toggleStatus = async (cashierId) => {
    try {
      const cashier = cashiers.find(c => c.id === cashierId)
      if (cashier) {
        await updateCashier(cashierId, { ...cashier, isActive: !cashier.isActive })
      }
    } catch (error) {
      console.error('Error updating cashier status:', error)
    }
  }

  const columns = [
    {
      header: 'Username',
      accessor: 'username',
      render: (value) => (
        <div className="font-medium text-white">{value}</div>
      )
    },
    {
      header: 'Full Name',
      accessor: 'full_name',
      render: (value) => (
        <div className="text-slate-300">{value || 'N/A'}</div>
      )
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (value) => (
        <div className="text-slate-300">{value || 'N/A'}</div>
      )
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-900/30 text-green-400 border border-green-800' 
            : 'bg-red-900/30 text-red-400 border border-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      render: (value) => (
        <div className="text-slate-400 text-sm">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    },
    {
      header: 'Last Login',
      accessor: 'lastLogin',
      render: (value) => (
        <div className="text-slate-400 text-sm">
          {value ? new Date(value).toLocaleDateString() : 'Never'}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      sortable: false,
      render: (value, cashier) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleStatus(value)}
            className="p-1 rounded-lg hover:bg-dark-700 transition-colors"
            title={cashier.isActive ? 'Deactivate' : 'Activate'}
          >
            {cashier.isActive ? (
              <EyeOff className="w-4 h-4 text-slate-400" />
            ) : (
              <Eye className="w-4 h-4 text-slate-400" />
            )}
          </button>
          <button
            onClick={() => handleEdit(cashier)}
            className="p-1 rounded-lg hover:bg-dark-700 transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => handleDelete(value)}
            className="p-1 rounded-lg hover:bg-dark-700 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
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
          <h1 className="text-2xl font-bold text-white mb-2">Cashier Management</h1>
          <p className="text-slate-400">Manage cashier accounts and permissions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add Cashier
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
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Cashiers</p>
              <p className="text-2xl font-bold text-white">{cashiers.length}</p>
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
              <Eye className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-white">
                {cashiers.filter(c => c.isActive).length}
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
            <div className="p-2 bg-red-600/20 rounded-lg">
              <EyeOff className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Inactive</p>
              <p className="text-2xl font-bold text-white">
                {cashiers.filter(c => !c.isActive).length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cashiers Table */}
      <DataTable
        data={cashiers}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No cashiers found"
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedCashier(null)
          setFormData({ name: '', email: '', password: '', isActive: true })
        }}
        title={selectedCashier ? 'Edit Cashier' : 'Add New Cashier'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username || ''}
              onChange={handleInputChange}
              className={`input-field ${formErrors.username ? 'border-red-500' : ''}`}
              placeholder="Enter username"
              required
            />
            {formErrors.username && (
              <p className="text-red-400 text-sm mt-1">{formErrors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name || ''}
              onChange={handleInputChange}
              className={`input-field ${formErrors.full_name ? 'border-red-500' : ''}`}
              placeholder="Enter full name"
              required
            />
            {formErrors.full_name && (
              <p className="text-red-400 text-sm mt-1">{formErrors.full_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              className={`input-field ${formErrors.email ? 'border-red-500' : ''}`}
              placeholder="Enter email (optional)"
            />
            {formErrors.email && (
              <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password {selectedCashier && '(leave blank to keep current)'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleInputChange}
              className={`input-field ${formErrors.password ? 'border-red-500' : ''}`}
              placeholder="Enter password"
              required={!selectedCashier}
            />
            {formErrors.password && (
              <p className="text-red-400 text-sm mt-1">{formErrors.password}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="rounded border-slate-600 bg-dark-800 text-primary-600 focus:ring-primary-600"
            />
            <label htmlFor="isActive" className="text-sm text-slate-300">
              Active
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
            <button type="submit" className="btn-primary flex-1" disabled={isLoading}>
              {selectedCashier ? 'Update' : 'Add'} Cashier
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}