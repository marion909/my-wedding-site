'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SubscriptionInfo {
  status: 'free' | 'premium' | 'cancelled'
  currentPeriodEnd?: string
  cancelAtPeriodEnd?: boolean
  limits: {
    maxPhotos: number
    hasAds: boolean
    hasAnalytics: boolean
    hasPrioritySupport: boolean
  }
}

interface Props {
  subscription: SubscriptionInfo
  photoCount: number
}

export default function SubscriptionCard({ subscription, photoCount }: Props) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const isPremium = subscription.status === 'premium'
  const isNearPhotoLimit = !isPremium && subscription.limits.maxPhotos > 0 && 
                          photoCount >= subscription.limits.maxPhotos * 0.8

  return (
    <>
      <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
        isPremium ? 'border-l-purple-500' : 'border-l-gray-300'
      }`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isPremium ? '⭐ Premium Plan' : '🆓 Kostenloser Plan'}
            </h3>
            <p className="text-gray-600">
              {isPremium ? 'Werbefrei und unbegrenzt' : 'Mit kleinen Werbebannern'}
            </p>
          </div>
          
          {!isPremium && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
            >
              Upgraden
            </button>
          )}
        </div>

        {/* Current Usage */}
        <div className="space-y-3">
          {/* Photos */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Fotos hochgeladen:</span>
            <span className={`text-sm font-medium ${isNearPhotoLimit ? 'text-orange-600' : 'text-gray-900'}`}>
              {photoCount} / {subscription.limits.maxPhotos === -1 ? '∞' : subscription.limits.maxPhotos}
            </span>
          </div>

          {/* Progress Bar for Photos */}
          {!isPremium && subscription.limits.maxPhotos > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isNearPhotoLimit ? 'bg-orange-500' : 'bg-green-500'
                }`}
                style={{ 
                  width: `${Math.min((photoCount / subscription.limits.maxPhotos) * 100, 100)}%` 
                }}
              />
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="flex items-center text-sm">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                subscription.limits.hasAds ? 'bg-orange-400' : 'bg-green-400'
              }`} />
              {subscription.limits.hasAds ? 'Mit Werbung' : 'Werbefrei'}
            </div>
            
            <div className="flex items-center text-sm">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                subscription.limits.hasAnalytics ? 'bg-green-400' : 'bg-gray-400'
              }`} />
              {subscription.limits.hasAnalytics ? 'Analytics' : 'Basis Stats'}
            </div>
          </div>
        </div>

        {/* Premium Period Info */}
        {isPremium && subscription.currentPeriodEnd && (
          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700">
              {subscription.cancelAtPeriodEnd 
                ? `Plan läuft ab am ${new Date(subscription.currentPeriodEnd).toLocaleDateString('de-DE')}`
                : `Nächste Abrechnung: ${new Date(subscription.currentPeriodEnd).toLocaleDateString('de-DE')}`
              }
            </p>
          </div>
        )}

        {/* Warning when near limits */}
        {isNearPhotoLimit && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-700">
              ⚠️ Du erreichst bald dein Foto-Limit. 
              <button 
                onClick={() => setShowUpgradeModal(true)}
                className="text-purple-600 hover:text-purple-800 underline ml-1"
              >
                Jetzt upgraden
              </button>
              für unbegrenzte Fotos.
            </p>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Auf Premium upgraden?
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="text-gray-700">Keine Werbung</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="text-gray-700">Unbegrenzte Fotos</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="text-gray-700">Priority Support</span>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-purple-600">5€/Monat</div>
              <p className="text-gray-600">Jederzeit kündbar</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <Link 
                href="/pricing"
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-center"
              >
                Upgraden
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
