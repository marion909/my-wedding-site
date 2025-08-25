'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

interface SectionConfig {
  id: string
  name: string
  description: string
  enabled: boolean
  required: boolean
}

interface SectionManagerProps {
  wedding: {
    id: string
    sectionConfig?: string | null
  }
  onSave: (config: SectionConfig[]) => void
}

const DEFAULT_SECTIONS: SectionConfig[] = [
  {
    id: 'hero',
    name: 'Header/Hero-Bereich',
    description: 'Namen, Datum und Hauptbild',
    enabled: true,
    required: true
  },
  {
    id: 'countdown',
    name: 'Countdown',
    description: 'Countdown bis zur Hochzeit',
    enabled: true,
    required: false
  },
  {
    id: 'story',
    name: 'Unsere Geschichte',
    description: 'Liebesgeschichte des Paares',
    enabled: true,
    required: false
  },
  {
    id: 'details',
    name: 'Details',
    description: 'Zeit, Ort und weitere Informationen',
    enabled: true,
    required: false
  },
  {
    id: 'gallery',
    name: 'Fotogalerie',
    description: 'Hochgeladene Fotos',
    enabled: true,
    required: false
  },
  {
    id: 'rsvp',
    name: 'RSVP-Formular',
    description: 'Anmeldeformular für Gäste',
    enabled: true,
    required: true
  },
  {
    id: 'contact',
    name: 'Kontakt/Footer',
    description: 'Abschlussbereich mit Kontaktdaten',
    enabled: true,
    required: false
  }
]

export default function SectionManager({ wedding, onSave }: SectionManagerProps) {
  const [sections, setSections] = useState<SectionConfig[]>(DEFAULT_SECTIONS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (wedding.sectionConfig) {
      try {
        const savedConfig = JSON.parse(wedding.sectionConfig)
        setSections(savedConfig)
      } catch (error) {
        console.error('Error parsing section config:', error)
        setSections(DEFAULT_SECTIONS)
      }
    }
  }, [wedding.sectionConfig])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newSections = Array.from(sections)
    const [reorderedItem] = newSections.splice(result.source.index, 1)
    newSections.splice(result.destination.index, 0, reorderedItem)

    setSections(newSections)
  }

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, enabled: !section.enabled }
        : section
    ))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await onSave(sections)
    } finally {
      setLoading(false)
    }
  }

  const resetToDefault = () => {
    setSections(DEFAULT_SECTIONS)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Sektionen verwalten</h3>
          <p className="text-sm text-gray-600">
            Ziehe Sektionen, um ihre Reihenfolge zu ändern, oder deaktiviere sie
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={resetToDefault}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Zurücksetzen
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {sections.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
                  index={index}
                  isDragDisabled={section.required}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`bg-white border rounded-lg p-4 transition-all ${
                        snapshot.isDragging
                          ? 'shadow-lg rotate-2'
                          : 'shadow-sm'
                      } ${
                        !section.enabled
                          ? 'opacity-50 bg-gray-50'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            {...provided.dragHandleProps}
                            className={`cursor-grab active:cursor-grabbing ${
                              section.required ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <span className="text-gray-400 text-lg">⋮⋮</span>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">
                                {section.name}
                              </h4>
                              {section.required && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  Erforderlich
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {section.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">
                            Position {index + 1}
                          </span>
                          
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={section.enabled}
                              onChange={() => toggleSection(section.id)}
                              disabled={section.required}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <span className="text-blue-500 text-lg mr-3">💡</span>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Tipps</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ziehe Sektionen nach oben oder unten, um die Reihenfolge zu ändern</li>
              <li>• Schalte Sektionen aus, die du nicht benötigst</li>
              <li>• Erforderliche Sektionen können nicht deaktiviert oder verschoben werden</li>
              <li>• Änderungen werden sofort auf deiner Hochzeitsseite sichtbar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
