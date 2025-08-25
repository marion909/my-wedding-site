import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    // Lade Hochzeit mit Statistiken
    const wedding = await prisma.wedding.findFirst({
      where: {
        userId: session.user.id
      },
      include: {
        template: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            rsvps: true,
            photos: true
          }
        }
      }
    })

    if (!wedding) {
      return NextResponse.json({ wedding: null })
    }

    // RSVP Statistiken
    const rsvpStats = await prisma.rSVP.aggregate({
      where: {
        weddingId: wedding.id
      },
      _count: {
        id: true
      },
      _sum: {
        guestCount: true
      }
    })

    const attendingCount = await prisma.rSVP.count({
      where: {
        weddingId: wedding.id,
        attending: true
      }
    })

    const stats = {
      totalRsvps: wedding._count.rsvps,
      attendingGuests: attendingCount,
      totalGuests: rsvpStats._sum.guestCount || 0,
      photosCount: wedding._count.photos,
      // Platzhalter für zukünftige Features
      pageViews: 0
    }

    return NextResponse.json({
      wedding: {
        id: wedding.id,
        slug: wedding.slug,
        brideName: wedding.brideName,
        groomName: wedding.groomName,
        weddingDate: wedding.weddingDate,
        location: wedding.location,
        isPublished: wedding.isPublished,
        template: wedding.template
      },
      stats
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ 
      error: 'Fehler beim Laden der Statistiken' 
    }, { status: 500 })
  }
}
