'use client'

import { useEffect } from 'react'

// Simple Ad Manager to prevent duplicate ads
class AdManager {
  private static loadedSlots = new Set<string>()
  private static scriptLoaded = false

  static async loadScript() {
    if (this.scriptLoaded || process.env.NODE_ENV === 'development') {
      return
    }

    try {
      if (!window.adsbygoogle) {
        const script = document.createElement('script')
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID'
        script.async = true
        script.crossOrigin = 'anonymous'
        document.head.appendChild(script)
        
        window.adsbygoogle = []
        this.scriptLoaded = true
      }
    } catch (error) {
      console.error('Google Ads script loading error:', error)
    }
  }

  static async loadAd(slotId: string) {
    if (process.env.NODE_ENV === 'development') {
      return
    }

    if (this.loadedSlots.has(slotId)) {
      console.warn(`Ad slot ${slotId} already loaded`)
      return
    }

    try {
      await this.loadScript()
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      this.loadedSlots.add(slotId)
    } catch (error) {
      console.error(`Error loading ad for slot ${slotId}:`, error)
    }
  }

  static reset() {
    this.loadedSlots.clear()
  }
}

interface SmartAdProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
  uniqueKey?: string // Add unique key to prevent conflicts
}

export default function SmartAd({ adSlot, adFormat = 'auto', className = '', uniqueKey }: SmartAdProps) {
  const slotId = uniqueKey || `${adSlot}-${Math.random().toString(36).substr(2, 9)}`

  useEffect(() => {
    const timer = setTimeout(() => {
      AdManager.loadAd(slotId)
    }, 100) // Small delay to ensure DOM is ready

    return () => clearTimeout(timer)
  }, [slotId])

  // Development mode placeholder
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-lg p-6 text-center ${className}`}>
        <div className="text-blue-600 text-sm font-medium">
          📺 Google Ads Placeholder<br />
          <span className="text-xs opacity-75">Slot: {adSlot} | Format: {adFormat}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`text-center ${className}`}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// Pre-configured ad components
export function WeddingHeaderAd() {
  return (
    <SmartAd 
      adSlot="1234567890"
      adFormat="horizontal"
      className="mb-6"
      uniqueKey="wedding-header"
    />
  )
}

export function WeddingFooterAd() {
  return (
    <SmartAd 
      adSlot="1122334455"
      adFormat="horizontal"
      className="mt-6"
      uniqueKey="wedding-footer"
    />
  )
}

export function WeddingSectionAd({ sectionName }: { sectionName: string }) {
  return (
    <SmartAd 
      adSlot="2222222222"
      adFormat="rectangle"
      className="my-8"
      uniqueKey={`wedding-section-${sectionName}`}
    />
  )
}

// Reset function for page changes
export function resetAds() {
  AdManager.reset()
}
