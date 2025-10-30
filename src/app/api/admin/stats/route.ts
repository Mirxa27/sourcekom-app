import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Auth middleware
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authorization token required', status: 401, user: null }
  }

  const token = authHeader.substring(7)
  let decoded: any
  try {
    decoded = jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return { error: 'Invalid or expired token', status: 401, user: null }
  }

  const user = await db.user.findUnique({
    where: { id: decoded.userId }
  })

  if (!user || !user.isActive || user.role !== 'ADMIN') {
    return { error: 'Admin access required', status: 403, user: null }
  }

  return { error: null, status: 200, user }
}

// GET admin dashboard stats
export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    // Get all stats
    const [
      totalUsers,
      totalResources,
      totalPurchases,
      totalRevenue,
      totalCategories,
      totalSupportTickets,
      totalContent,
      recentUsers,
      recentResources,
      recentPurchases,
      pendingTickets
    ] = await Promise.all([
      db.user.count(),
      db.resource.count({ where: { isPublished: true } }),
      db.purchase.count({ where: { paymentStatus: 'COMPLETED' } }),
      db.purchase.aggregate({
        where: { paymentStatus: 'COMPLETED' },
        _sum: { amount: true }
      }),
      db.category.count({ where: { isActive: true } }),
      db.supportTicket.count(),
      db.content.count(),
      db.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      }),
      db.resource.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          author: {
            select: {
              name: true,
              email: true
            }
          },
          category: {
            select: {
              name: true
            }
          }
        }
      }),
      db.purchase.findMany({
        where: { paymentStatus: 'COMPLETED' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          resource: {
            select: {
              title: true,
              slug: true
            }
          },
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),
      db.supportTicket.count({
        where: { status: { in: ['open', 'in_progress'] } }
      })
    ])

    // Calculate growth metrics (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [
      newUsers30d,
      newResources30d,
      revenue30d
    ] = await Promise.all([
      db.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      db.resource.count({
        where: {
          isPublished: true,
          createdAt: { gte: thirtyDaysAgo }
        }
      }),
      db.purchase.aggregate({
        where: {
          paymentStatus: 'COMPLETED',
          createdAt: { gte: thirtyDaysAgo }
        },
        _sum: { amount: true }
      })
    ])

    return NextResponse.json({
      stats: {
        totalUsers,
        totalResources,
        totalPurchases,
        totalRevenue: totalRevenue._sum.amount || 0,
        totalCategories,
        totalSupportTickets,
        totalContent,
        pendingTickets,
        growth: {
          newUsers30d,
          newResources30d,
          revenue30d: revenue30d._sum.amount || 0
        }
      },
      recent: {
        users: recentUsers,
        resources: recentResources,
        purchases: recentPurchases
      }
    })
  } catch (error: any) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
}
