import { Metadata } from 'next'

interface SEOMetadata {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  openGraph?: {
    title: string
    description: string
    image?: string
    url?: string
  }
  twitter?: {
    title: string
    description: string
    image?: string
  }
}

export function generateSEOMetadata(data: SEOMetadata): Metadata {
  if (!data) {
    console.error('generateSEOMetadata called with undefined data')
    return {
      title: 'My Wedding Site',
      description: 'Erstelle deine perfekte Hochzeitswebsite',
    }
  }

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords?.join(', '),
    alternates: {
      canonical: data.canonical,
    },
    
    // Open Graph (Facebook, LinkedIn, etc.)
    openGraph: {
      title: data.openGraph?.title || data.title,
      description: data.openGraph?.description || data.description,
      url: data.openGraph?.url || data.canonical,
      siteName: 'My Wedding Site',
      images: data.openGraph?.image ? [
        {
          url: data.openGraph.image,
          width: 1200,
          height: 630,
          alt: data.openGraph.title
        }
      ] : [],
      locale: 'de_DE',
      type: 'website',
    },
    
    // Twitter Cards
    twitter: {
      card: 'summary_large_image',
      title: data.twitter?.title || data.title,
      description: data.twitter?.description || data.description,
      images: data.twitter?.image ? [data.twitter.image] : [],
      creator: '@myweddingsite',
    },
    
    // Additional metadata
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Verification
    verification: {
      google: process.env.GOOGLE_VERIFICATION,
    },
  }
}

// Wedding-specific SEO
export function generateWeddingSEO(wedding: {
  brideName: string
  groomName: string
  date: Date
  location: string
  slug: string
  story?: string
  photos?: { filename: string }[]
}) {
  if (!wedding) {
    console.error('generateWeddingSEO called with undefined wedding data')
    return {
      title: 'Hochzeit - My Wedding Site',
      description: 'Eine wunderschöne Hochzeitsfeier',
    }
  }

  const weddingDate = wedding.date?.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) || 'Hochzeitsdatum'
  
  const title = `${wedding.brideName} & ${wedding.groomName} - Hochzeit am ${weddingDate}`
  const description = wedding.story 
    ? `${wedding.story.slice(0, 150)}...`
    : `Wir heiraten am ${weddingDate} in ${wedding.location}. Feiert mit uns diesen besonderen Tag!`
  
  const keywords = [
    'Hochzeit',
    wedding.brideName,
    wedding.groomName,
    wedding.location,
    'RSVP',
    'Hochzeitsfeier',
    weddingDate.split(' ')[2] // Jahr
  ]
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const canonical = `${baseUrl}/${wedding.slug || ''}`
  
  // Use first photo as OG image if available
  const ogImage = wedding.photos?.[0]
    ? `${baseUrl}/uploads/${wedding.photos[0].filename}`
    : `${baseUrl}/og-default.jpg`
  
  return generateSEOMetadata({
    title,
    description,
    keywords,
    canonical,
    openGraph: {
      title,
      description,
      url: canonical,
      image: ogImage,
    },
    twitter: {
      title,
      description,
      image: ogImage,
    },
  })
}

// Landing page SEO
export function generateLandingSEO() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  return generateSEOMetadata({
    title: 'My Wedding Site - Erstelle deine perfekte Hochzeitswebsite',
    description: 'Erstelle in wenigen Minuten deine eigene Hochzeitswebsite. Schöne Templates, RSVP-Verwaltung und Fotogalerien - alles kostenlos!',
    keywords: [
      'Hochzeitswebsite erstellen',
      'Hochzeit Website',
      'RSVP System',
      'Hochzeitseinladung online',
      'Wedding Website',
      'Hochzeitsplaner',
      'kostenlos'
    ],
    canonical: baseUrl,
    openGraph: {
      title: 'My Wedding Site - Erstelle deine perfekte Hochzeitswebsite',
      description: 'Schöne Hochzeitswebsites in Minuten erstellen. Templates, RSVP & mehr!',
      url: baseUrl,
      image: `${baseUrl}/og-landing.jpg`,
    },
  })
}
