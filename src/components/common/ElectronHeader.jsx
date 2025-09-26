import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Monitor, Download, Info, Wifi, WifiOff } from 'lucide-react'
import { isElectron, getAppVersion, checkForUpdates } from '../../utils/electronUtils'

export const ElectronHeader = () => {
  const [version, setVersion] = useState('2.0.0')
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [hasUpdate, setHasUpdate] = useState(false)

  useEffect(() => {
    if (isElectron()) {
      getAppVersion().then(setVersion)
      checkForUpdates().then(result => setHasUpdate(result.hasUpdate))
    }

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isElectron()) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 px-4 py-2 flex items-center justify-between text-sm"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-blue-400">
          <Monitor className="w-4 h-4" />
          <span className="font-medium">Desktop App</span>
        </div>
        
        <div className="flex items-center gap-2 text-slate-400">
          <Info className="w-4 h-4" />
          <span>v{version}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span className="text-xs">{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        {hasUpdate && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 text-yellow-400 cursor-pointer hover:text-yellow-300"
            onClick={() => checkForUpdates()}
          >
            <Download className="w-4 h-4" />
            <span className="text-xs">Update Available</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}