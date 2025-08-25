import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import PhotoUpload from '@/components/PhotoUpload'
import PhotoGallery from '@/components/PhotoGallery'

async function getUserWedding(userId: string) {
  return await prisma.wedding.findFirst({
    where: {
      userId: userId
    },
    select: {
      id: true,
      brideName: true,
      groomName: true,
      slug: true,
      _count: {
        select: {
          photos: true
        }
      }
    }
  })
}

export default async function PhotosPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const wedding = await getUserWedding(session.user.id)

  if (!wedding) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Fotos verwalten</h1>
                <p className="text-gray-600">Lade Fotos hoch und verwalte deine Galerie</p>
              </div>
              <Link 
                href="/dashboard"
                className="px-4 py-2 text-purple-600 hover:text-purple-800"
              >
                ← Zurück zum Dashboard
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="text-4xl mb-4">�</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Noch keine Hochzeit erstellt
            </h2>
            <p className="text-gray-600 mb-6">
              Du musst zuerst eine Hochzeit erstellen, bevor du Fotos hochladen kannst.
            </p>
            
            <Link
              href="/dashboard/create"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Hochzeit erstellen
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fotos verwalten</h1>
              <p className="text-gray-600">
                {wedding.brideName} & {wedding.groomName} • {wedding._count.photos} Fotos
              </p>
            </div>
            <div className="flex gap-4">
              <Link 
                href={`/${wedding.slug}`}
                target="_blank"
                className="px-4 py-2 text-purple-600 hover:text-purple-800"
              >
                Seite ansehen ↗
              </Link>
              <Link 
                href="/dashboard"
                className="px-4 py-2 text-purple-600 hover:text-purple-800"
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Neue Fotos hochladen
          </h2>
          <PhotoUpload 
            weddingId={wedding.id}
          />
        </div>

        {/* Gallery Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Deine Foto-Galerie
            </h2>
            <span className="text-sm text-gray-500">
              {wedding._count.photos} Fotos
            </span>
          </div>
          
          <PhotoGallery 
            weddingId={wedding.id}
            editable={true}
          />
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
          <h3 className="font-semibold text-purple-800 mb-3">
            💡 Tipps für schöne Hochzeitsfotos
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-700">
            <div>
              <h4 className="font-medium mb-2">📸 Beste Fotos auswählen:</h4>
              <ul className="space-y-1">
                <li>• Emotionale Momente (Kuss, Ringe, Tränen)</li>
                <li>• Gruppenfoto mit Familie/Freunden</li>
                <li>• Location/Dekoration Impressionen</li>
                <li>• Candid-Shots beim Feiern</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🎨 Technische Tipps:</h4>
              <ul className="space-y-1">
                <li>• Helligkeit und Kontrast prüfen</li>
                <li>• Hochauflösende Originalbilder verwenden</li>
                <li>• Querformat bevorzugen (16:9 oder 4:3)</li>
                <li>• 5-15 Fotos für optimale Galerie</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
