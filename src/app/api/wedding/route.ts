import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      )
    }

    const wedding = await prisma.wedding.findUnique({
      where: {
        userId: session.user.id
      },
      include: {
        template: {
          select: {
            name: true,
            description: true
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

    return NextResponse.json({ wedding })
  } catch (error) {
    console.error('Error fetching wedding:', error)
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      )
    }

    const { brideName, groomName, weddingDate, location, story, templateId, slug } = await request.json()

    // Validierung
    if (!brideName || !groomName || !weddingDate || !location || !templateId || !slug) {
      return NextResponse.json(
        { error: 'Alle Pflichtfelder sind erforderlich' },
        { status: 400 }
      )
    }

    // Prüfen ob User bereits eine Hochzeit hat
    const existingWedding = await prisma.wedding.findUnique({
      where: { userId: session.user.id }
    })

    if (existingWedding) {
      return NextResponse.json(
        { error: 'Du hast bereits eine Hochzeit erstellt' },
        { status: 400 }
      )
    }

    // Prüfen ob Benutzer existiert
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 400 }
      )
    }

    // Prüfen ob Template existiert
    const template = await prisma.template.findUnique({
      where: { id: templateId }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template nicht gefunden' },
        { status: 400 }
      )
    }

    // Prüfen ob Slug bereits vergeben ist
    const existingSlug = await prisma.wedding.findUnique({
      where: { slug }
    })

    if (existingSlug) {
      return NextResponse.json(
        { error: 'Dieser URL-Name ist bereits vergeben' },
        { status: 400 }
      )
    }

    // Hochzeit erstellen
    const wedding = await prisma.wedding.create({
      data: {
        userId: session.user.id,
        brideName,
        groomName,
        weddingDate: new Date(weddingDate),
        location,
        story: story || '',
        templateId,
        slug,
        isPublished: false
      },
      include: {
        template: {
          select: {
            name: true,
            description: true
          }
        }
      }
    })

    return NextResponse.json(
      { message: 'Hochzeit erfolgreich erstellt', wedding },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating wedding:', error)
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
