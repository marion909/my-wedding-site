import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  console.log('🔍 Überprüfe Datenbank...')
  
  const templates = await prisma.template.findMany()
  console.log('Templates:', templates.length)
  
  const users = await prisma.user.findMany()
  console.log('Users:', users.length)
  
  const weddings = await prisma.wedding.findMany()
  console.log('Weddings:', weddings.length)
  
  const targetWedding = await prisma.wedding.findUnique({
    where: { slug: 'marlene-und-mario' }
  })
  
  console.log('Target wedding found:', !!targetWedding)
  if (targetWedding) {
    console.log('Wedding details:', {
      slug: targetWedding.slug,
      isPublished: targetWedding.isPublished,
      brideName: targetWedding.brideName,
      groomName: targetWedding.groomName
    })
  }
}

checkDatabase()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect())
