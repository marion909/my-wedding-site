'use client'

import { useState } from 'react'
import { X, Info, ExternalLink } from 'lucide-react'

export default function DeveloperNotice() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-blue-50 border border-blue-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-blue-900 mb-1">
            🚀 Development Mode
          </h4>
          <p className="text-xs text-blue-800 mb-2">
            Stripe & Google Ads verwenden Entwicklungs-Fallbacks. 
            Für Production: echte API-Keys in .env konfigurieren.
          </p>
          <div className="flex gap-2">
            <a 
              href="https://dashboard.stripe.com/apikeys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              Stripe Keys <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://www.google.com/adsense/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              AdSense <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-blue-400 hover:text-blue-600 p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
