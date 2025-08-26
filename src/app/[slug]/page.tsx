import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import RSVPForm from '@/components/RSVPForm'
import PhotoGallery from '@/components/PhotoGallery'
import { shouldShowAds } from '@/lib/subscription'
import { WeddingHeaderAd, WeddingFooterAd, WeddingSectionAd } from '@/components/SmartAd'
import { Metadata } from 'next'

interface SectionConfig {
  id: string
  name: string
  description: string
  enabled: boolean
  required: boolean
}

interface WeddingPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: WeddingPageProps): Promise<Metadata> {
  const resolvedParams = await params
  
  const wedding = await prisma.wedding.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      photos: true,
    }
  })

  if (!wedding) {
    return {
      title: 'Hochzeit nicht gefunden - My Wedding Site',
      description: 'Die gesuchte Hochzeitsseite existiert nicht.',
    }
  }

  const weddingDate = new Date(wedding.weddingDate)
  const dateString = weddingDate.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  return {
    title: `${wedding.brideName} & ${wedding.groomName} - ${dateString}`,
    description: wedding.story 
      ? `${wedding.story.slice(0, 150)}...`
      : `Herzlich willkommen zur Hochzeit von ${wedding.brideName} und ${wedding.groomName} am ${dateString} in ${wedding.location}.`,
  }
}

