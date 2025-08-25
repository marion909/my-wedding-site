import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateWedding() {
  const result = await prisma.wedding.update({
    where: { slug: 'marlene-und-mario' },
    data: { isPublished: true }
  })
  
  console.log('✅ Updated wedding to published:', result.isPublished)
  console.log('Wedding slug:', result.slug)
}

updateWedding()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect())
