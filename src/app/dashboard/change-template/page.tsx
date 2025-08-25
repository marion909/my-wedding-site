'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Template {
  id: string
  name: string
  description: string
  previewImage: string
  cssFile: string
}

interface Wedding {
  id: string
  templateId: string
  brideName: string
  groomName: string
  slug: string
}

export default function TemplateChangePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch templates
        const templatesResponse = await fetch('/api/templates')
        const templatesData = await templatesResponse.json()
        console.log('Templates response:', templatesData) // Debug log
        
        // Handle different response formats
        if (Array.isArray(templatesData)) {
          setTemplates(templatesData)
        } else if (templatesData.templates && Array.isArray(templatesData.templates)) {
          setTemplates(templatesData.templates)
        } else {
          console.error('Unexpected templates format:', templatesData)
          setTemplates([])
        }

        // Fetch current wedding
        const weddingResponse = await fetch('/api/wedding')
        const weddingData = await weddingResponse.json()
        console.log('Wedding response:', weddingData) // Debug log
        
        if (weddingData.wedding) {
          setWedding(weddingData.wedding)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setTemplates([]) // Fallback to empty array
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchData()
    }
  }, [session])

  const handleTemplateChange = async (templateId: string) => {
    if (!wedding) return

    setUpdating(templateId)

    try {
      const response = await fetch(`/api/wedding/${wedding.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...wedding,
          templateId: templateId
        }),
      })

      if (response.ok) {
        // Erfolgreiche Aktualisierung
        alert('✅ Template erfolgreich geändert!')
        router.push('/dashboard/edit')
      } else {
        const data = await response.json()
        alert('❌ Fehler: ' + (data.error || 'Template konnte nicht geändert werden'))
      }
    } catch (error) {
      alert('❌ Ein Fehler ist aufgetreten')
      console.error('Template change error:', error)
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lädt Templates...</p>
        </div>
      </div>
    )
  }

  if (!wedding) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Keine Hochzeit gefunden</h1>
          <p className="text-gray-600 mb-6">Du musst zuerst eine Hochzeit erstellen.</p>
          <Link
            href="/dashboard/create"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Hochzeit erstellen
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Template ändern</h1>
              <p className="text-gray-600">
                Wähle ein neues Design für die Hochzeit von {wedding.brideName} & {wedding.groomName}
              </p>
            </div>
            <div className="flex gap-4">
              <Link 
                href={`/${wedding.slug}`}
                target="_blank"
                className="px-4 py-2 text-purple-600 hover:text-purple-800"
              >
                Vorschau ansehen ↗
              </Link>
              <Link 
                href="/dashboard/edit"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                ← Zurück zum Editor
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Template Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!Array.isArray(templates) || templates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Keine Templates verfügbar.</p>
            <p className="text-gray-500 text-sm mt-2">
              {!Array.isArray(templates) ? 'Fehler beim Laden der Templates.' : 'Es wurden noch keine Templates erstellt.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
            <div
              key={template.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 ${
                template.id === wedding.templateId
                  ? 'ring-2 ring-purple-500 shadow-lg'
                  : 'hover:shadow-lg'
              }`}
            >
              {/* Template Preview */}
              <div className="aspect-video bg-gray-100 relative">
                {template.previewImage ? (
                  <Image
                    src={template.previewImage}
                    alt={template.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">🎨</span>
                  </div>
                )}
                
                {/* Current Template Indicator */}
                {template.id === wedding.templateId && (
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
                      ✓ Aktuell
                    </span>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {template.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleTemplateChange(template.id)}
                    disabled={template.id === wedding.templateId || updating === template.id}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      template.id === wedding.templateId
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : updating === template.id
                        ? 'bg-purple-100 text-purple-600 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {template.id === wedding.templateId
                      ? '✓ Aktuell gewählt'
                      : updating === template.id
                      ? 'Wird angewendet...'
                      : 'Template verwenden'
                    }
                  </button>
                  
                  <Link
                    href={`/${wedding.slug}`}
                    target="_blank"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                  >
                    👁️ Aktuelle Seite
                  </Link>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Back Navigation */}
        <div className="mt-12 text-center">
          <Link
            href="/dashboard/edit"
            className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← Zurück zur Hochzeitsbearbeitung
          </Link>
        </div>
      </div>
    </div>
  )
}
