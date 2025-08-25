import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Templates erstellen
  const templates = [
    {
      id: 'classic-elegant',
      name: 'Klassisch Elegant',
      description: 'Zeitlos schön in Gold und Weiß',
      previewImage: '/templates/classic-elegant.jpg',
      cssFile: '/templates/classic-elegant.css'
    },
    {
      id: 'rustic-romantic',
      name: 'Rustikal Romantisch',
      description: 'Natürlich und warm',
      previewImage: '/templates/rustic-romantic.jpg',
      cssFile: '/templates/rustic-romantic.css'
    },
    {
      id: 'modern-minimal',
      name: 'Modern Minimalistisch',
      description: 'Klar und elegant',
      previewImage: '/templates/modern-minimal.jpg',
      cssFile: '/templates/modern-minimal.css'
    },
    {
      id: 'vintage-boho',
      name: 'Vintage Boho',
      description: 'Verspielt und romantisch',
      previewImage: '/templates/vintage-boho.jpg',
      cssFile: '/templates/vintage-boho.css'
    }
  ]

  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.id },
      update: template,
      create: template
    })
  }

  console.log('✅ Templates erstellt')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
