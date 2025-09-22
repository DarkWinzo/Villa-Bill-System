import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, UserPlus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { DataTable } from '../common/DataTable'
import { Modal } from '../common/Modal'
import { LoadingSpinner } from '../common/LoadingSpinner'

export const CashierManagement = () => {
  const [cashiers, setCashiers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedCashier, setSelectedCashier] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isActive: true
  })

  useEffect(() => {
    fetchCashiers()
  }, [])

  const fetchCashiers = async () => {
    try {
      setIsLoading(true)
      // TODO: Implement actual API call
      // const response = await cashierService.getAllCashiers()
      // setCashiers(response.data)
      
      // Mock data for now
      setTimeout(() => {
        setCashiers([
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            isActive: true,
            createdAt: '2024-01-15',
            lastLogin: '2024-01-20'
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            isActive: false,
            createdAt: '2024-01-10',
            lastLogin: '2024-01-18'
          }
        ])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error fetching cashiers:', error)
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedCashier) {
        await updateCashier(selectedCashier.id, formData)
      } else {
        await addCashier(formData)
      }
      
      setShowModal(false)
      setSelectedCashier(null)
      setFormData({ name: '', email: '', password: '', isActive: true })
      await fetchCashiers() // Refresh the list
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
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password {selectedCashier && '(leave blank to keep current)'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field"
              required={!selectedCashier}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded border-slate-600 bg-dark-800 text-primary-600 focus:ring-primary-600"
            />
            <label htmlFor="isActive" className="text-sm text-slate-300">
              Active
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false)
                setSelectedCashier(null)
                setFormData({ username: '', full_name: '', email: '', password: '', isActive: true })
              }}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {selectedCashier ? 'Update' : 'Add'} Cashier
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}