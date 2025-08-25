import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { handleSubscriptionWebhook } from '@/lib/stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' }, 
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' }, 
        { status: 400 }
      )
    }

    // Handle the webhook event
    await handleSubscriptionWebhook(event)

    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Webhook handling error:', error)
    return NextResponse.json(
      { error: 'Webhook handling failed' }, 
      { status: 500 }
    )
  }
}
