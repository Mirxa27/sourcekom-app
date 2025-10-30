import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
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

    // Get user from database
    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      )
    }

    // Get user's resources
    const userResources = await db.resource.findMany({
      where: { authorId: user.id },
      include: {
        category: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            purchases: {
              where: {
                paymentStatus: 'COMPLETED'
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })

    // Get user's purchases
    const userPurchases = await db.purchase.findMany({
      where: { 
        userId: user.id,
        paymentStatus: 'COMPLETED'
      },
      include: {
        resource: {
          select: {
            id: true,
            title: true,
            description: true,
            slug: true,
            thumbnail: true,
            price: true,
            isFree: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })

    // Calculate stats
    const totalResources = userResources.length
    const totalDownloads = userResources.reduce((sum, resource) => sum + resource.downloadCount, 0)
    const totalPurchases = userPurchases.length
    const totalRevenue = userResources.reduce((sum, resource) => {
      const purchaseCount = resource._count.purchases
      return sum + (purchaseCount * resource.price)
    }, 0)

    return NextResponse.json({
      totalResources,
      totalDownloads,
      totalPurchases,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      recentResources: userResources.map(resource => ({
        id: resource.id,
        title: resource.title,
        description: resource.description,
        slug: resource.slug,
        price: resource.price,
        isFree: resource.isFree,
        downloadCount: resource.downloadCount,
        viewCount: resource.viewCount,
        createdAt: resource.createdAt,
        category: resource.category,
        purchaseCount: resource._count.purchases
      })),
      recentPurchases: userPurchases.map(purchase => ({
        id: purchase.id,
        amount: purchase.amount,
        paymentStatus: purchase.paymentStatus,
        createdAt: purchase.createdAt,
        resource: purchase.resource
      }))
    })

  } catch (error) {
    console.error('Dashboard data error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}