import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

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
