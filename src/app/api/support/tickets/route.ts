import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

const ticketSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().min(1, 'Description is required'),
})

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    const tickets = await db.supportTicket.findMany({
      where: { userId: decoded.userId },
    })

    return NextResponse.json({ tickets })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    const body = await request.json()
    const validation = ticketSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { subject, description } = validation.data

    const newTicket = await db.supportTicket.create({
      data: {
        subject,
        description,
        userId: decoded.userId,
        ticketId: `TICKET-${Date.now()}`,
        category: 'General',
      },
    })

    return NextResponse.json({ ticket: newTicket })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
}
