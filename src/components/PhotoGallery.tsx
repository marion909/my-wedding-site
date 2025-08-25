'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface Photo {
  id: string
  filename: string
  caption: string
  sortOrder: number
  url: string
}

interface PhotoGalleryProps {
  weddingId?: string
  photos?: Photo[]
  editable?: boolean
  maxPhotos?: number
}

export default function PhotoGallery({ weddingId, photos: initialPhotos, editable = false, maxPhotos }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos || [])
  const [loading, setLoading] = useState(!initialPhotos)
  const [error, setError] = useState('')
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const loadPhotos = useCallback(async () => {
    if (!weddingId || initialPhotos) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/photos?weddingId=${weddingId}`)
      const data = await response.json()

      if (response.ok) {
        let photoList = data.photos || []
        if (maxPhotos) {
          photoList = photoList.slice(0, maxPhotos)
        }
        setPhotos(photoList)
      } else {
        setError(data.error || 'Fehler beim Laden der Fotos')
      }
    } catch (error) {
      setError('Fehler beim Laden der Fotos')
      console.error('Load photos error:', error)
    } finally {
      setLoading(false)
    }
  }, [weddingId, initialPhotos, maxPhotos])

  const deletePhoto = async (photoId: string) => {
    if (!confirm('Möchtest du dieses Foto wirklich löschen?')) return

    try {
      const response = await fetch(`/api/photos?photoId=${photoId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPhotos(photos.filter(p => p.id !== photoId))
      } else {
        const data = await response.json()
        setError(data.error || 'Fehler beim Löschen')
      }
    } catch (error) {
      setError('Fehler beim Löschen des Fotos')
      console.error('Delete photo error:', error)
    }
  }

  useEffect(() => {
    if (!initialPhotos) {
      loadPhotos()
    }
  }, [initialPhotos, loadPhotos])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
        {error}
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">📷</div>
        <p>Noch keine Fotos hochgeladen</p>
        {editable && (
          <p className="text-sm mt-1">Lade deine ersten Hochzeitsfotos hoch!</p>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="aspect-square relative">
              <Image
                src={photo.url}
                alt={photo.caption || 'Hochzeitsfoto'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
              
              {/* Caption overlay */}
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                  <p className="text-white text-sm font-medium truncate">
                    {photo.caption}
                  </p>
                </div>
              )}

              {/* Edit button */}
              {editable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deletePhoto(photo.id)
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center"
                  title="Foto löschen"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 z-10"
            >
              ×
            </button>
            
            <div className="relative">
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || 'Hochzeitsfoto'}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
              />
              
              {selectedPhoto.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <p className="text-white text-center font-medium">
                    {selectedPhoto.caption}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation for large galleries */}
      {photos.length > 8 && !maxPhotos && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadPhotos}
            className="px-6 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Alle Fotos anzeigen ({photos.length})
          </button>
        </div>
      )}
    </div>
  )
}
