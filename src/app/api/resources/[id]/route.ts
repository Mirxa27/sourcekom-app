import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const db = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  fileUrl: z.string().url('Invalid URL'),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const resource = await db.resource.findUnique({
      where: { id: params.id },
    })

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    return NextResponse.json({ resource })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resource' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    const body = await request.json()
    const validation = resourceSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      )
    }

    const resource = await db.resource.findUnique({
      where: { id: params.id },
    })

    if (!resource || resource.authorId !== decoded.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updatedResource = await db.resource.update({
      where: { id: params.id },
      data: validation.data,
    })

    return NextResponse.json({ resource: updatedResource })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    const resource = await db.resource.findUnique({
      where: { id: params.id },
    })

    if (!resource || resource.authorId !== decoded.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await db.resource.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Resource deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 })
  }
}
