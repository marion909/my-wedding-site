interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'purple' | 'white' | 'gray'
}

export default function LoadingSpinner({ size = 'md', color = 'purple' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }
  
  const colorClasses = {
    purple: 'text-purple-600',
    white: 'text-white',
    gray: 'text-gray-600'
  }
  
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]} ${colorClasses[color]}`}>
      </div>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  )
}

export function LoadingButton() {
  return (
    <button disabled className="btn-primary opacity-50 cursor-not-allowed flex items-center gap-2">
      <LoadingSpinner size="sm" color="white" />
      Lädt...
    </button>
  )
}
