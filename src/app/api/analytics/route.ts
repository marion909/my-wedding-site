import { NextRequest, NextResponse } from 'next/server'
import { trackEvent } from '@/lib/analytics'

export async function POST(request: NextRequest) {
  try {
    const event = await request.json()
    await trackEvent(event)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}
