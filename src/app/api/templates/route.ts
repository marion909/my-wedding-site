import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        previewImage: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
