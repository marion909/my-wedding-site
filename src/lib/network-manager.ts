'use client'

/**
 * Network Manager - Comprehensive Network Connectivity and Management
 * 
 * This module provides network monitoring, connection management, and
 * offline/online state handling for the wedding site application.
 */

export interface NetworkStatus {
  isOnline: boolean
  connectionType: string | null
  downlink: number | null
  effectiveType: string | null
  lastOnline: Date | null
  lastOffline: Date | null
}

export interface NetworkManagerOptions {
  pingUrl?: string
  pingInterval?: number
  retryAttempts?: number
  retryDelay?: number
  onlineCallback?: (status: NetworkStatus) => void
  offlineCallback?: (status: NetworkStatus) => void
  statusChangeCallback?: (status: NetworkStatus) => void
}

export class NetworkManager {
  private status: NetworkStatus
  private options: Required<NetworkManagerOptions>
  private pingIntervalId: NodeJS.Timeout | null = null
  private retryTimeoutId: NodeJS.Timeout | null = null
  private eventListeners: { [key: string]: EventListener } = {}

  constructor(options: NetworkManagerOptions = {}) {
    this.options = {
      pingUrl: '/api/health',
      pingInterval: 30000, // 30 seconds
      retryAttempts: 3,
      retryDelay: 2000, // 2 seconds
      onlineCallback: () => {},
      offlineCallback: () => {},
      statusChangeCallback: () => {},
      ...options
    }

    this.status = {
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      connectionType: null,
      downlink: null,
      effectiveType: null,
      lastOnline: new Date(),
      lastOffline: null
    }

    this.initializeListeners()
    this.updateConnectionInfo()
  }

  /**
   * Initialize event listeners for network status changes
   */
  private initializeListeners(): void {
    if (typeof window === 'undefined') return

    // Browser online/offline events
    this.eventListeners.online = () => this.handleOnline()
    this.eventListeners.offline = () => this.handleOffline()

    window.addEventListener('online', this.eventListeners.online)
    window.addEventListener('offline', this.eventListeners.offline)

    // Connection change events (if supported)
    if ('connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator) {
      const connection = (navigator as Navigator & {
        connection?: { addEventListener: (type: string, listener: EventListener) => void }
        mozConnection?: { addEventListener: (type: string, listener: EventListener) => void }
        webkitConnection?: { addEventListener: (type: string, listener: EventListener) => void }
      }).connection || (navigator as Navigator & {
        mozConnection?: { addEventListener: (type: string, listener: EventListener) => void }
      }).mozConnection || (navigator as Navigator & {
        webkitConnection?: { addEventListener: (type: string, listener: EventListener) => void }
      }).webkitConnection
      
      if (connection) {
        this.eventListeners.change = () => this.updateConnectionInfo()
        connection.addEventListener('change', this.eventListeners.change)
      }
    }

    // Visibility API - check connection when page becomes visible
    if (typeof document !== 'undefined') {
      this.eventListeners.visibilitychange = () => {
        if (document.visibilityState === 'visible') {
          this.checkConnection()
        }
      }
      document.addEventListener('visibilitychange', this.eventListeners.visibilitychange)
    }
  }

  /**
   * Update connection information from Network Information API
   */
  private updateConnectionInfo(): void {
    if (typeof navigator === 'undefined') return

    const connection = (navigator as Navigator & {
      connection?: {
        type?: string
        downlink?: number
        effectiveType?: string
      }
      mozConnection?: {
        type?: string
        downlink?: number
        effectiveType?: string
      }
      webkitConnection?: {
        type?: string
        downlink?: number
        effectiveType?: string
      }
    }).connection || (navigator as Navigator & {
      mozConnection?: {
        type?: string
        downlink?: number
        effectiveType?: string
      }
    }).mozConnection || (navigator as Navigator & {
      webkitConnection?: {
        type?: string
        downlink?: number
        effectiveType?: string
      }
    }).webkitConnection
    
    if (connection) {
      this.status.connectionType = connection.type || null
      this.status.downlink = connection.downlink || null
      this.status.effectiveType = connection.effectiveType || null
    }
  }

  /**
   * Handle online event
   */
  private handleOnline(): void {
    const wasOffline = !this.status.isOnline
    this.status.isOnline = true
    this.status.lastOnline = new Date()
    this.updateConnectionInfo()

    if (wasOffline) {
      this.options.onlineCallback(this.status)
      this.options.statusChangeCallback(this.status)
    }

    // Verify with actual ping
    this.checkConnection()
  }

  /**
   * Handle offline event
   */
  private handleOffline(): void {
    const wasOnline = this.status.isOnline
    this.status.isOnline = false
    this.status.lastOffline = new Date()

    if (wasOnline) {
      this.options.offlineCallback(this.status)
      this.options.statusChangeCallback(this.status)
    }
  }

