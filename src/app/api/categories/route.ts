import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Validation schema for creating categories
const categorySchema = z.object({
  name: z.string()
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Category name contains invalid characters'),
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  slug: z.string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must not exceed 50 characters')
    .regex(/^[a-z0-9\-_]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color')
    .optional(),
  icon: z.string()
    .max(100, 'Icon name too long')
    .optional()
})

// Query parameters schema
const querySchema = z.object({
  page: z.coerce.number().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce.number().min(1).max(50, 'Limit must be between 1 and 50').default(20),
  search: z.string().max(50, 'Search term too long').optional(),
  sort: z.enum(['name', 'resources', 'created']).default('name'),
  includeInactive: z.coerce.boolean().optional()
})

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Helper function to ensure unique slug
async function getUniqueSlug(name: string): Promise<string> {
  let slug = generateSlug(name)
  let counter = 1
  
  while (await db.category.findUnique({ where: { slug } })) {
    slug = `${generateSlug(name)}-${counter}`
    counter++
  }
  
  return slug
}

export async function GET(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    
    // Rate limiting
    if (!checkRateLimit(clientIP, 200, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    
    const validatedQuery = querySchema.parse(queryParams)
    const { page, limit, search, sort, includeInactive } = validatedQuery

    // Build where clause
    const where: any = {}
    if (!includeInactive) {
      where.isActive = true
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    }

    // Build order by clause
    let orderBy: any = {}
    switch (sort) {
      case 'resources':
        orderBy = { resourcesCount: 'desc' }
        break
      case 'created':
        orderBy = { createdAt: 'desc' }
        break
      default:
        orderBy = { name: 'asc' }
    }

    // Get total count for pagination
    const total = await db.category.count({ where })

    // Get categories with pagination
    const categories = await db.category.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: {
          select: {
            resources: {
              where: {
                isPublished: true
              }
            }
          }
        }
      }
    })

    // Format response
    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      icon: category.icon,
      isActive: category.isActive,
      resourceCount: category._count.resources,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }))

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      categories: formattedCategories,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage
      }
    })

  } catch (error) {
    console.error('Categories fetch error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    
    // Rate limiting for POST requests (stricter)
    if (!checkRateLimit(clientIP, 5, 60000)) {
      return NextResponse.json(
        { error: 'Too many category creation requests' },
        { status: 429 }
      )
    }

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
        { error: 'Invalid or expired token' },
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

    // Check if user is admin
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can create categories' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const validatedData = categorySchema.parse(body)

    // Check for duplicate names (case insensitive)
    const existingCategory = await db.category.findFirst({
      where: {
        name: {
          equals: validatedData.name
        }
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      )
    }

    // Check for duplicate slugs
    const existingSlug = await db.category.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingSlug) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 409 }
      )
    }

    // Generate unique slug if not provided or if duplicate
    const slug = existingSlug ? await getUniqueSlug(validatedData.name) : validatedData.slug

    // Create category
    const category = await db.category.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description || null,
        color: validatedData.color || null,
        icon: validatedData.icon || null,
        isActive: true
      }
    })

    return NextResponse.json({
      message: 'Category created successfully',
      category
    })

  } catch (error) {
    console.error('Category creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        },
        { status: 400 }
      )
    }

    // Handle Prisma specific errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Category with these details already exists' },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to create category. Please try again.' },
      { status: 500 }
    )
  }
}