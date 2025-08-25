import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return Response.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const resolvedParams = await params
    const weddingId = resolvedParams.id
    const body = await request.json()

    // Validate wedding ownership
    const wedding = await prisma.wedding.findFirst({
      where: {
        id: weddingId,
        userId: session.user.id
      }
    })

    if (!wedding) {
      return Response.json({ error: 'Hochzeit nicht gefunden' }, { status: 404 })
    }

    // Update wedding data
    const updatedWedding = await prisma.wedding.update({
      where: { id: weddingId },
      data: {
        brideName: body.brideName,
        groomName: body.groomName,
        weddingDate: new Date(body.weddingDate),
        location: body.location,
        time: body.time || null,
        dresscode: body.dresscode || null,
        story: body.story || null,
        description: body.description || null,
        templateId: body.templateId,
        isPublished: body.isPublished,
        sectionConfig: body.sectionConfig || null
      },
      include: {
        template: true
      }
    })

    return Response.json({ 
      success: true, 
      wedding: updatedWedding 
    })

  } catch (error) {
    console.error('Wedding update error:', error)
    return Response.json({ error: 'Server-Fehler' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return Response.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const resolvedParams = await params
    const weddingId = resolvedParams.id

    // Validate wedding ownership
    const wedding = await prisma.wedding.findFirst({
      where: {
        id: weddingId,
        userId: session.user.id
      },
      include: {
        photos: true
      }
    })

    if (!wedding) {
      return Response.json({ error: 'Hochzeit nicht gefunden' }, { status: 404 })
    }

    // Delete all photos from filesystem
    for (const photo of wedding.photos) {
      try {
        const photoPath = path.join(process.cwd(), 'public', 'uploads', photo.filename)
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath)
        }
      } catch (error) {
        console.error('Error deleting photo file:', error)
        // Continue with deletion even if file deletion fails
      }
    }

    // Delete wedding (this will cascade delete photos and RSVPs due to foreign key constraints)
    await prisma.wedding.delete({
      where: { id: weddingId }
    })

    return Response.json({ 
      success: true, 
      message: 'Hochzeit erfolgreich gelöscht' 
    })

  } catch (error) {
    console.error('Wedding deletion error:', error)
    return Response.json({ error: 'Server-Fehler beim Löschen' }, { status: 500 })
  }
}
