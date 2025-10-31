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
    const existingFavorite = await db.favorite.findUnique({
      where: {
        userId_resourceId: {
          userId: auth.userId!,
          resourceId: resource.id
        }
      }
    })

    if (action === 'favorite') {
      if (existingFavorite) {
        return NextResponse.json({ message: 'Already favorited', favorited: true })
      }

      await db.$transaction([
        db.favorite.create({
          data: {
            userId: auth.userId!,
            resourceId: resource.id
          }
        }),
        db.resource.update({
          where: { id: resource.id },
          data: { wishlistCount: { increment: 1 } }
        })
      ])

      return NextResponse.json({ message: 'Resource favorited successfully', favorited: true })
    } else {
      if (!existingFavorite) {
        return NextResponse.json({ message: 'Not in favorites', favorited: false })
      }

      await db.$transaction([
        db.favorite.delete({
          where: {
            userId_resourceId: {
              userId: auth.userId!,
              resourceId: resource.id
            }
          }
        }),
        db.resource.update({
          where: { id: resource.id },
          data: { wishlistCount: { decrement: 1 } }
        })
      ])

      return NextResponse.json({ message: 'Resource unfavorited successfully', favorited: false })
    }
  } catch (error: any) {
    // If Favorite model is not migrated yet, signal configuration error clearly
    if (error?.code === 'P2021' || /favorites/i.test(String(error?.message))) {
      return NextResponse.json({ error: 'Favorites feature not available (database migration pending).' }, { status: 503 })
    }
    return NextResponse.json({ error: 'Failed to update favorite status' }, { status: 500 })
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

    const existing = await db.favorite.findFirst({
      where: { userId: auth.userId!, resourceId: resource.id }
    })
    return NextResponse.json({ favorited: !!existing })
  } catch (error: any) {
    if (error?.code === 'P2021' || /favorites/i.test(String(error?.message))) {
      return NextResponse.json({ favorited: false })
    }
    return NextResponse.json({ favorited: false })
  }
}

