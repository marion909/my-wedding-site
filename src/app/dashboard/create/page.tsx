'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Template {
  id: string
  name: string
  description: string
  previewImage: string
}

export default function CreateWeddingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    weddingDate: '',
    location: '',
    story: '',
    templateId: '',
    slug: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/login')
      return
    }

    // Templates laden
    fetchTemplates()
  }, [session, status, router])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const generateSlug = (brideName: string, groomName: string) => {
    const slug = `${brideName}-und-${groomName}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    
    setFormData(prev => ({ ...prev, slug }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Slug automatisch generieren wenn Braut oder Bräutigam Name geändert wird
    if (name === 'brideName' || name === 'groomName') {
      const brideName = name === 'brideName' ? value : formData.brideName
      const groomName = name === 'groomName' ? value : formData.groomName
      
      if (brideName && groomName) {
        generateSlug(brideName, groomName)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/wedding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/dashboard')
      } else {
        setError(data.error || 'Ein Fehler ist aufgetreten')
      }
    } catch (error) {
      setError('Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step === 1 && (!formData.brideName || !formData.groomName || !formData.weddingDate || !formData.location)) {
      setError('Bitte füllt alle Pflichtfelder aus')
      return
    }
    setError('')
    setStep(step + 1)
  }

  if (status === 'loading') {
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
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Zurück zum Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span className={step >= 1 ? 'text-purple-600 font-medium' : ''}>Grunddaten</span>
              <span className={step >= 2 ? 'text-purple-600 font-medium' : ''}>Template</span>
              <span className={step >= 3 ? 'text-purple-600 font-medium' : ''}>Fertig</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            {step === 1 && (
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                  Eure Hochzeitsdaten
                </h1>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name der Braut *
                      </label>
                      <input
                        type="text"
                        name="brideName"
                        value={formData.brideName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Anna"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name des Bräutigams *
                      </label>
                      <input
                        type="text"
                        name="groomName"
                        value={formData.groomName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Max"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hochzeitsdatum *
                    </label>
                    <input
                      type="date"
                      name="weddingDate"
                      value={formData.weddingDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hochzeitsort *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Standesamt München, Marienplatz 1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Eure Liebesgeschichte (optional)
                    </label>
                    <textarea
                      name="story"
                      value={formData.story}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Erzählt euren Gästen eure Geschichte..."
                    />
                  </div>

                  {formData.slug && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Eure Website-URL
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">www.my-wedding-site.com/</span>
                        <input
                          type="text"
                          name="slug"
                          value={formData.slug}
                          onChange={handleInputChange}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Diese URL können eure Gäste verwenden um eure Hochzeitswebsite zu besuchen
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Weiter zur Template-Auswahl
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                  Template wählen
                </h1>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.templateId === template.id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, templateId: template.id }))}
                    >
                      <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-4 flex items-center justify-center">
                        <span className="text-gray-500">Template Vorschau</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Zurück
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.templateId}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    Weiter
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                  Zusammenfassung
                </h1>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-lg mb-4">Eure Hochzeitswebsite</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Brautpaar:</strong> {formData.brideName} & {formData.groomName}</p>
                    <p><strong>Datum:</strong> {new Date(formData.weddingDate).toLocaleDateString('de-DE')}</p>
                    <p><strong>Ort:</strong> {formData.location}</p>
                    <p><strong>Template:</strong> {templates.find(t => t.id === formData.templateId)?.name}</p>
                    <p><strong>URL:</strong> www.my-wedding-site.com/{formData.slug}</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Zurück
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Erstelle...' : 'Hochzeitswebsite erstellen'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
