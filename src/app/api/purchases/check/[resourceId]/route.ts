import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(
  request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  try {
    const { resourceId } = params

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Verify token
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Check if user has purchased this resource
    const purchase = await db.purchase.findFirst({
      where: {
        userId: decoded.userId,
        resourceId: resourceId,
        paymentStatus: 'COMPLETED'
      }
    })

    // Also check if user is the author
    const resource = await db.resource.findUnique({
      where: { id: resourceId },
      select: { authorId: true, isFree: true }
    })

    const isAuthor = resource?.authorId === decoded.userId
    const isFree = resource?.isFree || false

    return NextResponse.json({
      purchased: !!purchase || isAuthor || isFree,
      isAuthor,
      isFree,
      purchase: purchase ? {
        id: purchase.id,
        createdAt: purchase.createdAt,
        downloadUrl: purchase.downloadUrl,
        downloadExpires: purchase.downloadExpires
      } : null
    })

  } catch (error) {
    console.error('Purchase check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}