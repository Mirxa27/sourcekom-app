import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Enhanced validation schema for newsletter subscription
const newsletterSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(254, 'Email address too long')
    .refine(email => {
      // Additional validation for common disposable email domains
      const disposableDomains = ['tempmail.org', '10minutemail.com', 'guerrillamail.com']
      const domain = email.split('@')[1]?.toLowerCase()
      return !disposableDomains.some(disposable => domain?.includes(disposable))
    }, 'Disposable email addresses are not allowed'),
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Name contains invalid characters')
    .optional(),
  preferences: z.object({
    marketing: z.boolean().default(true),
    product_updates: z.boolean().default(true),
    legal_updates: z.boolean().default(false),
    newsletter: z.boolean().default(true)
  }).optional()
})

// Query parameters schema for GET requests
const querySchema = z.object({
  page: z.coerce.number().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce.number().min(1).max(100, 'Limit must be between 1 and 100').default(20),
  search: z.string().max(100, 'Search term too long').optional(),
  active: z.coerce.boolean().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional()
})

// Rate limiting for newsletter subscriptions
const subscriptionRateLimit = new Map<string, { count: number; resetTime: number }>()

function checkSubscriptionRateLimit(email: string, limit: number = 3, windowMs: number = 24 * 60 * 60 * 1000): boolean {
  const now = Date.now()
  const record = subscriptionRateLimit.get(email)
  
  if (!record || now > record.resetTime) {
    subscriptionRateLimit.set(email, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting based on IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = await rateLimit(ip, 5, 60 * 60 * 1000) // 5 requests per hour per IP
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many subscription attempts. Please try again later.' },
        { status: 429 }
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

    const validation = newsletterSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input', 
          details: validation.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        },
        { status: 400 }
      )
    }
    
    const { email, name, preferences } = validation.data

    // Apply email-based rate limiting
    if (!checkSubscriptionRateLimit(email.toLowerCase())) {
      return NextResponse.json(
        { error: 'Too many subscription attempts for this email. Please try again later.' },
        { status: 429 }
      )
    }

    // Check if email already exists
    const existingSubscription = await db.newsletterSubscription.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return NextResponse.json(
          { error: 'Email already subscribed' },
          { status: 409 }
        )
      } else {
        // Reactivate inactive subscription
        const reactivatedSubscription = await db.newsletterSubscription.update({
          where: { email: email.toLowerCase().trim() },
          data: {
            isActive: true,
            subscribedAt: new Date()
          }
        })

        return NextResponse.json({
          message: 'Subscription reactivated successfully',
          subscription: {
            id: reactivatedSubscription.id,
            email: reactivatedSubscription.email,
            subscribedAt: reactivatedSubscription.subscribedAt
          }
        })
      }
    }

    // Create new subscription with transaction
    const subscription = await db.$transaction(async (tx) => {
      const newSubscription = await tx.newsletterSubscription.create({
        data: {
          email: email.toLowerCase().trim(),
          isActive: true,
          subscribedAt: new Date()
        }
      })

      return newSubscription
    })

    return NextResponse.json({
      message: 'Successfully subscribed to newsletter',
      subscription: {
        id: subscription.id,
        email: subscription.email,
        subscribedAt: subscription.subscribedAt
      }
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    
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

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header for admin access
    const authHeader = request.headers.get('authorization')
    let isAdmin = false
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any
        const user = await db.user.findUnique({
          where: { id: decoded.userId }
        })
        
        if (user && user.isActive && user.role === 'ADMIN') {
          isAdmin = true
        }
      } catch (error) {
        // Token verification failed, continue as non-admin
      }
    }

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    
    const validatedQuery = querySchema.parse(queryParams)
    const { page, limit, search, active, dateFrom, dateTo } = validatedQuery

    // Build where clause
    const where: any = {}
    if (active !== undefined) where.isActive = active
    if (search) {
      where.OR = [
        { email: { contains: search } }
      ]
    }
    if (dateFrom || dateTo) {
      where.subscribedAt = {}
      if (dateFrom) where.subscribedAt.gte = new Date(dateFrom)
      if (dateTo) where.subscribedAt.lte = new Date(dateTo)
    }

    // Get total count
    const total = await db.newsletterSubscription.count({ where })

    // Get paginated subscriptions
    const subscriptions = await db.newsletterSubscription.findMany({
      where,
      orderBy: { subscribedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        isActive: true,
        subscribedAt: true,
        updatedAt: true
      }
    })

    // Format subscriptions
    const formattedSubscriptions = subscriptions

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      subscriptions: formattedSubscriptions,
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
    console.error('Newsletter fetch error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }
}