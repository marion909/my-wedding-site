import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createTestWedding() {
  // Erst einen Test-User erstellen
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      firstName: 'Test',
      lastName: 'User'
    }
  })

  // Dann eine Test-Hochzeit erstellen
  const testWedding = await prisma.wedding.upsert({
    where: { slug: 'marlene-und-mario' },
    update: {},
    create: {
      slug: 'marlene-und-mario',
      brideName: 'Marlene',
      groomName: 'Mario',
      weddingDate: new Date('2025-09-15'),
      location: 'Schloss Neuschwanstein, Bayern',
      story: 'Wir haben uns 2020 kennengelernt und wissen seitdem, dass wir füreinander bestimmt sind.',
      isPublished: true,
      userId: testUser.id,
      templateId: 'classic-elegant'
    }
  })

  console.log('✅ Test-Hochzeit erstellt:', testWedding.slug)
}

createTestWedding()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect())
