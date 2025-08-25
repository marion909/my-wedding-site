import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const weddingId = formData.get('weddingId') as string
    const caption = formData.get('caption') as string

    if (!file) {
      return NextResponse.json({ error: 'Keine Datei ausgewählt' }, { status: 400 })
    }

    if (!weddingId) {
      return NextResponse.json({ error: 'Hochzeits-ID erforderlich' }, { status: 400 })
    }

    // Überprüfe, ob die Hochzeit dem User gehört
    const wedding = await prisma.wedding.findFirst({
      where: {
        id: weddingId,
        userId: session.user.id
      }
    })

    if (!wedding) {
      return NextResponse.json({ error: 'Hochzeit nicht gefunden' }, { status: 404 })
    }

    // Validiere Dateityp
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Ungültiger Dateityp. Nur JPG, PNG und WebP sind erlaubt.' 
      }, { status: 400 })
    }

    // Validiere Dateigröße (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'Datei zu groß. Maximum 5MB erlaubt.' 
      }, { status: 400 })
    }

    // Erstelle Upload-Verzeichnis falls nicht vorhanden
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', weddingId)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generiere eindeutigen Dateinamen
    const timestamp = Date.now()
    const fileExtension = path.extname(file.name)
    const fileName = `photo_${timestamp}${fileExtension}`
    const filePath = path.join(uploadDir, fileName)

    // Speichere Datei
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Ermittle nächste Sortierreihenfolge
    const lastPhoto = await prisma.photo.findFirst({
      where: { weddingId },
      orderBy: { sortOrder: 'desc' }
    })
    const nextSortOrder = (lastPhoto?.sortOrder || 0) + 1

    // Speichere in Datenbank
    const photo = await prisma.photo.create({
      data: {
        weddingId,
        filename: fileName,
        caption: caption || '',
        sortOrder: nextSortOrder
      }
    })

    return NextResponse.json({
      success: true,
      photo: {
        id: photo.id,
        filename: photo.filename,
        caption: photo.caption,
        url: `/uploads/${weddingId}/${fileName}`
      }
    })

  } catch (error) {
    console.error('Photo upload error:', error)
    return NextResponse.json({ 
      error: 'Fehler beim Hochladen der Datei' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const weddingId = searchParams.get('weddingId')

    if (!weddingId) {
      return NextResponse.json({ error: 'Hochzeits-ID erforderlich' }, { status: 400 })
    }

    // Überprüfe, ob die Hochzeit dem User gehört
    const wedding = await prisma.wedding.findFirst({
      where: {
        id: weddingId,
        userId: session.user.id
      }
    })

    if (!wedding) {
      return NextResponse.json({ error: 'Hochzeit nicht gefunden' }, { status: 404 })
    }

    // Lade alle Fotos der Hochzeit
    const photos = await prisma.photo.findMany({
      where: { weddingId },
      orderBy: { sortOrder: 'asc' }
    })

    const photosWithUrls = photos.map((photo: any) => ({
      id: photo.id,
      filename: photo.filename,
      caption: photo.caption,
      sortOrder: photo.sortOrder,
      url: `/uploads/${weddingId}/${photo.filename}`
    }))

    return NextResponse.json({ photos: photosWithUrls })

  } catch (error) {
    console.error('Photos fetch error:', error)
    return NextResponse.json({ 
      error: 'Fehler beim Laden der Fotos' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const photoId = searchParams.get('photoId')

    if (!photoId) {
      return NextResponse.json({ error: 'Foto-ID erforderlich' }, { status: 400 })
    }

    // Finde das Foto und überprüfe Berechtigung
    const photo = await prisma.photo.findFirst({
      where: { 
        id: photoId
      },
      include: {
        wedding: true
      }
    })

    if (!photo || photo.wedding.userId !== session.user.id) {
      return NextResponse.json({ error: 'Foto nicht gefunden' }, { status: 404 })
    }

    // Lösche Datei
    const filePath = path.join(process.cwd(), 'public', 'uploads', photo.weddingId, photo.filename)
    try {
      const { unlink } = await import('fs/promises')
      await unlink(filePath)
    } catch (fileError) {
      console.warn('Could not delete file:', filePath)
    }

    // Lösche aus Datenbank
    await prisma.photo.delete({
      where: { id: photoId }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Photo delete error:', error)
    return NextResponse.json({ 
      error: 'Fehler beim Löschen des Fotos' 
    }, { status: 500 })
  }
}
