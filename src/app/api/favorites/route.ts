import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

const favoriteSchema = z.object({
  resourceId: z.string(),
})

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    const favorites = await db.favorite.findMany({
      where: { userId: decoded.userId },
      select: {
        resourceId: true,
      },
    })

    return NextResponse.json({ favorites: favorites.map((f) => f.resourceId) })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
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
    const validation = favoriteSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { resourceId } = validation.data

    await db.favorite.create({
      data: {
        userId: decoded.userId,
        resourceId,
      },
    })

    return NextResponse.json({ message: 'Favorite added successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    const body = await request.json()
    const validation = favoriteSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { resourceId } = validation.data

    await db.favorite.delete({
      where: {
        userId_resourceId: {
          userId: decoded.userId,
          resourceId,
        },
      },
    })

    return NextResponse.json({ message: 'Favorite removed successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 })
  }
}
