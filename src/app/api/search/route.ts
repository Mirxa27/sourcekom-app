import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// Query parameters schema for search
const searchSchema = z.object({
  q: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
  type: z.enum(['all', 'resources', 'categories', 'users']).default('all'),
  category: z.string().optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  isFree: z.coerce.boolean().optional(),
  sort: z.enum(['relevance', 'newest', 'oldest', 'price_low', 'price_high', 'popular']).default('relevance'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20)
})

// Rate limiting for search
const searchRateLimit = new Map<string, { count: number; resetTime: number }>()

function checkSearchRateLimit(ip: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = searchRateLimit.get(ip)
  
  if (!record || now > record.resetTime) {
    searchRateLimit.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}

export async function GET(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    
    // Rate limiting
    if (!checkSearchRateLimit(clientIP, 100, 60000)) {
      return NextResponse.json(
        { error: 'Too many search requests' },
        { status: 429 }
      )
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    
    const validatedQuery = searchSchema.parse(queryParams)
    const { q, type, category, priceMin, priceMax, isFree, sort, page, limit } = validatedQuery

    const results: any = {
      query: q,
      type,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: false,
        hasPrevPage: page > 1,
        totalItems: 0,
        totalPages: 0
      }
    }

    // Search resources
    if (type === 'all' || type === 'resources') {
      const resourceWhere: any = {
        isPublished: true,
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { tags: { contains: q } },
          { content: { contains: q } }
        ]
      }

      if (category) {
        resourceWhere.categoryId = category
      }

      if (isFree !== undefined) {
        resourceWhere.isFree = isFree
      }

      if (priceMin !== undefined || priceMax !== undefined) {
        resourceWhere.price = {}
        if (priceMin !== undefined) resourceWhere.price.gte = priceMin
        if (priceMax !== undefined) resourceWhere.price.lte = priceMax
      }

      // Build order by clause
      let orderBy: any = {}
      switch (sort) {
        case 'newest':
          orderBy = { createdAt: 'desc' }
          break
        case 'oldest':
          orderBy = { createdAt: 'asc' }
          break
        case 'price_low':
          orderBy = { price: 'asc' }
          break
        case 'price_high':
          orderBy = { price: 'desc' }
          break
        case 'popular':
          orderBy = { downloadCount: 'desc' }
          break
        default: // relevance
          orderBy = [
            { isFeatured: 'desc' },
            { downloadCount: 'desc' },
            { createdAt: 'desc' }
          ]
      }

      const resourceTotal = await db.resource.count({ where: resourceWhere })
      const resources = await db.resource.findMany({
        where: resourceWhere,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
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
              purchases: true,
              reviews: true
            }
          }
        }
      })

      results.resources = {
        items: resources,
        total: resourceTotal,
        totalPages: Math.ceil(resourceTotal / limit)
      }

      results.pagination.totalItems += resourceTotal
    }

    // Search categories
    if (type === 'all' || type === 'categories') {
      const categoryWhere = {
        isActive: true,
        OR: [
          { name: { contains: q } },
          { description: { contains: q } }
        ]
      }

      const categories = await db.category.findMany({
        where: categoryWhere,
        include: {
          _count: {
            select: {
              resources: {
                where: { isPublished: true }
              }
            }
          }
        },
        orderBy: { name: 'asc' },
        take: 10 // Limit categories in search results
      })

      results.categories = {
        items: categories.map(cat => ({
          ...cat,
          resourceCount: cat._count.resources
        })),
        total: categories.length
      }

      results.pagination.totalItems += categories.length
    }

    // Search users (only for admin or specific contexts)
    if (type === 'users') {
      const userWhere = {
        isActive: true,
        OR: [
          { name: { contains: q } },
          { email: { contains: q } }
        ]
      }

      const users = await db.user.findMany({
        where: userWhere,
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              resources: {
                where: { isPublished: true }
              },
              purchases: {
                where: { paymentStatus: 'COMPLETED' }
              }
            }
          }
        },
        orderBy: { name: 'asc' },
        take: 10
      })

      results.users = {
        items: users,
        total: users.length
      }

      results.pagination.totalItems += users.length
    }

    // Calculate pagination
    results.pagination.totalPages = Math.ceil(results.pagination.totalItems / limit)
    results.pagination.hasNextPage = page < results.pagination.totalPages

    return NextResponse.json(results)

  } catch (error) {
    console.error('Search error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Search failed. Please try again.' },
      { status: 500 }
    )
  }
}