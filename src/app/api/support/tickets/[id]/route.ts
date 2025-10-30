import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateTicketSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignedTo: z.string().optional()
})

const replySchema = z.object({
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
  isInternal: z.boolean().default(false)
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id

    const ticket = await db.supportTicket.findUnique({
      where: { id: ticketId },
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
            createdAt: 'asc'
          }
        }
      }
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ticket })
  } catch (error) {
    console.error('Error fetching support ticket:', error)
    return NextResponse.json(
      { error: 'Failed to fetch support ticket' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id
    const body = await request.json()
    
    // Validate request body
    const validatedData = updateTicketSchema.parse(body)
    
    // Check if ticket exists
    const existingTicket = await db.supportTicket.findUnique({
      where: { id: ticketId }
    })

    if (!existingTicket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // Update ticket
    const updatedTicket = await db.supportTicket.update({
      where: { id: ticketId },
      data: {
        ...validatedData,
        updatedAt: new Date()
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

    // Log status change
    if (validatedData.status && validatedData.status !== existingTicket.status) {
      console.log(`Ticket ${ticketId} status changed from ${existingTicket.status} to ${validatedData.status}`)
    }

    return NextResponse.json({
      success: true,
      ticket: updatedTicket,
      message: 'Ticket updated successfully'
    })
  } catch (error) {
    console.error('Error updating support ticket:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update support ticket' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id
    const body = await request.json()
    
    // Validate request body
    const validatedData = replySchema.parse(body)
    
    // Get user ID from request (in a real app, this would come from authentication)
    const userId = body.userId || 'demo-user-id'
    
    // Check if ticket exists
    const existingTicket = await db.supportTicket.findUnique({
      where: { id: ticketId }
    })

    if (!existingTicket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // Create reply
    const reply = await db.supportReply.create({
      data: {
        ticketId,
        userId,
        message: validatedData.message,
        isInternal: validatedData.isInternal
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })

    // Update ticket status if needed
    if (existingTicket.status === 'open' && !validatedData.isInternal) {
      await db.supportTicket.update({
        where: { id: ticketId },
        data: {
          status: 'in_progress',
          updatedAt: new Date()
        }
      })
    }

    // Send notification (in a real app, this would send email/push notification)
    console.log(`Reply added to ticket ${ticketId} by user ${userId}`)

    return NextResponse.json({
      success: true,
      reply,
      message: 'Reply added successfully'
    })
  } catch (error) {
    console.error('Error adding reply to support ticket:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to add reply to support ticket' },
      { status: 500 }
    )
  }
}