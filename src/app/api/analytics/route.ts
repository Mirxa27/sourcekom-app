import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'

    // Calculate date range based on timeRange
    const now = new Date()
    let startDate = new Date()

    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get total revenue from purchases
    const totalRevenue = await db.purchase.aggregate({
      where: {
        createdAt: {
          gte: startDate
        },
        paymentStatus: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    })

    // Get active resources count
    const activeResources = await db.resource.count({
      where: {
        isPublished: true,
        createdAt: {
          gte: startDate
        }
      }
    })

    // Get total downloads
    const totalDownloads = await db.resource.aggregate({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _sum: {
        downloadCount: true
      }
    })

    // Get active users (users with purchases or resources)
    const activeUsers = await db.user.count({
      where: {
        OR: [
          {
            purchases: {
              some: {
                createdAt: {
                  gte: startDate
                }
              }
            }
          },
          {
            resources: {
              some: {
                createdAt: {
                  gte: startDate
                }
              }
            }
          }
        ]
      }
    })

    // Get category performance
    const categoryPerformance = await db.category.findMany({
      include: {
        resources: {
          where: {
            isPublished: true,
            createdAt: {
              gte: startDate
            }
          },
          include: {
            purchases: {
              where: {
                paymentStatus: 'COMPLETED'
              }
            }
          }
        }
      }
    })

    // Calculate category metrics
    const categoryStats = categoryPerformance.map(category => {
      const categoryRevenue = category.resources.reduce((sum, resource) => {
        const resourceRevenue = resource.purchases.reduce((resourceSum, purchase) => {
          return resourceSum + purchase.amount
        }, 0)
        return sum + resourceRevenue
      }, 0)

      const categoryDownloads = category.resources.reduce((sum, resource) => {
        return sum + resource.downloadCount
      }, 0)

      return {
        name: category.name,
        revenue: `SAR ${categoryRevenue.toLocaleString()}`,
        downloads: categoryDownloads,
        growth: `+${Math.floor(Math.random() * 25) + 5}%` // Mock growth data
      }
    })

    // Get recent activity
    const recentPurchases = await db.purchase.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true
          }
        },
        resource: {
          select: {
            title: true
          }
        }
      }
    })

    const recentActivity = recentPurchases.map(purchase => ({
      id: purchase.id,
      type: 'download',
      resource: purchase.resource.title,
      user: purchase.user.name,
      time: formatTimeAgo(purchase.createdAt),
      amount: `SAR ${purchase.amount}`
    }))

    // Get top performing resources
    const topResources = await db.resource.findMany({
      take: 5,
      where: {
        isPublished: true,
        createdAt: {
          gte: startDate
        }
      },
      include: {
        purchases: {
          where: {
            paymentStatus: 'COMPLETED'
          }
        }
      },
      orderBy: {
        purchases: {
          _count: 'desc'
        }
      }
    })

    const topPerformingResources = topResources.map(resource => {
      const revenue = resource.purchases.reduce((sum, purchase) => sum + purchase.amount, 0)
      return {
        title: resource.title,
        revenue: `SAR ${revenue.toLocaleString()}`
      }
    })

    const analytics = {
      revenue: `SAR ${(totalRevenue._sum.amount || 0).toLocaleString()}`,
      activeResources,
      downloads: totalDownloads._sum.downloadCount || 0,
      activeUsers,
      categoryPerformance: categoryStats,
      recentActivity,
      topPerformingResources,
      timeRange
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }
}