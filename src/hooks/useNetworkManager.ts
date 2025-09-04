'use client'

import { useState, useEffect, useRef } from 'react'
import { NetworkManager, NetworkStatus, NetworkManagerOptions, getNetworkManager } from '@/lib/network-manager'

export interface UseNetworkManagerReturn {
  status: NetworkStatus
  isOnline: boolean
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown'
  connectionSpeed: string
  checkConnection: () => Promise<boolean>
  startMonitoring: () => void
  stopMonitoring: () => void
}

/**
 * React hook for using the Network Manager
 * 
 * @param options - Configuration options for the network manager
 * @returns Network status and control functions
 */
export function useNetworkManager(options: NetworkManagerOptions = {}): UseNetworkManagerReturn {
  const managerRef = useRef<NetworkManager | null>(null)
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    connectionType: null,
    downlink: null,
    effectiveType: null,
    lastOnline: new Date(),
    lastOffline: null
  })

  useEffect(() => {
    // Initialize the network manager only once
    if (!managerRef.current) {
      const manager = getNetworkManager({
        pingInterval: options.pingInterval || 30000,
        retryAttempts: options.retryAttempts || 3,
        retryDelay: options.retryDelay || 2000,
        pingUrl: options.pingUrl || '/api/health',
        statusChangeCallback: (newStatus: NetworkStatus) => {
          setStatus(newStatus)
          options?.statusChangeCallback?.(newStatus)
        },
        onlineCallback: (newStatus: NetworkStatus) => {
          setStatus(newStatus)
          options?.onlineCallback?.(newStatus)
        },
        offlineCallback: (newStatus: NetworkStatus) => {
          setStatus(newStatus)
          options?.offlineCallback?.(newStatus)
        }
      })

      managerRef.current = manager
      setStatus(manager.getStatus())

      // Start monitoring by default
      manager.startMonitoring()
    }

    // Cleanup on unmount
    return () => {
      if (managerRef.current) {
        managerRef.current.stopMonitoring()
      }
    }
  }, []) // Empty dependency array to run only once

  return {
    status,
    isOnline: status.isOnline,
    connectionQuality: managerRef.current?.getConnectionQuality() || 'unknown',
    connectionSpeed: managerRef.current?.getConnectionSpeed() || 'Unknown',
    checkConnection: () => managerRef.current?.checkConnection() || Promise.resolve(false),
    startMonitoring: () => managerRef.current?.startMonitoring(),
    stopMonitoring: () => managerRef.current?.stopMonitoring()
  }
}

/**
 * Simple hook that just returns online/offline status
 */
export function useOnlineStatus(): boolean {
  const { isOnline } = useNetworkManager()
  return isOnline
}

/**
 * Hook that returns connection quality information
 */
export function useConnectionQuality() {
  const { connectionQuality, connectionSpeed, status } = useNetworkManager()
  
  return {
    quality: connectionQuality,
    speed: connectionSpeed,
    effectiveType: status.effectiveType,
    downlink: status.downlink
  }
}