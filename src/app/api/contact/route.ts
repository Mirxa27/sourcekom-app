import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'
import jwt from 'jsonwebtoken'
import { sendContactNotificationToAdmin } from '@/lib/email'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Enhanced validation schemas
const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Name contains invalid characters'),
  email: z.string()
    .email('Invalid email address')
    .max(254, 'Email address too long'),
  company: z.string()
    .max(100, 'Company name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_.&]+$/, 'Company name contains invalid characters')
    .optional(),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters')
    .regex(/^[^<>]*$/, 'Message contains invalid characters'),
  type: z.enum(['general', 'resource_inquiry', 'legal_consultation', 'technical_support', 'partnership'], {
    message: 'Invalid inquiry type'
  }).default('general'),
  phone: z.string()
    .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format')
    .max(20, 'Phone number too long')
    .optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium').optional()
})

// Query parameters schema for GET requests
const querySchema = z.object({
  page: z.coerce.number().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce.number().min(1).max(50, 'Limit must be between 1 and 50').default(10),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  type: z.enum(['general', 'resource_inquiry', 'legal_consultation', 'technical_support', 'partnership']).optional(),
  search: z.string().max(100, 'Search term too long').optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  sort: z.enum(['newest', 'oldest', 'priority']).default('newest')
})

export async function POST(request: NextRequest) {
  try {
    // Apply stricter rate limiting for contact submissions
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = await rateLimit(ip, 3, 60 * 60 * 1000) // 3 requests per hour
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many contact requests. Please try again later.' },
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
    
    // Validate input
    const validation = contactSchema.safeParse(body)
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
    
    const { name, email, company, message, type, phone, priority } = validation.data

    // Additional business logic validation
    if (type === 'legal_consultation' && !company) {
      return NextResponse.json(
        { error: 'Company name is required for legal consultation inquiries' },
        { status: 400 }
      )
    }

    if (priority === 'urgent' && type !== 'legal_consultation') {
      return NextResponse.json(
        { error: 'Urgent priority is only available for legal consultation inquiries' },
        { status: 400 }
      )
    }

    // Check for duplicate submissions within last hour
    const recentInquiry = await db.contactInquiry.findFirst({
      where: {
        email,
        message,
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
        }
      }
    })

    if (recentInquiry) {
      return NextResponse.json(
        { error: 'You have already submitted this inquiry. Please wait before submitting again.' },
        { status: 429 }
      )
    }

    // Check for spam patterns
    const spamKeywords = ['click here', 'free money', 'guaranteed', 'act now', 'limited time']
    const messageLower = message.toLowerCase()
    const hasSpamKeywords = spamKeywords.some(keyword => messageLower.includes(keyword))
    
    if (hasSpamKeywords) {
      return NextResponse.json(
        { error: 'Message appears to be spam' },
        { status: 400 }
      )
    }

    // Create contact inquiry with transaction
    const inquiry = await db.$transaction(async (tx) => {
      const newInquiry = await tx.contactInquiry.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          company: company?.trim() || null,
          message: message.trim(),
          type,
          status: 'PENDING'
        }
      })

      return newInquiry
    })

    // Send notification email to admin
    try {
      await sendContactNotificationToAdmin({
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        company: inquiry.company || null,
        message: inquiry.message,
        type: inquiry.type
      })
    } catch (emailError) {
      // Don't fail the request if email fails - it's logged in notification table
      console.error('Failed to send notification email:', emailError)
    }

    return NextResponse.json({
      message: 'Contact inquiry submitted successfully',
      inquiry: {
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        type: inquiry.type,
        status: inquiry.status,
        createdAt: inquiry.createdAt
      }
    })

  } catch (error) {
    console.error('Contact inquiry error:', error)
    
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
      { error: 'Failed to submit inquiry. Please try again.' },
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

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    
    const validatedQuery = querySchema.parse(queryParams)
    const { page, limit, status, type, search, dateFrom, dateTo, sort } = validatedQuery

    // Build where clause
    const where: any = {}
    if (status) where.status = status
    if (type) where.type = type
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { company: { contains: search } },
        { message: { contains: search } }
      ]
    }
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom)
      if (dateTo) where.createdAt.lte = new Date(dateTo)
    }

    // Build order by clause
    let orderBy: any = { createdAt: 'desc' }
    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'priority':
        orderBy = [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Get total count
    const total = await db.contactInquiry.count({ where })

    // Get paginated inquiries
    const inquiries = await db.contactInquiry.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        type: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        message: isAdmin // Only include message for admins
      }
    })

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      inquiries,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage
      },
      isAdmin
    })

  } catch (error) {
    console.error('Contact fetch error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  }
}