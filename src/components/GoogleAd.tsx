'use client'

import { useEffect, useRef } from 'react'

// Extend Window interface for Google Ads
declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

interface GoogleAdProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
}

export default function GoogleAd({ adSlot, adFormat = 'auto', className = '' }: GoogleAdProps) {
  const adRef = useRef<HTMLModElement>(null)
  const isLoaded = useRef(false)

  useEffect(() => {
    // Don't load ads in development
    if (process.env.NODE_ENV === 'development') {
      return
    }

    // Prevent duplicate loading
    if (isLoaded.current) {
      return
    }

    try {
      // Load Google Ads script if not already loaded
      if (!window.adsbygoogle) {
        const script = document.createElement('script')
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID'
        script.async = true
        script.crossOrigin = 'anonymous'
        document.head.appendChild(script)
        
        window.adsbygoogle = []
      }
      
      // Only push if the element exists and hasn't been processed
      if (adRef.current && !adRef.current.dataset.adsbygoogleStatus) {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        isLoaded.current = true
        if (adRef.current) {
          adRef.current.dataset.adsbygoogleStatus = 'filled'
        }
      }
    } catch (error) {
      console.error('Google Ads error:', error)
    }
  }, [adSlot])

  // Don't show ads in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center ${className}`}>
        <div className="text-gray-500 text-sm">
          📺 Google Ads Banner<br />
          <span className="text-xs">(Slot: {adSlot} - Nur in Production sichtbar)</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`text-center ${className}`}>
      <ins 
        ref={adRef}
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

// Banner für verschiedene Positionen
export function HeaderAd() {
  return (
    <GoogleAd 
      adSlot="1234567890"
      adFormat="horizontal"
      className="mb-4"
    />
  )
}

export function SidebarAd() {
  return (
    <GoogleAd 
      adSlot="0987654321"
      adFormat="rectangle"
      className="mb-6"
    />
  )
}

export function FooterAd() {
  return (
    <GoogleAd 
      adSlot="1122334455"
      adFormat="horizontal"
      className="mt-4"
    />
  )
}

// Utility to check if user has premium plan
export function useIsPremium() {
  // This would check the user's subscription status
  // For now, return false (all users see ads)
  return false
}
