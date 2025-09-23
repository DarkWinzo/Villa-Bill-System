
// Date formatting utilities
export const formatDate = (date, formatString = 'yyyy-MM-dd') => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return ''
    
    // Simple date formatting without date-fns
    if (formatString === 'yyyy-MM-dd') {
      return dateObj.toISOString().split('T')[0]
    } else if (formatString === 'MMM dd, yyyy') {
      return dateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      })
    } else if (formatString === 'MMM dd, yyyy HH:mm') {
      return dateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    return dateObj.toLocaleDateString()
  } catch (error) {
    console.error('Date formatting error:', error)
    return ''
  }
}


export const formatDisplayDate = (date) => {
  return formatDate(date, 'MMM dd, yyyy')
}


// Date calculation utilities
export const calculateDays = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0
  
  try {
    const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn
    const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut
    
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) return 0
    
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return Math.max(days, 1) // Minimum 1 day
  } catch (error) {
    console.error('Date calculation error:', error)
    return 0
  }
}

// Date validation utilities
export const isValidDate = (date) => {
  if (!date) return false
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return !isNaN(dateObj.getTime())
  } catch (error) {
    return false
  }
}

export const isFutureDate = (date) => {
  if (!isValidDate(date)) return false
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return dateObj >= today
}

export const isPastDate = (date) => {
  if (!isValidDate(date)) return false
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  
  return dateObj < today
}

// Date range utilities
export const getDateRange = (startDate, endDate) => {
  const dates = []
  let currentDate = new Date(startDate)
  const end = new Date(endDate)
  
  while (currentDate <= end) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return dates
}

export const getTodayRange = () => {
  const today = new Date()
  return {
    start: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)
  }
}

export const getThisMonthRange = () => {
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), 1)
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  
  return {
    start: new Date(start.getFullYear(), start.getMonth(), start.getDate()),
    end: new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999)
  }
}