import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  fileUrl: z.string().url('Invalid URL'),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Find resource by slug
    const resource = await db.resource.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    })

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    if (!resource.isPublished) {
      return NextResponse.json(
        { error: 'Resource not available' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const reviews = await db.review.findMany({
      where: { resourceId: resource.id },
      select: { rating: true }
    })

    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0

    // Increment view count
    await db.resource.update({
      where: { id: resource.id },
      data: { viewCount: { increment: 1 } }
    })

    const resourceWithRating = {
      ...resource,
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviewCount: reviews.length
    }

    return NextResponse.json(resourceWithRating)

  } catch (error) {
    console.error('Failed to fetch resource:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    const body = await request.json()
    const validation = resourceSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      )
    }

    const resource = await db.resource.findUnique({
      where: { slug: params.slug },
    })

    if (!resource || resource.authorId !== decoded.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updatedResource = await db.resource.update({
      where: { slug: params.slug },
      data: validation.data,
    })

    return NextResponse.json({ resource: updatedResource })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    const resource = await db.resource.findUnique({
      where: { slug: params.slug },
    })

    if (!resource || resource.authorId !== decoded.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await db.resource.delete({
      where: { slug: params.slug },
    })

    return NextResponse.json({ message: 'Resource deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 })
  }
}
