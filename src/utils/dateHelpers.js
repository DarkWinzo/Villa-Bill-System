import { format, parseISO, differenceInDays, isValid, startOfDay, endOfDay } from 'date-fns'

// Date formatting utilities
export const formatDate = (date, formatString = 'yyyy-MM-dd') => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isValid(dateObj) ? format(dateObj, formatString) : ''
  } catch (error) {
    console.error('Date formatting error:', error)
    return ''
  }
}

export const formatDateTime = (date) => {
  return formatDate(date, 'yyyy-MM-dd HH:mm:ss')
}

export const formatDisplayDate = (date) => {
  return formatDate(date, 'MMM dd, yyyy')
}

export const formatDisplayDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy HH:mm')
}

// Date calculation utilities
export const calculateDays = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0
  
  try {
    const checkInDate = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn
    const checkOutDate = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut
    
    if (!isValid(checkInDate) || !isValid(checkOutDate)) return 0
    
    const days = differenceInDays(checkOutDate, checkInDate)
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
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return isValid(dateObj)
  } catch (error) {
    return false
  }
}

export const isFutureDate = (date) => {
  if (!isValidDate(date)) return false
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const today = startOfDay(new Date())
  
  return dateObj >= today
}

export const isPastDate = (date) => {
  if (!isValidDate(date)) return false
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const today = endOfDay(new Date())
  
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
    start: startOfDay(today),
    end: endOfDay(today)
  }
}

export const getThisMonthRange = () => {
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), 1)
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  
  return {
    start: startOfDay(start),
    end: endOfDay(end)
  }
}