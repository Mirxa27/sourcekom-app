import { NextRequest, NextResponse } from 'next/server'
import seedProductionData from '@/app/api/seed/production-seed-data'

export async function POST() {
  try {
    console.log('🚀 Starting production seed process...')
    
    const result = await seedProductionData()
    
    if (result.success) {
      return NextResponse.json({
        message: 'Production database seeded successfully',
        ...result.summary
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to seed production database', details: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Production seeding failed:', error)
    return NextResponse.json(
      { error: 'Internal server error during production seeding' },
      { status: 500 }
    )
  }
}