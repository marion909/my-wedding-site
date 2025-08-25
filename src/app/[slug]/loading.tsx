import LoadingSpinner from '@/components/LoadingSpinner'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Hochzeitsseite wird geladen...</p>
      </div>
    </div>
  )
}
