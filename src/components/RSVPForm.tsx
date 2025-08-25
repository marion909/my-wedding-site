'use client'

import { useState } from 'react'

interface RSVPFormProps {
  weddingId: string
  weddingDate: string
}

export default function RSVPForm({ weddingId, weddingDate }: RSVPFormProps) {
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    attending: '',
    guestCount: 1,
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Ensure weddingDate is a Date object
  const dateObj = new Date(weddingDate)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.guestName || !formData.email || !formData.attending) {
      setError('Bitte füllt alle Pflichtfelder aus')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weddingId,
          guestName: formData.guestName,
          email: formData.email,
          attending: formData.attending === 'yes',
          guestCount: formData.guestCount,
          message: formData.message
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setFormData({
          guestName: '',
          email: '',
          attending: '',
          guestCount: 1,
          message: ''
        })
      } else {
        setError(data.error || 'Ein Fehler ist aufgetreten')
      }
    } catch (_error) {
      setError('Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guestCount' ? parseInt(value) : value
    }))
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-2xl font-semibold text-green-800 mb-2">
          Vielen Dank für deine Antwort!
        </h3>
        <p className="text-green-700">
          Wir haben deine RSVP erhalten und freuen uns {formData.attending === 'yes' ? 'auf dich' : 'für dein Verständnis'}!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <p className="text-gray-600 text-center mb-8">
        Wir freuen uns auf eure Teilnahme an unserem besonderen Tag! 
        Bitte gebt uns bis zum {new Date(dateObj.getTime() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE')} Bescheid.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dein Name *
            </label>
            <input
              type="text"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Max Mustermann"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-Mail-Adresse *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="max@email.de"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Wirst du an unserer Hochzeit teilnehmen? *
          </label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="attending" 
                value="yes" 
                checked={formData.attending === 'yes'}
                onChange={handleChange}
                className="mr-3" 
              />
              <span>🎉 Ja, ich komme gerne!</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="attending" 
                value="no" 
                checked={formData.attending === 'no'}
                onChange={handleChange}
                className="mr-3" 
              />
              <span>😢 Leider kann ich nicht teilnehmen</span>
            </label>
          </div>
        </div>

        {formData.attending === 'yes' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anzahl Personen
            </label>
            <select 
              name="guestCount"
              value={formData.guestCount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="1">1 Person</option>
              <option value="2">2 Personen</option>
              <option value="3">3 Personen</option>
              <option value="4">4 Personen</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nachricht (optional)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="Glückwünsche, Wünsche oder besondere Hinweise..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50"
        >
          {loading ? 'Sende...' : 'RSVP senden'}
        </button>
      </form>
    </div>
  )
}
