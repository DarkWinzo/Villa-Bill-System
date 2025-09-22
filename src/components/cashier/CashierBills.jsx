import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Receipt, Search, Filter, Plus, Eye, Printer } from 'lucide-react'
import { useBillStore } from '../../stores/billStore'
import { DataTable } from '../common/DataTable'
import { formatCurrency } from '../../utils/currency'
import { formatDisplayDate } from '../../utils/dateHelpers'
import { Modal } from '../common/Modal'

export const CashierBills = () => {
  const [selectedBill, setSelectedBill] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  
  const { bills, stats, isLoading, fetchBills } = useBillStore()

  useEffect(() => {
    fetchBills()
  }, [fetchBills])

  const handleViewBill = (bill) => {
    setSelectedBill(bill)
    setIsViewModalOpen(true)
  }

  const handlePrintBill = (bill) => {
    // Create a print-friendly version
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bill ${bill.bill_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .bill-details { margin-bottom: 20px; }
            .customer-info { margin-bottom: 20px; }
            .booking-details { margin-bottom: 20px; }
            .total { font-size: 18px; font-weight: bold; text-align: right; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Vila POS System</h1>
            <h2>Accommodation Bill</h2>
          </div>
          
          <div class="bill-details">
            <p><strong>Bill Number:</strong> ${bill.bill_number}</p>
            <p><strong>Date:</strong> ${formatDisplayDate(bill.created_at)}</p>
          </div>
          
          <div class="customer-info">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${bill.customer_name}</p>
            <p><strong>Phone:</strong> ${bill.customer_phone || 'N/A'}</p>
            <p><strong>Address:</strong> ${bill.customer_address || 'N/A'}</p>
          </div>
          
          <div class="booking-details">
            <h3>Booking Details</h3>
            <table>
              <tr>
                <th>Room Number</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Days</th>
                <th>Rate/Day</th>
                <th>Total</th>
              </tr>
              <tr>
                <td>${bill.room_number || 'N/A'}</td>
                <td>${formatDisplayDate(bill.check_in_date)}</td>
                <td>${formatDisplayDate(bill.check_out_date)}</td>
                <td>${bill.days}</td>
                <td>${formatCurrency(bill.price_per_day)}</td>
                <td>${formatCurrency(bill.total_amount)}</td>
              </tr>
            </table>
          </div>
          
          <div class="total">
            <p>Total Amount: ${formatCurrency(bill.total_amount)}</p>
          </div>
          
          <div style="margin-top: 40px; text-align: center;">
            <p>Thank you for choosing Vila POS!</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const columns = [
    {
      header: 'Bill Number',
      accessor: 'bill_number',
      className: 'font-medium text-white'
    },
    {
      header: 'Customer',
      accessor: 'customer_name',
      className: 'font-medium'
    },
    {
      header: 'Room',
      accessor: 'room_number',
      render: (value) => value || 'N/A'
    },
    {
      header: 'Check-in',
      accessor: 'check_in_date',
      render: (value) => formatDisplayDate(value)
    },
    {
      header: 'Check-out',
      accessor: 'check_out_date',
      render: (value) => formatDisplayDate(value)
    },
    {
      header: 'Days',
      accessor: 'days',
      className: 'text-center'
    },
    {
      header: 'Amount',
      accessor: 'total_amount',
      render: (value) => (
        <span className="font-semibold text-green-400">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      header: 'Date',
      accessor: 'created_at',
      render: (value) => formatDisplayDate(value)
    },
    {
      header: 'Actions',
      accessor: 'id',
      sortable: false,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewBill(row)}
            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
            title="View Bill"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlePrintBill(row)}
            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-colors"
            title="Print Bill"
          >
            <Printer className="w-4 h-4" />
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Receipt className="w-8 h-8 text-primary-500" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">My Bills</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card card-hover">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Bills</p>
              <p className="text-xl font-bold text-white">{stats.totalBills}</p>
            </div>
          </div>
        </div>

        <div className="card card-hover">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Today's Bills</p>
              <p className="text-xl font-bold text-white">{stats.todayBills}</p>
            </div>
          </div>
        </div>

        <div className="card card-hover">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Revenue</p>
              <p className="text-xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="card card-hover">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Today's Revenue</p>
              <p className="text-xl font-bold text-white">{formatCurrency(stats.todayRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        data={bills}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No bills found. Create your first bill to get started."
        searchable={true}
        sortable={true}
        pagination={true}
        pageSize={10}
      />

      {/* View Bill Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Bill Details - ${selectedBill?.bill_number}`}
        size="lg"
      >
        {selectedBill && (
          <div className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Customer Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Name:</span>
                  <span className="ml-2 text-white font-medium">{selectedBill.customer_name}</span>
                </div>
                <div>
                  <span className="text-slate-400">Phone:</span>
                  <span className="ml-2 text-white">{selectedBill.customer_phone || 'N/A'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400">Address:</span>
                  <span className="ml-2 text-white">{selectedBill.customer_address || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Booking Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Room Number:</span>
                  <span className="ml-2 text-white font-medium">{selectedBill.room_number || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Room Type:</span>
                  <span className="ml-2 text-white">{selectedBill.room_type === 'ac' ? 'AC Room' : 'Non-AC Room'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Check-in:</span>
                  <span className="ml-2 text-white">{formatDisplayDate(selectedBill.check_in_date)}</span>
                </div>
                <div>
                  <span className="text-slate-400">Check-out:</span>
                  <span className="ml-2 text-white">{formatDisplayDate(selectedBill.check_out_date)}</span>
                </div>
                <div>
                  <span className="text-slate-400">Number of Days:</span>
                  <span className="ml-2 text-white font-medium">{selectedBill.days}</span>
                </div>
                <div>
                  <span className="text-slate-400">Rate per Day:</span>
                  <span className="ml-2 text-white font-medium">{formatCurrency(selectedBill.price_per_day)}</span>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="border-t border-dark-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-slate-300">Total Amount:</span>
                <span className="text-2xl font-bold text-primary-400">
                  {formatCurrency(selectedBill.total_amount)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="btn-secondary w-full sm:w-auto order-2 sm:order-1"
              >
                Close
              </button>
              <button
                onClick={() => handlePrintBill(selectedBill)}
                className="btn-primary w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Bill
              </button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}