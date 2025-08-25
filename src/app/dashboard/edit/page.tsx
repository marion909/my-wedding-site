import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import WeddingEditor from '@/components/WeddingEditor'

async function getUserWedding(userId: string) {
  return await prisma.wedding.findFirst({
    where: {
      userId: userId
    },
    include: {
      photos: {
        orderBy: {
          sortOrder: 'asc'
        }
      },
      rsvps: true,
      template: true
    }
  })
}

export default async function EditPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const wedding = await getUserWedding(session.user.id)

  if (!wedding) {
    redirect('/dashboard/create')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hochzeit bearbeiten</h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-gray-600">
                  {wedding.brideName} & {wedding.groomName}
                </p>
                <span className="text-gray-300">•</span>
                {wedding.isPublished ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    🟢 Live
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    📝 Entwurf
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <Link 
                href={`/${wedding.slug}`}
                target="_blank"
                className="px-4 py-2 text-purple-600 hover:text-purple-800"
              >
                Vorschau ansehen ↗
              </Link>
              <Link 
                href="/dashboard"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                ← Zurück zum Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WeddingEditor wedding={wedding} />
      </div>
    </div>
  )
}
