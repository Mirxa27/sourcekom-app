import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const db = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, 'Comment is required'),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reviews = await db.review.findMany({
      where: { resourceId: params.id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    const body = await request.json()
    const validation = reviewSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { rating, comment } = validation.data

    const newReview = await db.review.create({
      data: {
        rating,
        comment,
        resourceId: params.id,
        userId: decoded.userId,
      },
    })

    return NextResponse.json({ review: newReview })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
