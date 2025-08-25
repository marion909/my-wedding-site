// Stripe payment integration for subscription management
import Stripe from 'stripe'

// Safe Stripe initialization with fallback for development
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_development_fallback'

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-07-30.basil',
})

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  stripePriceId: string
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Tier',
    price: 0,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Hochzeitswebsite erstellen',
      'Bis zu 10 Fotos hochladen',
      'Gäste können zusagen/absagen',
      'Werbung wird angezeigt',
    ],
    stripePriceId: '',
  },
  {
    id: 'premium',
    name: 'Premium Tier',
    price: 5,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Unbegrenzte Fotos hochladen',
      'Keine Werbung',
      'Erweiterte Designoptionen',
      'Gästebuch & Kommentare',
      'Download aller Hochzeitsfotos',
      'Premium Support',
    ],
    stripePriceId: process.env.STRIPE_PRICE_ID_PREMIUM || 'price_1234567890',
  },
]

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: undefined, // Will be filled from user data
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      automatic_tax: {
        enabled: true,
      },
    })

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw new Error('Failed to create checkout session')
  }
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return { url: session.url }
  } catch (error) {
    console.error('Error creating portal session:', error)
    throw new Error('Failed to create portal session')
  }
}

export async function handleSubscriptionWebhook(event: Stripe.Event) {
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        await handleSuccessfulPayment(session)
        break
        
      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice
        await handleSuccessfulPayment(invoice)
        break
        
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription
        await updateSubscriptionStatus(subscription)
        break
        
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        await cancelSubscription(deletedSubscription)
        break
        
      default:
        console.log(`Unhandled event type ${event.type}`)
    }
  } catch (error) {
    console.error('Webhook handling error:', error)
    throw error
  }
}

async function handleSuccessfulPayment(
  sessionOrInvoice: Stripe.Checkout.Session | Stripe.Invoice
) {
  const customerId = sessionOrInvoice.customer as string
  let subscriptionId: string | null = null
  
  // Handle different object types
  if ('subscription' in sessionOrInvoice && sessionOrInvoice.subscription) {
    subscriptionId = sessionOrInvoice.subscription as string
  }
  
  // Get user ID from metadata or customer
  const userId = sessionOrInvoice.metadata?.userId
  
  if (!userId) {
    console.error('No user ID found in payment metadata')
    return
  }

  // Update user subscription status in database
  // This would integrate with your user database (Prisma)
  /*
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: 'active',
      subscriptionId,
      stripeCustomerId: customerId,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  })
  */
}

async function updateSubscriptionStatus(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  
  // Find user by customer ID and update subscription
  /*
  await prisma.user.updateMany({
    where: { stripeCustomerId: customerId },
    data: {
      subscriptionStatus: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  })
  */
}

async function cancelSubscription(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  
  // Update user subscription to cancelled
  /*
  await prisma.user.updateMany({
    where: { stripeCustomerId: customerId },
    data: {
      subscriptionStatus: 'cancelled',
      cancelAtPeriodEnd: true,
    },
  })
  */
}
