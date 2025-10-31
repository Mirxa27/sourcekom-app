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

    // Calculate category metrics with real growth calculation
    const previousPeriodStart = new Date(startDate)
    const periodDays = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    previousPeriodStart.setDate(previousPeriodStart.getDate() - periodDays)
    
    // Get previous period category performance for growth calculation
    const previousCategoryPerformance = await db.category.findMany({
      include: {
        resources: {
          where: {
            isPublished: true,
            createdAt: {
              gte: previousPeriodStart,
              lt: startDate
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

    const previousRevenueMap = new Map<string, number>()
    previousCategoryPerformance.forEach(category => {
      const revenue = category.resources.reduce((sum, resource) => {
        return sum + resource.purchases.reduce((resourceSum, purchase) => {
          return resourceSum + purchase.amount
        }, 0)
      }, 0)
      previousRevenueMap.set(category.id, revenue)
    })

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

      // Calculate real growth percentage
      const previousRevenue = previousRevenueMap.get(category.id) || 0
      let growth = '0%'
      if (previousRevenue > 0) {
        const growthPercent = ((categoryRevenue - previousRevenue) / previousRevenue) * 100
        growth = `${growthPercent >= 0 ? '+' : ''}${growthPercent.toFixed(1)}%`
      } else if (categoryRevenue > 0) {
        growth = '+100%' // New category with revenue
      }

      return {
        name: category.name,
        revenue: `SAR ${categoryRevenue.toLocaleString()}`,
        downloads: categoryDownloads,
        growth: growth
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
        revenue: parseFloat(revenue.toFixed(2)),
        revenueFormatted: `SAR ${revenue.toLocaleString()}`
      }
    })

    // Get time-series revenue data for charts (optimized batch query)
    const daysInRange = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
    
    // Batch query all purchases in range
    const allPurchases = await db.purchase.findMany({
      where: {
        createdAt: {
          gte: startDate
        },
        paymentStatus: 'COMPLETED'
      },
      select: {
        amount: true,
        createdAt: true
      }
    })

    // Batch query all users in range
    const allUsers = await db.user.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      select: {
        createdAt: true
      }
    })

    // Aggregate data by day
    const revenueDataMap = new Map<string, number>()
    const userGrowthDataMap = new Map<string, number>()

    // Initialize all days with 0
    for (let i = 0; i < daysInRange; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateKey = date.toISOString().split('T')[0]
      revenueDataMap.set(dateKey, 0)
      userGrowthDataMap.set(dateKey, 0)
    }

    // Aggregate purchases by day
    allPurchases.forEach(purchase => {
      const dateKey = purchase.createdAt.toISOString().split('T')[0]
      const current = revenueDataMap.get(dateKey) || 0
      revenueDataMap.set(dateKey, current + purchase.amount)
    })

    // Aggregate users by day
    allUsers.forEach(user => {
      const dateKey = user.createdAt.toISOString().split('T')[0]
      const current = userGrowthDataMap.get(dateKey) || 0
      userGrowthDataMap.set(dateKey, current + 1)
    })

    // Convert maps to arrays
    const revenueData = Array.from(revenueDataMap.entries()).map(([date, revenue]) => ({
      date,
      revenue
    })).sort((a, b) => a.date.localeCompare(b.date))

    const userGrowthData = Array.from(userGrowthDataMap.entries()).map(([date, users]) => ({
      date,
      users
    })).sort((a, b) => a.date.localeCompare(b.date))

    const analytics = {
      revenue: `SAR ${(totalRevenue._sum.amount || 0).toLocaleString()}`,
      revenueRaw: totalRevenue._sum.amount || 0,
      activeResources,
      downloads: totalDownloads._sum.downloadCount || 0,
      activeUsers,
      categoryPerformance: categoryStats,
      recentActivity,
      topPerformingResources,
      revenueData,
      userGrowthData,
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