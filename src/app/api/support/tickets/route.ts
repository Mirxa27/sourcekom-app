import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createTicketSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
  category: z.enum(['technical', 'billing', 'account', 'resources', 'legal', 'feature', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description too long'),
  attachments: z.array(z.string()).optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (userId) where.userId = userId
    if (status) where.status = status
    if (category) where.category = category

    // Get tickets
    const tickets = await db.supportTicket.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    // Get total count for pagination
    const total = await db.supportTicket.count({ where })

    return NextResponse.json({
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching support tickets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch support tickets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = createTicketSchema.parse(body)
    
    // Get user ID from request (in a real app, this would come from authentication)
    const userId = body.userId || 'cmhbfjiu00000pwyrkos40qua'
    
    // Generate ticket ID
    const ticketCount = await db.supportTicket.count()
    const ticketId = `TK-${String(ticketCount + 1).padStart(6, '0')}`
    
    // Create support ticket
    const ticket = await db.supportTicket.create({
      data: {
        ticketId,
        userId,
        subject: validatedData.subject,
        category: validatedData.category,
        priority: validatedData.priority,
        description: validatedData.description,
        status: 'open',
        attachments: validatedData.attachments ? JSON.stringify(validatedData.attachments) : null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Create initial reply from system
    await db.supportReply.create({
      data: {
        ticketId: ticket.id,
        userId: userId, // Use the actual user ID instead of 'system'
        message: `Thank you for contacting SourceKom support. Your ticket #${ticket.ticketId} has been created and assigned to our support team. We'll respond within 24 hours.`,
        isInternal: false
      }
    })

    // Send notification (in a real app, this would send email/push notification)
    console.log(`Support ticket created: ${ticket.id} for user ${userId}`)

    return NextResponse.json({
      success: true,
      ticket,
      message: 'Support ticket created successfully'
    })
  } catch (error) {
    console.error('Error creating support ticket:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create support ticket' },
      { status: 500 }
    )
  }
}