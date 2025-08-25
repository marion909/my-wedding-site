import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendRSVPConfirmation, sendOwnerNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { weddingId, guestName, email, attending, guestCount, message } = await request.json()

    // Validierung
    if (!weddingId || !guestName || !email || typeof attending !== 'boolean') {
      return NextResponse.json(
        { error: 'Alle Pflichtfelder sind erforderlich' },
        { status: 400 }
      )
    }

    // Prüfen ob Hochzeit existiert und veröffentlicht ist
    const wedding = await prisma.wedding.findUnique({
      where: {
        id: weddingId,
        isPublished: true
      },
      include: {
        user: true // Für Owner-Benachrichtigung
      }
    })

    if (!wedding) {
      return NextResponse.json(
        { error: 'Hochzeit nicht gefunden' },
        { status: 404 }
      )
    }

    // Prüfen ob bereits RSVP von dieser Email existiert
    const existingRsvp = await prisma.rSVP.findFirst({
      where: {
        weddingId,
        email
      }
    })

    if (existingRsvp) {
      // RSVP aktualisieren
      const updatedRsvp = await prisma.rSVP.update({
        where: {
          id: existingRsvp.id
        },
        data: {
          guestName,
          attending,
          guestCount: guestCount || 1,
          message: message || ''
        }
      })

      // Email-Benachrichtigungen senden
      try {
        // Bestätigung an den Gast
        await sendRSVPConfirmation({
          guestName,
          guestEmail: email,
          brideName: wedding.brideName,
          groomName: wedding.groomName,
          weddingDate: new Date(wedding.weddingDate).toLocaleDateString('de-DE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          attending: attending,
          guestCount: guestCount || 1,
          message,
          weddingSlug: wedding.slug
        })

        // Benachrichtigung an das Paar
        await sendOwnerNotification({
          ownerEmail: wedding.user.email,
          brideName: wedding.brideName,
          groomName: wedding.groomName,
          guestName,
          attending: attending,
          guestCount: guestCount || 1,
          message,
          weddingSlug: wedding.slug
        })
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Email-Fehler sollten die RSVP nicht blockieren
      }

      return NextResponse.json(
        { message: 'RSVP erfolgreich aktualisiert', rsvp: updatedRsvp },
        { status: 200 }
      )
    } else {
      // Neue RSVP erstellen
      const rsvp = await prisma.rSVP.create({
        data: {
          weddingId,
          guestName,
          email,
          attending,
          guestCount: guestCount || 1,
          message: message || ''
        }
      })

      // Email-Benachrichtigungen senden
      try {
        // Bestätigung an den Gast
        await sendRSVPConfirmation({
          guestName,
          guestEmail: email,
          brideName: wedding.brideName,
          groomName: wedding.groomName,
          weddingDate: new Date(wedding.weddingDate).toLocaleDateString('de-DE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          attending: attending,
          guestCount: guestCount || 1,
          message,
          weddingSlug: wedding.slug
        })

        // Benachrichtigung an das Paar
        await sendOwnerNotification({
          ownerEmail: wedding.user.email,
          brideName: wedding.brideName,
          groomName: wedding.groomName,
          guestName,
          attending: attending,
          guestCount: guestCount || 1,
          message,
          weddingSlug: wedding.slug
        })
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Email-Fehler sollten die RSVP nicht blockieren
      }

      return NextResponse.json(
        { message: 'RSVP erfolgreich gespeichert', rsvp },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('RSVP error:', error)
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const weddingId = searchParams.get('weddingId')

    if (!weddingId) {
      return NextResponse.json(
        { error: 'Wedding ID erforderlich' },
        { status: 400 }
      )
    }

    // RSVPs für eine Hochzeit laden (nur für den Besitzer)
    const rsvps = await prisma.rSVP.findMany({
      where: {
        weddingId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const stats = {
      total: rsvps.length,
      attending: rsvps.filter((r: any) => r.attending).length,
      notAttending: rsvps.filter((r: any) => !r.attending).length,
      totalGuests: rsvps.filter((r: any) => r.attending).reduce((sum: number, r: any) => sum + r.guestCount, 0)
    }

    return NextResponse.json({ rsvps, stats })
  } catch (error) {
    console.error('Error fetching RSVPs:', error)
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
