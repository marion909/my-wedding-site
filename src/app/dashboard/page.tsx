'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { QuickUpgradeCard, ManageSubscriptionButton } from '@/components/UpgradeButton'
import DeveloperNotice from '@/components/DeveloperNotice'

interface Wedding {
  id: string
  slug: string
  brideName: string
  groomName: string
  weddingDate: string
  location: string
  isPublished: boolean
  template: {
    name: string
  }
}

interface DashboardStats {
  totalRsvps: number
  attendingGuests: number
  totalGuests: number
  photosCount: number
  pageViews: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/login')
      return
    }

    // Hochzeit des Users laden
    fetchWedding()
  }, [session, status, router])

  const fetchWedding = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setWedding(data.wedding)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching wedding:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lädt...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-purple-800">
            💕 My Wedding Site
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Hallo, {session.user?.name || session.user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Abmelden
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Dein Dashboard
          </h1>

          {!wedding ? (
            // Noch keine Hochzeit erstellt
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-6xl mb-4">💒</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Willkommen bei My Wedding Site!
              </h2>
              <p className="text-gray-600 mb-6">
                Du hast noch keine Hochzeitswebsite erstellt. 
                Lass uns gemeinsam eure perfekte Seite gestalten!
              </p>
              <Link
                href="/dashboard/create"
                className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Hochzeitswebsite erstellen
              </Link>
            </div>
          ) : (
            // Hochzeit existiert bereits
            <div className="space-y-6">
              {/* Hochzeits-Übersicht */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                      {wedding.brideName} & {wedding.groomName}
                    </h2>
                    <p className="text-gray-600">
                      {new Date(wedding.weddingDate).toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Template: {wedding.template.name}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {wedding.isPublished ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        ✓ Veröffentlicht
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        ⏳ Entwurf
                      </span>
                    )}
                  </div>
                </div>

                {wedding.isPublished && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2">Eure Hochzeitswebsite ist live unter:</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-3 py-1 rounded border text-purple-600 font-mono">
                        www.my-wedding-site.com/{wedding.slug}
                      </code>
                      <button
                        onClick={() => window.open(`/${wedding.slug}`, '_blank')}
                        className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                      >
                        Öffnen
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Link
                    href="/dashboard/edit"
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Bearbeiten
                  </Link>
                  
                  {!wedding.isPublished ? (
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(`/api/wedding/${wedding.id}`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ 
                              ...wedding, 
                              isPublished: true 
                            }),
                          })

                          if (response.ok) {
                            window.location.reload()
                          } else {
                            alert('Fehler beim Veröffentlichen')
                          }
                        } catch (error) {
                          alert('Ein Fehler ist aufgetreten')
                        }
                      }}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      🚀 Jetzt veröffentlichen
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        if (confirm('Möchtest du die Hochzeitsseite wirklich als Entwurf zurücksetzen?')) {
                          try {
                            const response = await fetch(`/api/wedding/${wedding.id}`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ 
                                ...wedding, 
                                isPublished: false 
                              }),
                            })

                            if (response.ok) {
                              window.location.reload()
                            } else {
                              alert('Fehler beim Zurücksetzen')
                            }
                          } catch (error) {
                            alert('Ein Fehler ist aufgetreten')
                          }
                        }
                      }}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      📝 Als Entwurf speichern
                    </button>
                  )}
                  
                  <Link
                    href="/dashboard/rsvp"
                    className="px-6 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    RSVP verwalten
                  </Link>
                  <Link
                    href="/dashboard/photos"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Fotos verwalten
                  </Link>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Gefahrenzone</h3>
                <p className="text-sm text-red-700 mb-4">
                  Das Löschen der Hochzeit kann nicht rückgängig gemacht werden. Alle Daten, Fotos und RSVPs werden unwiderruflich gelöscht.
                </p>
                <button
                  onClick={async () => {
                    const confirmMessage = `Möchtest du diese Hochzeit wirklich löschen?\n\n${wedding.brideName} & ${wedding.groomName}\n\nDiese Aktion kann NICHT rückgängig gemacht werden!`
                    
                    if (confirm(confirmMessage)) {
                      const finalConfirm = prompt('Gib "LÖSCHEN" ein um die Hochzeit endgültig zu löschen:')
                      
                      if (finalConfirm === 'LÖSCHEN') {
                        try {
                          const response = await fetch(`/api/wedding/${wedding.id}`, {
                            method: 'DELETE',
                            headers: {
                              'Content-Type': 'application/json',
                            }
                          })

                          const data = await response.json()

                          if (response.ok) {
                            alert('✅ Hochzeit erfolgreich gelöscht!')
                            window.location.href = '/dashboard/create'
                          } else {
                            alert('❌ Fehler beim Löschen: ' + (data.error || 'Unbekannter Fehler'))
                          }
                        } catch (error) {
                          alert('❌ Ein Fehler ist aufgetreten beim Löschen')
                          console.error('Delete error:', error)
                        }
                      } else {
                        alert('Löschen abgebrochen - Eingabe war nicht korrekt')
                      }
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                >
                  🗑️ Hochzeit löschen
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {stats?.totalRsvps || 0}
                  </div>
                  <p className="text-gray-600">RSVP Antworten</p>
                  {stats && stats.attendingGuests > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      {stats.attendingGuests} Zusagen
                    </p>
                  )}
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stats?.photosCount || 0}
                  </div>
                  <p className="text-gray-600">Fotos hochgeladen</p>
                  {stats && stats.photosCount === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Noch keine Fotos
                    </p>
                  )}
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {stats?.totalGuests || 0}
                  </div>
                  <p className="text-gray-600">Bestätigte Gäste</p>
                  {stats && stats.totalGuests > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      Kommen zur Feier
                    </p>
                  )}
                </div>
                
                {/* Premium Upgrade Card */}
                <QuickUpgradeCard />
              </div>
              
              {/* Subscription Management for Premium Users */}
              {/* TODO: Check if user has premium subscription */}
              <div className="hidden mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900">Premium Abonnement</h3>
                    <p className="text-sm text-purple-700">Aktiv bis: 15. Januar 2025</p>
                  </div>
                  <ManageSubscriptionButton />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Developer Notice for Development Mode */}
      {process.env.NODE_ENV === 'development' && <DeveloperNotice />}
    </div>
  )
}
