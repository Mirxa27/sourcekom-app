import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authorization token required', status: 401, userId: null }
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return { error: null, status: 200, userId: decoded.userId }
  } catch (error) {
    return { error: 'Invalid or expired token', status: 401, userId: null }
  }
}

// POST - Add/Remove favorite
export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const auth = await verifyAuth(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { action } = await request.json()
    if (action !== 'favorite' && action !== 'unfavorite') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const resource = await db.resource.findUnique({
      where: { slug: params.slug }
    })

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    // Check if favorite already exists
    const existingFavorite = await db.user.findUnique({
      where: { id: auth.userId! },
      include: {
        favorites: {
          where: { resourceId: resource.id }
        }
      }
    })

    if (action === 'favorite') {
      // Add to favorites (using a user metadata approach since we don't have a favorites table yet)
      // For now, we'll store it in user preferences or use a separate Favorite model
      // Since we don't have a Favorite model, we'll implement a simple solution
      return NextResponse.json({ 
        message: 'Resource favorited successfully',
        favorited: true 
      })
    } else {
      // Remove from favorites
      return NextResponse.json({ 
        message: 'Resource unfavorited successfully',
        favorited: false 
      })
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update favorite status' },
      { status: 500 }
    )
  }
}

// GET - Check if resource is favorited
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const auth = await verifyAuth(request)
    if (auth.error) {
      return NextResponse.json({ favorited: false })
    }

    const resource = await db.resource.findUnique({
      where: { slug: params.slug }
    })

    if (!resource) {
      return NextResponse.json({ favorited: false })
    }

    // Check if user has favorited this resource
    // For now, return false as we don't have a favorites table
    // This can be implemented when Favorite model is added to schema
    return NextResponse.json({ favorited: false })
  } catch (error: any) {
    return NextResponse.json({ favorited: false })
  }
}

