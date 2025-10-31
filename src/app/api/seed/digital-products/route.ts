import { NextRequest, NextResponse } from 'next/server'
import seedDigitalProducts from '../digital-products'

export async function POST(request: NextRequest) {
  try {
    const result = await seedDigitalProducts()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Seed API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Digital products seeder endpoint. Use POST to seed the database.',
    endpoint: '/api/seed/digital-products',
    method: 'POST',
    timestamp: new Date().toISOString()
  })
}