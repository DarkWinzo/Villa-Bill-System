import toast from 'react-hot-toast'

// Error types
export const ERROR_TYPES = {
  VALIDATION: 'VALIDATION_ERROR',
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTH_ERROR',
  PERMISSION: 'PERMISSION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
}

// Custom error class
export class AppError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, details = null) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

// Error handler utility
export const handleError = (error, context = '') => {
  console.error(`Error in ${context}:`, error)
  
  let errorMessage = 'An unexpected error occurred'
  let errorType = ERROR_TYPES.UNKNOWN
  
  if (error instanceof AppError) {
    errorMessage = error.message
    errorType = error.type
  } else if (error.name === 'ValidationError') {
    errorMessage = error.message
    errorType = ERROR_TYPES.VALIDATION
  } else if (error.message) {
    errorMessage = error.message
  }
  
  // Log error for debugging
  logError(error, context)
  
  // Show user-friendly toast
  showErrorToast(errorMessage, errorType)
  
  return {
    message: errorMessage,
    type: errorType,
    originalError: error
  }
}

// Error logging
export const logError = (error, context = '') => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    context,
    message: error.message,
    stack: error.stack,
    type: error.type || ERROR_TYPES.UNKNOWN,
    details: error.details || null
  }
  
  // Store in localStorage for offline debugging
  try {
    const existingLogs = JSON.parse(localStorage.getItem('vila-pos-error-logs') || '[]')
    existingLogs.push(errorLog)
    
    // Keep only last 100 errors
    if (existingLogs.length > 100) {
      existingLogs.splice(0, existingLogs.length - 100)
    }
    
    localStorage.setItem('vila-pos-error-logs', JSON.stringify(existingLogs))
  } catch (logError) {
    console.error('Failed to log error:', logError)
  }
}

// Toast notifications for different error types
export const showErrorToast = (message, type = ERROR_TYPES.UNKNOWN) => {
  const toastOptions = {
    duration: 5000,
    style: {
      background: '#1e293b',
      color: '#f8fafc',
      border: '1px solid #ef4444',
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#f8fafc',
    },
  }
  
  switch (type) {
    case ERROR_TYPES.VALIDATION:
      toast.error(`Validation Error: ${message}`, toastOptions)
      break
    case ERROR_TYPES.AUTH:
      toast.error(`Authentication Error: ${message}`, toastOptions)
      break
    case ERROR_TYPES.PERMISSION:
      toast.error(`Permission Error: ${message}`, toastOptions)
      break
    case ERROR_TYPES.NOT_FOUND:
      toast.error(`Not Found: ${message}`, toastOptions)
      break
    default:
      toast.error(message, toastOptions)
  }
}

// Success toast helper
export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 3000,
    style: {
      background: '#1e293b',
      color: '#f8fafc',
      border: '1px solid #10b981',
    },
    iconTheme: {
      primary: '#10b981',
      secondary: '#f8fafc',
    },
  })
}

// Warning toast helper
export const showWarningToast = (message) => {
  toast.error(message, {
    duration: 4000,
    style: {
      background: '#1e293b',
      color: '#f8fafc',
      border: '1px solid #f59e0b',
    },
    iconTheme: {
      primary: '#f59e0b',
      secondary: '#f8fafc',
    },
  })
}

// Error boundary helper
export const withErrorBoundary = (Component, fallback = null) => {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = { hasError: false, error: null }
    }
    
    static getDerivedStateFromError(error) {
      return { hasError: true, error }
    }
    
    componentDidCatch(error, errorInfo) {
      logError(error, `ErrorBoundary: ${Component.name}`)
    }
    
    render() {
      if (this.state.hasError) {
        return fallback || (
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold text-red-400 mb-2">
              Something went wrong
            </h2>
            <p className="text-slate-400 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        )
      }
      
      return <Component {...this.props} />
    }
  }
}

// Async error handler wrapper
export const withAsyncErrorHandler = (asyncFn, context = '') => {
  return async (...args) => {
    try {
      return await asyncFn(...args)
    } catch (error) {
      handleError(error, context)
      throw error
    }
  }
}