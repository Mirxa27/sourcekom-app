import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import jwt from 'jsonwebtoken'

// Enhanced validation schema with more constraints
const resourceSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .regex(/^[a-zA-Z0-9\s\-_.,!?()[\]{}]+$/, 'Title contains invalid characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  content: z.string()
    .max(50000, 'Content must not exceed 50000 characters')
    .optional(),
  price: z.number()
    .min(0, 'Price must be non-negative')
    .max(999999.99, 'Price must not exceed 999,999.99'),
  isFree: z.boolean(),
  isFeatured: z.boolean().default(false),
  categoryId: z.string()
    .min(1, 'Category is required')
    .regex(/^[a-zA-Z0-9\-]+$/, 'Invalid category ID format'),
  tags: z.array(z.string()
    .min(1, 'Tag cannot be empty')
    .max(50, 'Tag must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Tag contains invalid characters'))
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  fileUrl: z.string()
    .url('Invalid file URL format')
    .or(z.string().max(0))
    .optional(),
  fileUrl2: z.string()
    .url('Invalid file URL format')
    .or(z.string().max(0))
    .optional(),
  fileUrl3: z.string()
    .url('Invalid file URL format')
    .or(z.string().max(0))
    .optional(),
  previewUrl: z.string()
    .url('Invalid preview URL format')
    .or(z.string().max(0))
    .optional(),
  thumbnail: z.string()
    .url('Invalid thumbnail URL format')
    .or(z.string().max(0))
    .optional()
})

// Query parameters schema for GET requests
const querySchema = z.object({
  page: z.coerce.number().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce.number().min(1).max(100, 'Limit must be between 1 and 100').default(12),
  category: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  free: z.coerce.boolean().optional(),
  search: z.string().max(100, 'Search term too long').optional(),
  sort: z.enum(['newest', 'oldest', 'popular', 'price_low', 'price_high']).default('newest'),
  author: z.string().optional()
})

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Helper function to ensure unique slug
async function getUniqueSlug(title: string): Promise<string> {
  let slug = generateSlug(title)
  let counter = 1
  
  while (await db.resource.findUnique({ where: { slug } })) {
    slug = `${generateSlug(title)}-${counter}`
    counter++
  }
  
  return slug
}

// Rate limiting for API calls
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

// GET method for fetching resources with pagination and filtering
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
    const { page, limit, category, featured, free, search, sort, author } = validatedQuery

    // Build where clause
    const where: any = {
      isPublished: true,
      ...(category && { categoryId: category }),
      ...(featured !== undefined && { isFeatured: featured }),
      ...(free !== undefined && { isFree: free }),
      ...(author && { authorId: author }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
          { tags: { contains: search } }
        ]
      })
    }

    // Build order by clause
    let orderBy: any = { createdAt: 'desc' }
    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'popular':
        orderBy = { downloads: 'desc' }
        break
      case 'price_low':
        orderBy = { price: 'asc' }
        break
      case 'price_high':
        orderBy = { price: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Get total count for pagination
    const total = await db.resource.count({ where })

    // Get resources with pagination
    const resources = await db.resource.findMany({
      where,
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

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      resources,
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
    console.error('Resource fetch error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    
    // Rate limiting for POST requests (stricter)
    if (!checkRateLimit(clientIP, 10, 60000)) {
      return NextResponse.json(
        { error: 'Too many creation requests' },
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

    // Check if user is verified (if required)
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: 'Email verification required' },
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

    const validatedData = resourceSchema.parse(body)

    // Additional business logic validation
    if (validatedData.isFree && validatedData.price > 0) {
      return NextResponse.json(
        { error: 'Free resources cannot have a price greater than 0' },
        { status: 400 }
      )
    }

    if (!validatedData.isFree && validatedData.price === 0 && !validatedData.fileUrl) {
      return NextResponse.json(
        { error: 'Paid resources must have either a price or file URL' },
        { status: 400 }
      )
    }

    // Check if user can create featured resources
    if (validatedData.isFeatured && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can create featured resources' },
        { status: 403 }
      )
    }

    // Verify category exists and is active
    const category = await db.category.findUnique({
      where: { id: validatedData.categoryId }
    })

    if (!category || !category.isActive) {
      return NextResponse.json(
        { error: 'Invalid or inactive category' },
        { status: 400 }
      )
    }

    // Check for duplicate titles (case insensitive)
    const existingResource = await db.resource.findFirst({
      where: {
        title: {
          equals: validatedData.title
        }
      }
    })

    if (existingResource) {
      return NextResponse.json(
        { error: 'A resource with this title already exists' },
        { status: 409 }
      )
    }

    // Generate unique slug
    const slug = await getUniqueSlug(validatedData.title)

    // Validate URLs if provided
    const urlFields = ['fileUrl', 'fileUrl2', 'fileUrl3', 'previewUrl', 'thumbnail']
    for (const field of urlFields) {
      const url = validatedData[field as keyof typeof validatedData] as string
      if (url && url.length > 0) {
        try {
          new URL(url)
        } catch {
          return NextResponse.json(
            { error: `Invalid ${field} format` },
            { status: 400 }
          )
        }
      }
    }

    // Create resource with transaction
    const resource = await db.$transaction(async (tx) => {
      const newResource = await tx.resource.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          slug,
          content: validatedData.content,
          fileUrl: validatedData.fileUrl || null,
          fileUrl2: validatedData.fileUrl2 || null,
          fileUrl3: validatedData.fileUrl3 || null,
          previewUrl: validatedData.previewUrl || null,
          thumbnail: validatedData.thumbnail || null,
          price: validatedData.price,
          isFree: validatedData.isFree,
          isPublished: true,
          isFeatured: validatedData.isFeatured,
          tags: validatedData.tags && validatedData.tags.length > 0 
            ? JSON.stringify(validatedData.tags) 
            : null,
          authorId: user.id,
          categoryId: validatedData.categoryId
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
              purchases: true,
              reviews: true
            }
          }
        }
      })

      // Update category resource count
      await tx.category.update({
        where: { id: validatedData.categoryId },
        data: {
          updatedAt: new Date()
        }
      })

      return newResource
    })

    return NextResponse.json({
      message: 'Resource created successfully',
      resource
    })

  } catch (error) {
    console.error('Resource creation error:', error)
    
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
          { error: 'Resource with these details already exists' },
          { status: 409 }
        )
      }
      
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { error: 'Invalid category or author reference' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to create resource. Please try again.' },
      { status: 500 }
    )
  }
}