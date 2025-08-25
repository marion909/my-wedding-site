import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createPortalSession } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's Stripe customer ID from database
    // This would require querying your user database
    const customerId = 'cus_example' // Replace with actual customer ID lookup
    
    if (!customerId) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
    }

    const baseUrl = req.nextUrl.origin
    const returnUrl = `${baseUrl}/dashboard`

    const { url } = await createPortalSession(customerId, returnUrl)

    return NextResponse.json({ url })
    
  } catch (error) {
    console.error('Portal session error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' }, 
      { status: 500 }
    )
  }
}
