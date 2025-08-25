import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json()

    // Validierung
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Passwort muss mindestens 6 Zeichen lang sein' },
        { status: 400 }
      )
    }

    // Prüfen ob User bereits existiert
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ein Account mit dieser E-Mail-Adresse existiert bereits' },
        { status: 400 }
      )
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 12)

    // User erstellen
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true
      }
    })

    return NextResponse.json(
      { message: 'Account erfolgreich erstellt', user },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
