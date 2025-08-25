'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, Crown, CreditCard } from 'lucide-react'

interface UpgradeButtonProps {
  planId: string
  price: number
  currency: string
  className?: string
  children?: React.ReactNode
}

export default function UpgradeButton({ 
  planId, 
  price, 
  currency, 
  className = '',
  children 
}: UpgradeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleUpgrade = async () => {
    if (!session?.user) {
      router.push('/auth/login?redirect=/pricing')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 503) {
          alert('💳 Zahlungssystem wird noch konfiguriert.\n\nIn der Production-Version können Sie hier direkt upgraden!')
        } else {
          throw new Error(data.error || 'Failed to create checkout session')
        }
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      alert('Fehler beim Upgrade. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price)
  }

  if (planId === 'free') {
    return (
      <button 
        disabled 
        className={`bg-gray-100 text-gray-500 cursor-not-allowed ${className}`}
      >
        Aktueller Plan
      </button>
    )
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={isLoading}
      className={`
        relative overflow-hidden group
        bg-gradient-to-r from-purple-600 to-pink-600 
        hover:from-purple-700 hover:to-pink-700
        text-white font-semibold 
        rounded-lg transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        transform hover:scale-105 active:scale-95
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      
      <div className="relative flex items-center justify-center gap-2 px-6 py-3">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Verarbeitung...
          </>
        ) : (
          <>
            <Crown className="w-4 h-4" />
            {children || (
              <>
                Upgrade für {formatPrice(price, currency)}/Monat
                <CreditCard className="w-4 h-4 ml-1" />
              </>
            )}
          </>
        )}
      </div>
    </button>
  )
}

// Quick upgrade component for dashboard
export function QuickUpgradeCard() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 text-center">
      <div className="mb-4">
        <Crown className="w-12 h-12 text-purple-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-gray-900">Upgrade auf Premium</h3>
        <p className="text-sm text-gray-600 mt-1">
          Keine Werbung, unbegrenzte Fotos und mehr Features
        </p>
      </div>
      
      <div className="space-y-2 text-sm text-gray-700 mb-4">
        <div className="flex items-center justify-center gap-2">
          ✓ Unbegrenzte Foto-Uploads
        </div>
        <div className="flex items-center justify-center gap-2">
          ✓ Keine Werbeanzeigen
        </div>
        <div className="flex items-center justify-center gap-2">
          ✓ Premium-Designs
        </div>
      </div>
      
      <UpgradeButton 
        planId="premium" 
        price={5} 
        currency="EUR"
        className="w-full"
      >
        Jetzt upgraden
      </UpgradeButton>
    </div>
  )
}

// Subscription management button
export function ManageSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleManageSubscription = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Portal error:', error)
      alert('Fehler beim Öffnen der Abonnement-Verwaltung.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleManageSubscription}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <CreditCard className="w-4 h-4" />
      )}
      Abonnement verwalten
    </button>
  )
}
