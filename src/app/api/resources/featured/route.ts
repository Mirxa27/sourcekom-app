import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const featuredResources = await db.resource.findMany({
      where: {
        isPublished: true,
        isFeatured: true
      },
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
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 8
    })

    // Calculate average ratings for each resource
    const resourcesWithRatings = await Promise.all(
      featuredResources.map(async (resource) => {
        const reviews = await db.review.findMany({
          where: {
            resourceId: resource.id
          },
          select: {
            rating: true
          }
        })

        const averageRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
          : 0

        return {
          ...resource,
          averageRating: parseFloat(averageRating.toFixed(1)),
          reviewCount: reviews.length
        }
      })
    )

    return NextResponse.json(resourcesWithRatings)
  } catch (error) {
    console.error('Failed to fetch featured resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured resources' },
      { status: 500 }
    )
  }
}