import { NextResponse } from 'next/server'

/**
 * Health Check API Endpoint
 * 
 * Used by the Network Manager to check connectivity and application health
 * Returns basic status information about the application
 */
export async function GET() {
  try {
    const timestamp = new Date().toISOString()
    const uptime = process.uptime()
    
    // Basic health check response
    const healthData = {
      status: 'ok',
      timestamp,
      uptime: Math.floor(uptime),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'Health check failed'
      },
      { status: 500 }
    )
  }
}

/**
 * Handle HEAD requests for lightweight connectivity checks
 */
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}