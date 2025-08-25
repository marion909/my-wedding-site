'use client'

import { useState } from 'react'

interface PhotoUploadProps {
  weddingId: string
}

export default function PhotoUpload({ weddingId }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    
    // Validierung
    if (!file.type.startsWith('image/')) {
      setError('Bitte nur Bilddateien auswählen')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Datei zu groß. Maximum 5MB erlaubt.')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('weddingId', weddingId)

      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Foto "${file.name}" erfolgreich hochgeladen!`)
        // Erfolgsmeldung nach 3 Sekunden ausblenden
        setTimeout(() => {
          setSuccess('')
        }, 3000)
      } else {
        setError(data.error || 'Fehler beim Hochladen')
      }
    } catch (error) {
      setError('Fehler beim Hochladen der Datei')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files)
  }

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive 
            ? 'border-purple-500 bg-purple-50' 
            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="text-4xl">📸</div>
          
          {uploading ? (
            <div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <p className="text-purple-600 font-medium">Foto wird hochgeladen...</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Fotos hochladen
              </p>
              <p className="text-gray-500 text-sm">
                Klicke hier oder ziehe Bilder in diesen Bereich
              </p>
              <p className="text-gray-400 text-xs mt-1">
                JPG, PNG oder WebP • Max. 5MB pro Datei
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
          {success}
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h4 className="font-medium text-blue-800 mb-2">💡 Foto-Tipps</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Beste Qualität: Hochauflösende Originalbilder verwenden</li>
          <li>• Format: Querformat (16:9) funktioniert am besten für die Galerie</li>
          <li>• Anzahl: 5-15 Fotos ergeben eine schöne Galerie</li>
          <li>• Reihenfolge: Fotos können später umsortiert werden</li>
        </ul>
      </div>
    </div>
  )
}
