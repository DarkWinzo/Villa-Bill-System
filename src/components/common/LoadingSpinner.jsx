import React from 'react'
import { cn } from '../../utils/cn'

export const LoadingSpinner = ({ 
  size = 'md', 
  className = '', 
  color = 'primary' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'border-primary-500',
    white: 'border-white',
    slate: 'border-slate-400'
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-transparent border-t-current',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export const LoadingOverlay = ({ isLoading, children, message = 'Loading...' }) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-dark-900/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <div className="bg-dark-800 rounded-lg p-6 flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-slate-300 font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export const LoadingCard = ({ className = '' }) => {
  return (
    <div className={cn('card animate-pulse', className)}>
      <div className="space-y-4">
        <div className="h-4 bg-dark-700 rounded w-3/4"></div>
        <div className="h-4 bg-dark-700 rounded w-1/2"></div>
        <div className="h-4 bg-dark-700 rounded w-5/6"></div>
      </div>
    </div>
  )
}

export const LoadingTable = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 animate-pulse">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-dark-700 rounded flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  )
}