export default async function WeddingPage({ params }: WeddingPageProps) {
  const resolvedParams = await params
  
  const wedding = await prisma.wedding.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      photos: true,
      rsvps: true,
      template: true
    }
  })

  if (!wedding) {
    notFound()
  }

  // Debug: log the wedding data structure
  console.log('Wedding data:', {
    id: wedding.id,
    weddingDate: wedding.weddingDate
  })

  const weddingDate = new Date(wedding.weddingDate)
  
  // Check if the date is valid
  if (isNaN(weddingDate.getTime())) {
    console.error('Invalid wedding date:', wedding.weddingDate)
    notFound()
  }
  
  const isUpcoming = weddingDate > new Date()

  // Check if we should show ads (for free users)
  const showAds = await shouldShowAds(wedding.userId)

  // Parse section configuration
  let sectionConfig = []
  if (wedding.sectionConfig) {
    try {
      sectionConfig = JSON.parse(wedding.sectionConfig)
    } catch (error) {
      console.error('Error parsing section config:', error)
      // Use default sections if parsing fails
      sectionConfig = [
        { id: 'hero', enabled: true },
        { id: 'countdown', enabled: true },
        { id: 'story', enabled: true },
        { id: 'details', enabled: true },
        { id: 'gallery', enabled: true },
        { id: 'rsvp', enabled: true },
        { id: 'contact', enabled: true }
      ]
    }
  } else {
    // Default configuration if none exists
    sectionConfig = [
      { id: 'hero', enabled: true },
      { id: 'countdown', enabled: true },
      { id: 'story', enabled: true },
      { id: 'details', enabled: true },
      { id: 'gallery', enabled: true },
      { id: 'rsvp', enabled: true },
      { id: 'contact', enabled: true }
    ]
  }

  // Helper function to check if a section is enabled
  const isSectionEnabled = (sectionId: string) => {
    const section = sectionConfig.find((s: SectionConfig) => s.id === sectionId)
    return section ? section.enabled : true // Default to enabled if not found
  }

  // Get sections in the configured order
  const getSectionsInOrder = () => {
    return sectionConfig.filter((s: SectionConfig) => s.enabled)
  }

  // Render individual sections
  const renderSection = (sectionId: string) => {
    if (!isSectionEnabled(sectionId)) return null

    switch (sectionId) {
      case 'hero':
        return (
          <div key="hero" className="hero-section relative py-20 px-6">
            <div className="container mx-auto text-center max-w-4xl">
              <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6">
                {wedding.brideName}
                <span className="block text-purple-600">&</span>
                {wedding.groomName}
              </h1>
              
              <p className="hero-subtitle text-2xl mb-8">
                {weddingDate.toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>

              <p className="hero-subtitle text-xl mb-12">
                📍 {wedding.location}
              </p>
            </div>
          </div>
        )

      case 'countdown':
        if (!isUpcoming) return null
        return (
          <section key="countdown" className="countdown-section py-16 px-6">
            <div className="container mx-auto max-w-md text-center">
              <div className="card p-8">
                <h2 className="section-title text-2xl font-semibold mb-4">
                  Countdown bis zur Hochzeit
                </h2>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-purple-600">
                      {Math.floor((weddingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm text-gray-600">Tage</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">
                      {Math.floor(((weddingDate.getTime() - new Date().getTime()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}
                    </div>
                    <div className="text-sm text-gray-600">Stunden</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">
                      {Math.floor(((weddingDate.getTime() - new Date().getTime()) % (1000 * 60 * 60)) / (1000 * 60))}
                    </div>
                    <div className="text-sm text-gray-600">Minuten</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">
                      {Math.floor(((weddingDate.getTime() - new Date().getTime()) % (1000 * 60)) / 1000)}
                    </div>
                    <div className="text-sm text-gray-600">Sekunden</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )

      case 'story':
        if (!wedding.story) return null
        return (
          <section key="story" id="story" className="story-section py-16 px-6">
            <div className="container mx-auto max-w-3xl text-center">
              <h2 className="section-title text-3xl font-bold mb-8">
                Unsere Geschichte
              </h2>
              <div className="card p-8">
                <p className="story-text leading-relaxed text-lg whitespace-pre-line">
                  {wedding.story}
                </p>
              </div>
            </div>
          </section>
        )

      case 'details':
        return (
          <section key="details" id="details" className="details-section py-16 px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="section-title text-3xl font-bold text-center mb-12">
                Hochzeitsdetails
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="card p-8 text-center">
                  <div className="text-4xl mb-4">💒</div>
                  <h3 className="detail-title text-xl font-semibold mb-2">Zeremonie</h3>
                  <p className="detail-text mb-2">
                    {weddingDate.toLocaleDateString('de-DE', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  {wedding.time && (
                    <p className="detail-text mb-2">🕐 {wedding.time}</p>
                  )}
                  <p className="detail-text">📍 {wedding.location}</p>
                  {wedding.dresscode && (
                    <p className="detail-text mt-2">👔 Dresscode: {wedding.dresscode}</p>
                  )}
                </div>
                
                <div className="card p-8 text-center">
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="detail-title text-xl font-semibold mb-2">Feier</h3>
                  <p className="detail-text">
                    Im Anschluss an die Zeremonie feiern wir gemeinsam!
                  </p>
                  {wedding.description && (
                    <p className="detail-text mt-4 text-sm">
                      {wedding.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )

      case 'gallery':
        if (!wedding.photos || wedding.photos.length === 0) return null
        return (
          <section key="gallery" id="photos" className="photos-section py-16 px-6">
            <div className="container mx-auto max-w-6xl">
              <h2 className="section-title text-3xl font-bold text-center mb-12">
                Unsere Fotos
              </h2>
              <PhotoGallery photos={wedding.photos.map(photo => ({
                ...photo,
                url: `/uploads/${photo.filename}`,
                caption: photo.caption || ''
              }))} />
            </div>
          </section>
        )

      case 'rsvp':
        return (
          <section key="rsvp" id="rsvp" className="rsvp-section py-16 px-6">
            <div className="container mx-auto max-w-2xl">
              <h2 className="section-title text-3xl font-bold text-center mb-12">
                RSVP
              </h2>
              <div className="card p-8">
                <RSVPForm weddingId={wedding.id} weddingDate={weddingDate.toISOString()} />
              </div>
            </div>
          </section>
        )

      case 'contact':
        return (
          <footer key="contact" className="footer bg-gray-50 py-16 px-6">
            <div className="container mx-auto max-w-4xl text-center">
              <div className="card p-8">
                <h3 className="text-2xl font-bold mb-4">
                  {wedding.brideName} & {wedding.groomName}
                </h3>
                <p className="detail-text mb-6">
                  {weddingDate.toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-gray-600">
                  Wir freuen uns darauf, diesen besonderen Tag mit euch zu teilen! 💕
                </p>
              </div>
            </div>
          </footer>
        )

      default:
        return null
    }
  }

  return (
    <>
      {/* Template CSS */}
      <link 
        rel="stylesheet" 
        href={`/templates/${wedding.template?.cssFile || wedding.templateId}.css`}
        precedence="default"
      />
      
      {/* Header Ad for Free Users */}
      {showAds && <WeddingHeaderAd />}
      
      {/* Dynamic Navigation */}
      <nav className="sticky top-0 bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-center space-x-8 py-4">
            {isSectionEnabled('story') && wedding.story && (
              <a href="#story" className="text-gray-700 hover:text-purple-600 transition-colors">
                Unsere Geschichte
              </a>
            )}
            {isSectionEnabled('details') && (
              <a href="#details" className="text-gray-700 hover:text-purple-600 transition-colors">
                Details
              </a>
            )}
            {isSectionEnabled('rsvp') && (
              <a href="#rsvp" className="text-gray-700 hover:text-purple-600 transition-colors">
                RSVP
              </a>
            )}
            {isSectionEnabled('gallery') && wedding.photos.length > 0 && (
              <a href="#photos" className="text-gray-700 hover:text-purple-600 transition-colors">
                Fotos
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Render sections in configured order */}
      {getSectionsInOrder().map((section: SectionConfig, index: number) => (
        <div key={section.id}>
          {renderSection(section.id)}
          {/* Show ads between sections for free users */}
          {showAds && index === 1 && (
            <div className="py-8 px-6 bg-gray-50">
              <WeddingSectionAd sectionName="rsvp" />
            </div>
          )}
          {showAds && index === 3 && (
            <div className="py-8 px-6">
              <WeddingSectionAd sectionName="gallery" />
            </div>
          )}
        </div>
      ))}
      
      {/* Footer Ad for Free Users */}
      {showAds && <WeddingFooterAd />}
    </>
  )
}
