import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createCheckoutSession, SUBSCRIPTION_PLANS } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('sk_test_development_fallback')) {
      return NextResponse.json(
        { error: 'Stripe not configured. Please add STRIPE_SECRET_KEY to your environment variables.' }, 
        { status: 503 }
      )
    }

    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId } = await req.json()
    
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)
    if (!plan || plan.id === 'free') {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const baseUrl = req.nextUrl.origin
    const successUrl = `${baseUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/pricing?canceled=true`

    const { sessionId, url } = await createCheckoutSession(
      session.user.id,
      plan.stripePriceId,
      successUrl,
      cancelUrl
    )

    return NextResponse.json({ 
      sessionId, 
      url,
      checkoutUrl: url 
    })
    
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' }, 
      { status: 500 }
    )
  }
}
