import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">💔</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Hochzeit nicht gefunden
        </h1>
        <p className="text-gray-600 mb-8">
          Die gesuchte Hochzeitsseite existiert leider nicht oder wurde entfernt.
        </p>
        <div className="space-y-4">
          <Link 
            href="/" 
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Zur Startseite
          </Link>
          <div>
            <Link 
              href="/auth/register" 
              className="text-purple-600 hover:text-purple-800 underline"
            >
              Eigene Hochzeitsseite erstellen
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