  /**
   * Check network connectivity with actual HTTP request
   */
  public async checkConnection(retryCount = 0): Promise<boolean> {
    if (typeof fetch === 'undefined') return this.status.isOnline

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(this.options.pingUrl, {
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const isOnline = response.ok
      const wasOnline = this.status.isOnline

      this.status.isOnline = isOnline
      
      if (isOnline !== wasOnline) {
        if (isOnline) {
          this.status.lastOnline = new Date()
          this.options.onlineCallback(this.status)
        } else {
          this.status.lastOffline = new Date()
          this.options.offlineCallback(this.status)
        }
        this.options.statusChangeCallback(this.status)
      }

      return isOnline
    } catch (error) {
      // If we're still in retry attempts and it was a network error
      if (retryCount < this.options.retryAttempts && error instanceof Error) {
        return new Promise((resolve) => {
          this.retryTimeoutId = setTimeout(async () => {
            resolve(await this.checkConnection(retryCount + 1))
          }, this.options.retryDelay * (retryCount + 1)) // Exponential backoff
        })
      }

      // Mark as offline after all retries failed
      const wasOnline = this.status.isOnline
      this.status.isOnline = false
      
      if (wasOnline) {
        this.status.lastOffline = new Date()
        this.options.offlineCallback(this.status)
        this.options.statusChangeCallback(this.status)
      }

      return false
    }
  }

  /**
   * Start periodic network monitoring
   */
  public startMonitoring(): void {
    if (this.pingIntervalId) return // Already monitoring

    this.pingIntervalId = setInterval(() => {
      this.checkConnection()
    }, this.options.pingInterval)

    // Initial check
    this.checkConnection()
  }

  /**
   * Stop periodic network monitoring
   */
  public stopMonitoring(): void {
    if (this.pingIntervalId) {
      clearInterval(this.pingIntervalId)
      this.pingIntervalId = null
    }

    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
      this.retryTimeoutId = null
    }
  }

  /**
   * Get current network status
   */
  public getStatus(): NetworkStatus {
    return { ...this.status }
  }

  /**
   * Check if currently online
   */
  public isOnline(): boolean {
    return this.status.isOnline
  }

  /**
   * Get connection quality indicator
   */
  public getConnectionQuality(): 'excellent' | 'good' | 'fair' | 'poor' | 'unknown' {
    if (!this.status.isOnline) return 'poor'
    if (!this.status.effectiveType) return 'unknown'

    switch (this.status.effectiveType) {
      case '4g':
        return 'excellent'
      case '3g':
        return 'good'
      case '2g':
        return 'fair'
      case 'slow-2g':
        return 'poor'
      default:
        return 'unknown'
    }
  }

  /**
   * Get human-readable connection speed
   */
  public getConnectionSpeed(): string {
    if (!this.status.downlink) return 'Unknown'
    
    const mbps = this.status.downlink
    if (mbps >= 10) return 'Fast'
    if (mbps >= 1.5) return 'Good'
    if (mbps >= 0.5) return 'Slow'
    return 'Very Slow'
  }

  /**
   * Update callback functions
   */
  public updateCallbacks(callbacks: Partial<Pick<NetworkManagerOptions, 'onlineCallback' | 'offlineCallback' | 'statusChangeCallback'>>): void {
    if (callbacks.onlineCallback) this.options.onlineCallback = callbacks.onlineCallback
    if (callbacks.offlineCallback) this.options.offlineCallback = callbacks.offlineCallback
    if (callbacks.statusChangeCallback) this.options.statusChangeCallback = callbacks.statusChangeCallback
  }

  /**
   * Cleanup and remove all event listeners
   */
  public destroy(): void {
    this.stopMonitoring()

    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.eventListeners.online)
      window.removeEventListener('offline', this.eventListeners.offline)
    }

    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.eventListeners.visibilitychange)
    }

    // Remove connection event listener
    if ('connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator) {
      const connection = (navigator as Navigator & {
        connection?: { removeEventListener: (type: string, listener: EventListener) => void }
        mozConnection?: { removeEventListener: (type: string, listener: EventListener) => void }
        webkitConnection?: { removeEventListener: (type: string, listener: EventListener) => void }
      }).connection || (navigator as Navigator & {
        mozConnection?: { removeEventListener: (type: string, listener: EventListener) => void }
      }).mozConnection || (navigator as Navigator & {
        webkitConnection?: { removeEventListener: (type: string, listener: EventListener) => void }
      }).webkitConnection
      
      if (connection && this.eventListeners.change) {
        connection.removeEventListener('change', this.eventListeners.change)
      }
    }
  }
}

// Singleton instance
let networkManagerInstance: NetworkManager | null = null

/**
 * Get the global network manager instance
 */
export function getNetworkManager(options?: NetworkManagerOptions): NetworkManager {
  if (!networkManagerInstance) {
    networkManagerInstance = new NetworkManager(options)
  } else if (options) {
    // Update callbacks if new options are provided
    networkManagerInstance.updateCallbacks({
      onlineCallback: options.onlineCallback,
      offlineCallback: options.offlineCallback,
      statusChangeCallback: options.statusChangeCallback
    })
  }
  return networkManagerInstance
}

/**
 * Utility function to check if online with retries
 */
export async function checkNetworkConnectivity(retries = 3): Promise<boolean> {
  const manager = getNetworkManager()
  return manager.checkConnection(retries)
}

/**
 * Utility function to wait for network connection
 */
export function waitForConnection(maxWaitTime = 30000): Promise<boolean> {
  return new Promise((resolve) => {
    const manager = getNetworkManager()
    const startTime = Date.now()

    const checkConnection = () => {
      if (manager.isOnline()) {
        resolve(true)
        return
      }

      if (Date.now() - startTime > maxWaitTime) {
        resolve(false)
        return
      }

      setTimeout(checkConnection, 1000)
    }

    checkConnection()
  })
}