import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  comment: z.string().max(1000, 'Comment must not exceed 1000 characters').optional()
})

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

// GET - Fetch reviews for a resource
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const resource = await db.resource.findUnique({
      where: { slug: params.slug }
    })

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    const skip = (page - 1) * limit

    const [reviews, total] = await Promise.all([
      db.review.findMany({
        where: { resourceId: resource.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.review.count({
        where: { resourceId: resource.id }
      })
    ])

    const averageRating = await db.review.aggregate({
      where: { resourceId: resource.id },
      _avg: { rating: true }
    })

    return NextResponse.json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      },
      averageRating: averageRating._avg.rating ? parseFloat(averageRating._avg.rating.toFixed(1)) : 0,
      totalReviews: total
    })

  } catch (error) {
    console.error('Failed to fetch reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string, reviewId: string } }
) {
  try {
    const auth = await verifyAuth(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const review = await db.review.findUnique({
      where: { id: params.reviewId },
    })

    if (!review || review.userId !== auth.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = reviewSchema.parse(body)

    const updatedReview = await db.review.update({
      where: { id: params.reviewId },
      data: validatedData,
    })

    return NextResponse.json({ review: updatedReview })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string, reviewId: string } }
) {
  try {
    const auth = await verifyAuth(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const review = await db.review.findUnique({
      where: { id: params.reviewId },
    })

    if (!review || review.userId !== auth.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await db.review.delete({
      where: { id: params.reviewId },
    })

    return NextResponse.json({ message: 'Review deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}

// POST - Create a review
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const auth = await verifyAuth(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const resource = await db.resource.findUnique({
      where: { slug: params.slug }
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

    // Check if user has purchased this resource (for verified reviews)
    const purchase = await db.purchase.findFirst({
      where: {
        userId: auth.userId!,
        resourceId: resource.id,
        paymentStatus: 'COMPLETED'
      }
    })

    const body = await request.json()
    const validatedData = reviewSchema.parse(body)

    // Check if user already reviewed this resource
    const existingReview = await db.review.findUnique({
      where: {
        userId_resourceId: {
          userId: auth.userId!,
          resourceId: resource.id
        }
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this resource' },
        { status: 409 }
      )
    }

    // Create review
    const review = await db.review.create({
      data: {
        userId: auth.userId!,
        resourceId: resource.id,
        rating: validatedData.rating,
        comment: validatedData.comment || null,
        isVerified: !!purchase // Verified if user has purchased
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    // Update resource rating statistics
    const allReviews = await db.review.findMany({
      where: { resourceId: resource.id },
      select: { rating: true }
    })

    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    await db.resource.update({
      where: { id: resource.id },
      data: {
        rating: parseFloat(averageRating.toFixed(1)),
        ratingCount: allReviews.length
      }
    })

    return NextResponse.json({
      message: 'Review submitted successfully',
      review
    }, { status: 201 })

  } catch (error) {
    console.error('Failed to create review:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
