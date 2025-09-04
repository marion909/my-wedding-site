'use client'

import React from 'react'
import { useNetworkManager } from '@/hooks/useNetworkManager'
import { Wifi, WifiOff, AlertTriangle, Signal } from 'lucide-react'

export interface NetworkStatusIndicatorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline'
  showDetails?: boolean
  showOnlyOffline?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Network Status Indicator Component
 * 
 * Displays the current network status with visual indicators
 */
export function NetworkStatusIndicator({
  position = 'top-right',
  showDetails = false,
  showOnlyOffline = false,
  className = '',
  size = 'md'
}: NetworkStatusIndicatorProps) {
  const { isOnline, connectionQuality, connectionSpeed, status } = useNetworkManager()

  // If showOnlyOffline is true and we're online, don't render anything
  if (showOnlyOffline && isOnline) {
    return null
  }

  const getPositionClasses = () => {
    if (position === 'inline') return ''
    
    const baseClasses = 'fixed z-50'
    switch (position) {
      case 'top-left':
        return `${baseClasses} top-4 left-4`
      case 'top-right':
        return `${baseClasses} top-4 right-4`
      case 'bottom-left':
        return `${baseClasses} bottom-4 left-4`
      case 'bottom-right':
        return `${baseClasses} bottom-4 right-4`
      default:
        return `${baseClasses} top-4 right-4`
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4'
      case 'md':
        return 'w-5 h-5'
      case 'lg':
        return 'w-6 h-6'
      default:
        return 'w-5 h-5'
    }
  }

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-500'
    
    switch (connectionQuality) {
      case 'excellent':
        return 'text-green-500'
      case 'good':
        return 'text-green-400'
      case 'fair':
        return 'text-yellow-500'
      case 'poor':
        return 'text-red-400'
      default:
        return 'text-gray-500'
    }
  }

  const getIcon = () => {
    const iconClasses = `${getSizeClasses()} ${getStatusColor()}`
    
    if (!isOnline) {
      return <WifiOff className={iconClasses} />
    }
    
    switch (connectionQuality) {
      case 'excellent':
      case 'good':
        return <Wifi className={iconClasses} />
      case 'fair':
        return <Signal className={iconClasses} />
      case 'poor':
        return <AlertTriangle className={iconClasses} />
      default:
        return <Wifi className={iconClasses} />
    }
  }

  const getStatusText = () => {
    if (!isOnline) return 'Offline'
    return `Online (${connectionSpeed})`
  }

  const getDetailedInfo = () => {
    if (!showDetails) return null
    
    return (
      <div className="text-xs text-gray-600 mt-1">
        <div>Quality: {connectionQuality}</div>
        {status.effectiveType && <div>Type: {status.effectiveType}</div>}
        {status.downlink && <div>Speed: {status.downlink.toFixed(1)} Mbps</div>}
        {status.lastOffline && !isOnline && (
          <div>Offline since: {status.lastOffline.toLocaleTimeString()}</div>
        )}
      </div>
    )
  }

  const containerClasses = `
    ${getPositionClasses()}
    ${className}
    ${showDetails ? 'p-3' : 'p-2'}
    ${isOnline ? 'bg-white border border-gray-200' : 'bg-red-50 border border-red-200'}
    rounded-lg shadow-sm
    ${showDetails ? 'min-w-32' : ''}
  `.trim()

  return (
    <div className={containerClasses}>
      <div className="flex items-center space-x-2">
        {getIcon()}
        {showDetails && (
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        )}
      </div>
      {getDetailedInfo()}
    </div>
  )
}

/**
 * Simple offline banner component
 */
export function OfflineBanner() {
  const { isOnline } = useNetworkManager()

  if (isOnline) return null

  return (
    <div className="bg-red-500 text-white px-4 py-2 text-center text-sm font-medium">
      <div className="flex items-center justify-center space-x-2">
        <WifiOff className="w-4 h-4" />
        <span>Du bist offline. Einige Funktionen sind möglicherweise nicht verfügbar.</span>
      </div>
    </div>
  )
}

/**
 * Network status badge for forms
 */
export function NetworkStatusBadge() {
  const { isOnline, connectionQuality } = useNetworkManager()

  const getBadgeColor = () => {
    if (!isOnline) return 'bg-red-100 text-red-800 border-red-200'
    
    switch (connectionQuality) {
      case 'excellent':
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${getBadgeColor()}
    `}>
      {isOnline ? 'Online' : 'Offline'}
    </span>
  )
}