'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SectionManager from './SectionManager'

interface Template {
  id: string
  name: string
  description: string
  previewImage: string
  cssFile: string
}

interface Wedding {
  id: string
  slug: string
  brideName: string
  groomName: string
  weddingDate: Date
  location: string
  story?: string | null
  time?: string | null
  dresscode?: string | null
  description?: string | null
  templateId: string
  template: Template
  isPublished: boolean
}

interface WeddingEditorProps {
  wedding: Wedding
}

export default function WeddingEditor({ wedding }: WeddingEditorProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'layout' | 'design' | 'settings'>('basic')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    brideName: wedding.brideName,
    groomName: wedding.groomName,
    weddingDate: wedding.weddingDate.toISOString().split('T')[0],
    location: wedding.location,
    time: wedding.time || '',
    dresscode: wedding.dresscode || '',
    story: wedding.story || '',
    description: wedding.description || '',
    templateId: wedding.templateId,
    isPublished: wedding.isPublished
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/wedding/${wedding.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Änderungen erfolgreich gespeichert!')
        // Refresh page data if needed
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Fehler beim Speichern')
      }
    } catch (error) {
      setError('Ein Fehler ist aufgetreten')
      console.error('Save error:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'basic', name: 'Grunddaten', icon: '👰🤵' },
    { id: 'content', name: 'Inhalte', icon: '📝' },
    { id: 'layout', name: 'Layout', icon: '📋' },
    { id: 'design', name: 'Design', icon: '🎨' },
    { id: 'settings', name: 'Einstellungen', icon: '⚙️' }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'content' | 'design' | 'layout' | 'settings')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Grunddaten der Hochzeit</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name der Braut
                  </label>
                  <input
                    type="text"
                    name="brideName"
                    value={formData.brideName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name des Bräutigams
                  </label>
                  <input
                    type="text"
                    name="groomName"
                    value={formData.groomName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hochzeitsdatum
                  </label>
                  <input
                    type="date"
                    name="weddingDate"
                    value={formData.weddingDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Uhrzeit (optional)
                  </label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    placeholder="z.B. 15:00 Uhr"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hochzeitsort
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dresscode (optional)
                </label>
                <input
                  type="text"
                  name="dresscode"
                  value={formData.dresscode}
                  onChange={handleInputChange}
                  placeholder="z.B. Festlich, Casual, Black Tie"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Inhalte der Hochzeitsseite</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eure Geschichte (optional)
                </label>
                <textarea
                  name="story"
                  value={formData.story}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Erzählt eure Liebesgeschichte... Wie habt ihr euch kennengelernt?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Wird auf der Hochzeitsseite als eigener Abschnitt angezeigt
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nachricht an die Gäste (optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Eine persönliche Nachricht an eure Gäste..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Erscheint im Details-Bereich der Hochzeitsseite
                </p>
              </div>
            </div>
          )}

          {/* Layout Tab */}
          {activeTab === 'layout' && (
            <div className="space-y-6">
              <SectionManager 
                wedding={wedding}
                onSave={async (sections) => {
                  try {
                    const response = await fetch(`/api/wedding/${wedding.id}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        ...formData,
                        sectionConfig: JSON.stringify(sections)
                      }),
                    })

                    const data = await response.json()

                    if (response.ok) {
                      setSuccess('Sektions-Layout erfolgreich gespeichert!')
                      setTimeout(() => setSuccess(''), 3000)
                    } else {
                      setError(data.error || 'Fehler beim Speichern des Layouts')
                    }
                  } catch (error) {
                    setError('Ein Fehler ist aufgetreten')
                    console.error('Layout save error:', error)
                  }
                }}
              />
            </div>
          )}

          {/* Design Tab */}
          {activeTab === 'design' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Design-Template</h3>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Aktuelles Template:</span> {wedding.template.name}
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  {wedding.template.description}
                </p>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
                <div>
                  <h4 className="font-medium text-gray-900">Template wechseln</h4>
                  <p className="text-sm text-gray-600">
                    Wähle ein anderes Design für deine Hochzeitsseite
                  </p>
                </div>
                <button
                  onClick={() => router.push('/dashboard/change-template')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Template ändern
                </button>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Einstellungen</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Hochzeitsseite veröffentlichen</h4>
                    <p className="text-sm text-gray-600">
                      Macht eure Hochzeitsseite für Gäste sichtbar
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">URL der Hochzeitsseite</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Eure Hochzeitsseite ist erreichbar unter:
                  </p>
                  <code className="bg-white px-3 py-2 rounded border text-sm">
                    {process.env.NEXT_PUBLIC_URL || 'https://my-wedding-site.com'}/{wedding.slug}
                  </code>
                </div>

                <div className="border border-red-200 bg-red-50 p-4 rounded-md">
                  <h4 className="font-medium text-red-900 mb-2">Gefahrenzone</h4>
                  <p className="text-sm text-red-700 mb-3">
                    Das Löschen der Hochzeit kann nicht rückgängig gemacht werden.
                    Alle Fotos, RSVPs und Daten werden unwiderruflich gelöscht.
                  </p>
                  <button
                    onClick={async () => {
                      const confirmMessage = `Möchtest du diese Hochzeit wirklich löschen?\n\n${wedding.brideName} & ${wedding.groomName}\n\nDiese Aktion kann NICHT rückgängig gemacht werden!\n\nAlle Fotos, RSVPs und Daten werden unwiderruflich gelöscht.`
                      
                      if (confirm(confirmMessage)) {
                        const secondConfirm = confirm('Bist du dir absolut sicher? Gib "LÖSCHEN" ein um zu bestätigen.')
                        
                        if (secondConfirm) {
                          const finalConfirm = prompt('Gib "LÖSCHEN" ein um die Hochzeit endgültig zu löschen:')
                          
                          if (finalConfirm === 'LÖSCHEN') {
                            setLoading(true)
                            setError('')
                            setSuccess('')

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
                                router.push('/dashboard')
                              } else {
                                setError(data.error || 'Fehler beim Löschen')
                              }
                            } catch (error) {
                              setError('Ein Fehler ist aufgetreten beim Löschen')
                              console.error('Delete error:', error)
                            } finally {
                              setLoading(false)
                            }
                          } else {
                            alert('Löschen abgebrochen - Eingabe war nicht korrekt')
                          }
                        }
                      }
                    }}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Wird gelöscht...' : '🗑️ Hochzeit löschen'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save and Publish Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* Publication Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Veröffentlichung</h3>
              <p className="text-sm text-gray-600">
                Status: {formData.isPublished ? (
                  <span className="text-green-600 font-medium">🟢 Veröffentlicht</span>
                ) : (
                  <span className="text-gray-500 font-medium">⚫ Entwurf</span>
                )}
              </p>
            </div>
            <div className="flex space-x-3">
              {!formData.isPublished ? (
                <button
                  onClick={async () => {
                    setFormData(prev => ({ ...prev, isPublished: true }))
                    setLoading(true)
                    setError('')
                    setSuccess('')

                    try {
                      const response = await fetch(`/api/wedding/${wedding.id}`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ ...formData, isPublished: true }),
                      })

                      const data = await response.json()

                      if (response.ok) {
                        setSuccess('🎉 Hochzeitsseite erfolgreich veröffentlicht!')
                        setTimeout(() => setSuccess(''), 5000)
                      } else {
                        setFormData(prev => ({ ...prev, isPublished: false }))
                        setError(data.error || 'Fehler beim Veröffentlichen')
                      }
                    } catch (error) {
                      setFormData(prev => ({ ...prev, isPublished: false }))
                      setError('Ein Fehler ist aufgetreten')
                      console.error('Publish error:', error)
                    } finally {
                      setLoading(false)
                    }
                  }}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
                >
                  {loading ? 'Veröffentliche...' : '🚀 Jetzt veröffentlichen'}
                </button>
              ) : (
                <button
                  onClick={async () => {
                    if (confirm('Möchtest du die Hochzeitsseite wirklich als Entwurf zurücksetzen? Sie wird dann für Gäste nicht mehr sichtbar sein.')) {
                      setFormData(prev => ({ ...prev, isPublished: false }))
                      await handleSave()
                    }
                  }}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
                >
                  📝 Als Entwurf speichern
                </button>
              )}
              <Link
                href={`/${wedding.slug}`}
                target="_blank"
                className="px-6 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-semibold text-sm"
              >
                👁️ Vorschau ansehen
              </Link>
            </div>
          </div>
          
          {formData.isPublished && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-green-500 text-lg">✅</span>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-green-800">
                    Deine Hochzeitsseite ist live!
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    Gäste können sie unter dieser URL besuchen:
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <code className="bg-white px-3 py-2 rounded border text-sm text-gray-800">
                      {process.env.NEXT_PUBLIC_URL || 'https://my-wedding-site.com'}/{wedding.slug}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL || 'https://my-wedding-site.com'}/${wedding.slug}`)
                        setSuccess('URL in Zwischenablage kopiert!')
                        setTimeout(() => setSuccess(''), 2000)
                      }}
                      className="px-3 py-2 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                    >
                      📋 Kopieren
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Changes */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between">
            <div>
              {success && (
                <p className="text-green-600 text-sm">{success}</p>
              )}
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Speichern...' : 'Änderungen speichern'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
