import { prisma } from '@/lib/prisma'

interface AnalyticsEvent {
  type: 'page_view' | 'wedding_created' | 'rsvp_submitted' | 'photo_uploaded' | 'template_changed'
  weddingId?: string
  metadata?: Record<string, unknown>
}

export async function trackEvent(event: AnalyticsEvent) {
  try {
    // In development, just log
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event)
      return
    }

    // In production, you could send to analytics service
    // For now, we'll store basic stats in database
    
    // Track wedding views
    if (event.type === 'page_view' && event.weddingId) {
      await prisma.wedding.update({
        where: { id: event.weddingId },
        data: {
          // We could add a views counter field in a migration
          // views: { increment: 1 }
        }
      })
    }

    // You could also use services like:
    // - Google Analytics 4
    // - Mixpanel
    // - PostHog
    // - Plausible (privacy-friendly)
    
  } catch (error) {
    console.error('Analytics tracking error:', error)
    // Don't throw - analytics should never break the app
  }
}

// React hook for client-side tracking
export function useAnalytics() {
  const track = async (event: AnalyticsEvent) => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })
    } catch (error) {
      console.error('Client analytics error:', error)
    }
  }

  return { track }
}

// Basic stats for dashboard
export async function getBasicStats() {
  try {
    const [
      totalWeddings,
      totalRSVPs,
      totalPhotos,
      recentWeddings
    ] = await Promise.all([
      prisma.wedding.count(),
      prisma.rSVP.count(),
      prisma.photo.count(),
      prisma.wedding.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      })
    ])

    return {
      totalWeddings,
      totalRSVPs,
      totalPhotos,
      recentWeddings
    }
  } catch (error) {
    console.error('Stats error:', error)
    return {
      totalWeddings: 0,
      totalRSVPs: 0,
      totalPhotos: 0,
      recentWeddings: 0
    }
  }
}
