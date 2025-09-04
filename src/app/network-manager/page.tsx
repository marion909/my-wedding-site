'use client'

import React, { useState } from 'react'
import { useNetworkManager } from '@/hooks/useNetworkManager'
import { NetworkStatusIndicator, NetworkStatusBadge } from '@/components/NetworkStatusIndicator'
import { Wifi, WifiOff, RefreshCw, Settings, Monitor } from 'lucide-react'
import Link from 'next/link'

export default function NetworkManagerDemo() {
  const {
    status,
    isOnline,
    connectionQuality,
    connectionSpeed,
    checkConnection,
    startMonitoring,
    stopMonitoring
  } = useNetworkManager({
    pingInterval: 15000, // Check every 15 seconds for demo
    onlineCallback: (status) => {
      console.log('Network came online:', status)
    },
    offlineCallback: (status) => {
      console.log('Network went offline:', status)
    }
  })

  const [isChecking, setIsChecking] = useState(false)
  const [checkHistory, setCheckHistory] = useState<Array<{ time: string; result: boolean }>>([])

  const handleManualCheck = async () => {
    setIsChecking(true)
    try {
      const result = await checkConnection()
      setCheckHistory(prev => [{
        time: new Date().toLocaleTimeString(),
        result
      }, ...prev.slice(0, 9)]) // Keep last 10 results
    } finally {
      setIsChecking(false)
    }
  }

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-8 h-8 text-red-500" />
    
    switch (connectionQuality) {
      case 'excellent':
        return <Wifi className="w-8 h-8 text-green-500" />
      case 'good':
        return <Wifi className="w-8 h-8 text-green-400" />
      case 'fair':
        return <Wifi className="w-8 h-8 text-yellow-500" />
      case 'poor':
        return <Wifi className="w-8 h-8 text-red-400" />
      default:
        return <Wifi className="w-8 h-8 text-gray-500" />
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'text-green-600'
      case 'good':
        return 'text-green-500'
      case 'fair':
        return 'text-yellow-600'
      case 'poor':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-600 hover:text-purple-800 mb-4 inline-block">
            ← Zurück zur Startseite
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Network Manager Demo</h1>
          <p className="text-gray-600">
            Demonstriert die Netzwerküberwachung und -verwaltung für die Hochzeitswebsite
          </p>
        </div>

        {/* Main Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Netzwerkstatus</h2>
            <NetworkStatusBadge />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Overview */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon()}
                <div>
                  <div className="text-lg font-medium text-gray-900">
                    {isOnline ? 'Online' : 'Offline'}
                  </div>
                  <div className="text-sm text-gray-500">
                    Verbindungsstatus
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Qualität</div>
                  <div className={`font-medium ${getQualityColor(connectionQuality)}`}>
                    {connectionQuality}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Geschwindigkeit</div>
                  <div className="font-medium text-gray-900">
                    {connectionSpeed}
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Technische Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Verbindungstyp:</span>
                  <span className="text-gray-900">{status.connectionType || 'Unbekannt'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Effektiver Typ:</span>
                  <span className="text-gray-900">{status.effectiveType || 'Unbekannt'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Downlink:</span>
                  <span className="text-gray-900">
                    {status.downlink ? `${status.downlink.toFixed(1)} Mbps` : 'Unbekannt'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Zuletzt online:</span>
                  <span className="text-gray-900">
                    {status.lastOnline ? status.lastOnline.toLocaleTimeString() : 'Unbekannt'}
                  </span>
                </div>
                {status.lastOffline && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Zuletzt offline:</span>
                    <span className="text-gray-900">
                      {status.lastOffline.toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleManualCheck}
              disabled={isChecking}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Prüfe...' : 'Verbindung prüfen'}</span>
            </button>
            
            <button
              onClick={startMonitoring}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Monitor className="w-4 h-4" />
              <span>Überwachung starten</span>
            </button>
            
            <button
              onClick={stopMonitoring}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Settings className="w-4 h-4" />
              <span>Überwachung stoppen</span>
            </button>
          </div>
        </div>

        {/* Check History */}
        {checkHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Verbindungshistorie</h2>
            <div className="space-y-2">
              {checkHistory.map((check, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm text-gray-600">{check.time}</span>
                  <span className={`text-sm font-medium ${check.result ? 'text-green-600' : 'text-red-600'}`}>
                    {check.result ? 'Online' : 'Offline'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Network Status Indicators Demo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Status-Indikatoren Demo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Verschiedene Positionen</h3>
              <div className="space-y-3">
                <div className="relative bg-gray-100 p-4 rounded-lg">
                  <NetworkStatusIndicator position="inline" showDetails={true} />
                  <span className="text-sm text-gray-600 ml-4">Inline mit Details</span>
                </div>
                <div className="relative bg-gray-100 p-4 rounded-lg">
                  <NetworkStatusIndicator position="inline" showDetails={false} />
                  <span className="text-sm text-gray-600 ml-4">Inline einfach</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Status Badge</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <NetworkStatusBadge />
                  <span className="text-sm text-gray-600">Aktueller Status</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-medium text-blue-900 mb-2">Über den Network Manager</h3>
          <p className="text-blue-800 text-sm mb-4">
            Der Network Manager überwacht kontinuierlich die Netzwerkverbindung und stellt sicher, 
            dass Benutzer über Verbindungsprobleme informiert werden. Er nutzt die Network Information API 
            für detaillierte Verbindungsinformationen und führt regelmäßige Ping-Tests durch.
          </p>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Automatische Erkennung von Online/Offline-Status</li>
            <li>• Verbindungsqualität und Geschwindigkeitsmessung</li>
            <li>• Regelmäßige Gesundheitschecks über /api/health</li>
            <li>• Retry-Mechanismus bei Verbindungsfehlern</li>
            <li>• React Hooks für einfache Integration</li>
            <li>• Anpassbare UI-Komponenten</li>
          </ul>
        </div>
      </div>
    </div>
  )
}