import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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