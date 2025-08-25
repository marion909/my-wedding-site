import { prisma } from '@/lib/prisma'

export type SubscriptionStatus = 'free' | 'premium' | 'cancelled'

export interface SubscriptionLimits {
  maxPhotos: number
  hasAds: boolean
  hasAnalytics: boolean
  hasPrioritySupport: boolean
}

export function getSubscriptionLimits(status: SubscriptionStatus): SubscriptionLimits {
  switch (status) {
    case 'free':
      return {
        maxPhotos: 20,
        hasAds: true,
        hasAnalytics: false,
        hasPrioritySupport: false,
      }
    case 'premium':
      return {
        maxPhotos: -1, // Unlimited
        hasAds: false,
        hasAnalytics: true,
        hasPrioritySupport: true,
      }
    case 'cancelled':
      return {
        maxPhotos: 20,
        hasAds: true,
        hasAnalytics: false,
        hasPrioritySupport: false,
      }
    default:
      return {
        maxPhotos: 20,
        hasAds: true,
        hasAnalytics: false,
        hasPrioritySupport: false,
      }
  }
}

export async function getUserSubscription(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
      subscriptionId: true,
      currentPeriodEnd: true,
      cancelAtPeriodEnd: true,
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const limits = getSubscriptionLimits(user.subscriptionStatus as SubscriptionStatus)
  
  // Check if subscription has expired
  const now = new Date()
  const isExpired = user.currentPeriodEnd ? now > user.currentPeriodEnd : false
  
  return {
    status: isExpired ? 'free' : user.subscriptionStatus as SubscriptionStatus,
    subscriptionId: user.subscriptionId,
    currentPeriodEnd: user.currentPeriodEnd,
    cancelAtPeriodEnd: user.cancelAtPeriodEnd,
    isExpired,
    limits: isExpired ? getSubscriptionLimits('free') : limits,
  }
}

export async function updateUserSubscription(
  userId: string, 
  subscriptionData: {
    status: SubscriptionStatus
    subscriptionId?: string
    currentPeriodEnd?: Date
    cancelAtPeriodEnd?: boolean
  }
) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: subscriptionData.status,
      subscriptionId: subscriptionData.subscriptionId,
      currentPeriodEnd: subscriptionData.currentPeriodEnd,
      cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd ?? false,
    }
  })
}

// Helper function to check if user can upload more photos
export async function canUploadPhotos(userId: string, currentPhotoCount: number): Promise<boolean> {
  const subscription = await getUserSubscription(userId)
  
  if (subscription.limits.maxPhotos === -1) {
    return true // Unlimited
  }
  
  return currentPhotoCount < subscription.limits.maxPhotos
}

// Helper function to check if user should see ads
export async function shouldShowAds(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId)
  return subscription.limits.hasAds
}
