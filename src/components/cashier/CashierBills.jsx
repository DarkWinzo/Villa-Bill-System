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
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
          <style>
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            body {
              background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%) !important;
              color: #1e293b !important;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
              margin: 0 !important;
              padding: 20px !important;
              line-height: 1.6;
            }
            
            .print-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            }
            
            .print-header {
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
              color: white !important;
              padding: 40px 30px !important;
              text-align: center !important;
              position: relative;
              overflow: hidden;
            }
            
            .print-header::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
              animation: shimmer 3s ease-in-out infinite;
            }
            
            @keyframes shimmer {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(180deg); }
            }
            
            .print-logo {
              width: 80px !important;
              height: 80px !important;
              background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%) !important;
              border-radius: 20px !important;
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
              margin-bottom: 20px !important;
              box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4) !important;
              position: relative;
              z-index: 2;
            }
            
            .print-logo i {
              font-size: 32px;
              color: white;
            }
            
            .print-title {
              font-size: 36px !important;
              font-weight: 800 !important;
              margin: 0 0 10px 0 !important;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
              position: relative;
              z-index: 2;
            }
            
            .print-subtitle {
              font-size: 20px !important;
              font-weight: 600 !important;
              opacity: 0.9 !important;
              margin: 0 0 10px 0 !important;
              position: relative;
              z-index: 2;
            }
            
            .bill-number {
              font-size: 16px !important;
              background: rgba(255, 255, 255, 0.2);
              padding: 8px 16px;
              border-radius: 20px;
              display: inline-block;
              margin-top: 10px;
              position: relative;
              z-index: 2;
            }
            
            .print-content {
              padding: 40px 30px !important;
            }
            
            .print-section {
              margin-bottom: 30px !important;
              padding: 25px !important;
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
              border-radius: 15px !important;
              border-left: 5px solid #3b82f6 !important;
              position: relative;
              overflow: hidden;
            }
            
            .print-section::before {
              content: '';
              position: absolute;
              top: 0;
              right: 0;
              width: 100px;
              height: 100px;
              background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
              border-radius: 50%;
              transform: translate(30px, -30px);
            }
            
            .print-section h3 {
              color: #1e40af !important;
              font-size: 22px !important;
              font-weight: 700 !important;
              margin: 0 0 20px 0 !important;
              display: flex !important;
              align-items: center !important;
              gap: 12px !important;
              position: relative;
              z-index: 2;
            }
            
            .print-section h3 i {
              font-size: 20px;
              color: #3b82f6;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              position: relative;
              z-index: 2;
            }
            
            .info-item {
              display: flex;
              flex-direction: column;
              gap: 5px;
            }
            
            .info-label {
              font-size: 14px;
              font-weight: 600;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .info-value {
              font-size: 16px;
              font-weight: 700;
              color: #1e293b;
            }
            
            .print-table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin: 25px 0 !important;
              background: white !important;
              border-radius: 15px !important;
              overflow: hidden !important;
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
            }
            
            .print-table th {
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
              color: white !important;
              padding: 18px 15px !important;
              text-align: left !important;
              font-weight: 700 !important;
              font-size: 15px !important;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .print-table td {
              padding: 15px !important;
              border-bottom: 1px solid #e2e8f0 !important;
              font-size: 15px !important;
              color: #334155 !important;
              font-weight: 500;
            }
            
            .print-table tr:nth-child(even) td {
              background: #f8fafc !important;
            }
            
            .print-table tr:hover td {
              background: #e0f2fe !important;
            }
            
            .print-total {
              background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%) !important;
              color: white !important;
              padding: 30px !important;
              border-radius: 20px !important;
              text-align: center !important;
              margin: 30px 0 !important;
              box-shadow: 0 12px 30px rgba(30, 64, 175, 0.4) !important;
              position: relative;
              overflow: hidden;
            }
            
            .print-total::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
              animation: pulse 2s ease-in-out infinite;
            }
            
            @keyframes pulse {
              0%, 100% { opacity: 0.5; }
              50% { opacity: 1; }
            }
            
            .total-label {
              font-size: 18px !important;
              font-weight: 600 !important;
              margin-bottom: 10px !important;
              position: relative;
              z-index: 2;
            }
            
            .total-amount {
              font-size: 36px !important;
              font-weight: 900 !important;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
              position: relative;
              z-index: 2;
            }
            
            .print-footer {
              text-align: center !important;
              margin-top: 40px !important;
              padding: 25px !important;
              background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%) !important;
              border-radius: 15px !important;
              border: 2px dashed #3b82f6 !important;
              position: relative;
            }
            
            .print-footer::before {
              content: '✨';
              position: absolute;
              top: 10px;
              left: 20px;
              font-size: 20px;
            }
            
            .print-footer::after {
              content: '✨';
              position: absolute;
              top: 10px;
              right: 20px;
              font-size: 20px;
            }
            
            .print-footer p {
              color: #1e40af !important;
              font-weight: 700 !important;
              font-size: 18px !important;
              margin: 0 !important;
            }
            
            .print-date {
              position: absolute;
              top: 20px;
              right: 30px;
              background: rgba(255, 255, 255, 0.2);
              padding: 8px 12px;
              border-radius: 10px;
              font-size: 14px;
              font-weight: 600;
              z-index: 2;
            }
            
            @media print {
              body { margin: 0 !important; padding: 10px !important; }
              .print-container { box-shadow: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="print-header">
              <div class="print-date">${formatDisplayDate(new Date())}</div>
              <div class="print-logo">
                <i class="fas fa-hotel"></i>
              </div>
              <h1 class="print-title">Vila POS System</h1>
              <h2 class="print-subtitle">Premium Hotel Management</h2>
              <div class="bill-number">Bill #${bill.bill_number}</div>
            </div>
            
            <div class="print-content">
              <div class="print-section">
                <h3><i class="fas fa-user"></i> Customer Information</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Customer Name</span>
                    <span class="info-value">${bill.customer_name}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Phone Number</span>
                    <span class="info-value">${bill.customer_phone || 'Not provided'}</span>
                  </div>
                  <div class="info-item" style="grid-column: 1 / -1;">
                    <span class="info-label">Address</span>
                    <span class="info-value">${bill.customer_address || 'Not provided'}</span>
                  </div>
                </div>
              </div>
              
              <div class="print-section">
                <h3><i class="fas fa-bed"></i> Booking Details</h3>
                <table class="print-table">
                  <thead>
                    <tr>
                      <th><i class="fas fa-door-open"></i> Room</th>
                      <th><i class="fas fa-calendar-check"></i> Check-in</th>
                      <th><i class="fas fa-calendar-times"></i> Check-out</th>
                      <th><i class="fas fa-clock"></i> Days</th>
                      <th><i class="fas fa-tag"></i> Rate/Day</th>
                      <th><i class="fas fa-calculator"></i> Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>${bill.room_number || 'N/A'}</strong><br><small>${bill.room_type === 'ac' ? 'AC Room' : 'Non-AC Room'}</small></td>
                      <td>${formatDisplayDate(bill.check_in_date)}</td>
                      <td>${formatDisplayDate(bill.check_out_date)}</td>
                      <td><strong>${bill.days}</strong></td>
                      <td><strong>${formatCurrency(bill.price_per_day)}</strong></td>
                      <td><strong>${formatCurrency(bill.total_amount)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div class="print-total">
                <div class="total-label">Total Amount</div>
                <div class="total-amount">${formatCurrency(bill.total_amount)}</div>
              </div>
              
              <div class="print-footer">
                <p>Thank you for choosing Vila POS System!</p>
                <p style="font-size: 14px; margin-top: 10px; font-weight: 500;">We appreciate your business and hope you enjoyed your stay.</p>
              </div>
            </div>
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
      <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-start sm:gap-3">
        <div className="flex items-center gap-3">
          <Receipt className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-white sm:text-2xl">My Bills</h1>
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
              <div className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-1 lg:gap-2">
                <div>
                  <span className="text-slate-400">Name:</span>
                  <span className="ml-2 text-white font-medium">{selectedBill.customer_name}</span>
                </div>
                <div>
                  <span className="text-slate-400">Phone:</span>
                  <span className="ml-2 text-white">{selectedBill.customer_phone || 'N/A'}</span>
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <span className="text-slate-400">Address:</span>
                  <span className="ml-2 text-white">{selectedBill.customer_address || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Booking Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-1 lg:gap-2">
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
            <div className="flex flex-row gap-3 pt-4 lg:flex-col">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="btn-secondary w-auto order-2 lg:w-full lg:order-1"
              >
                Close
              </button>
              <button
                onClick={() => handlePrintBill(selectedBill)}
                className="btn-primary w-auto order-1 flex items-center justify-center gap-2 lg:w-full lg:order-2"
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