import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getRSVPs(userId: string, weddingId: string) {
  const rsvps = await prisma.rSVP.findMany({
    where: {
      wedding: {
        id: weddingId,
        userId: userId
      }
    },
    include: {
      wedding: {
        select: {
          brideName: true,
          groomName: true,
          weddingDate: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return rsvps
}

async function getUserWeddings(userId: string) {
  return await prisma.wedding.findMany({
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
          rsvps: true
        }
      }
    }
  })
}

export default async function RSVPPage({
  searchParams
}: {
  searchParams: Promise<{ wedding?: string }>
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const weddings = await getUserWeddings(session.user.id)
  const searchParamsResolved = await searchParams
  const selectedWeddingId = searchParamsResolved.wedding || weddings[0]?.id
  
  const rsvps = selectedWeddingId ? await getRSVPs(session.user.id, selectedWeddingId) : []
  
  const stats = {
    total: rsvps.length,
    attending: rsvps.filter((r: any) => r.attending).length,
    notAttending: rsvps.filter((r: any) => !r.attending).length,
    totalGuests: rsvps.filter((r: any) => r.attending).reduce((sum: number, r: any) => sum + r.guestCount, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">RSVP Management</h1>
              <p className="text-gray-600">Verwalte die Zusagen für deine Hochzeit</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Wedding Selection */}
        {weddings.length > 1 && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hochzeit auswählen:
            </label>
            <select
              value={selectedWeddingId || ''}
              onChange={(e) => {
                const url = new URL(window.location.href)
                url.searchParams.set('wedding', e.target.value)
                window.location.href = url.toString()
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {weddings.map((wedding: any) => (
                <option key={wedding.id} value={wedding.id}>
                  {wedding.brideName} & {wedding.groomName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Statistics */}
        {selectedWeddingId && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Antworten insgesamt</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-green-600">{stats.attending}</div>
                <div className="text-sm text-gray-600">Zusagen</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-red-600">{stats.notAttending}</div>
                <div className="text-sm text-gray-600">Absagen</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-purple-600">{stats.totalGuests}</div>
                <div className="text-sm text-gray-600">Gäste insgesamt</div>
              </div>
            </div>

            {/* RSVP List */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">RSVP Liste</h2>
              </div>
              
              {rsvps.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-4">📝</div>
                  <p>Noch keine RSVP-Antworten erhalten.</p>
                  <p className="text-sm mt-2">
                    Teile den Link zu deiner Hochzeitsseite, damit Gäste antworten können.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gast
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          E-Mail
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Anzahl
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nachricht
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Datum
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rsvps.map((rsvp: any) => (
                        <tr key={rsvp.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {rsvp.guestName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{rsvp.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              rsvp.attending 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {rsvp.attending ? '✅ Zusage' : '❌ Absage'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {rsvp.attending ? rsvp.guestCount : '-'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {rsvp.message || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(rsvp.createdAt).toLocaleDateString('de-DE')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {weddings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💒</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Noch keine Hochzeit erstellt
            </h2>
            <p className="text-gray-600 mb-6">
              Erstelle zuerst eine Hochzeit, um RSVP-Antworten zu verwalten.
            </p>
            <Link 
              href="/dashboard/create"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Hochzeit erstellen
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
