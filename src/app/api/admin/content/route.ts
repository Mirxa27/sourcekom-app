import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Auth middleware
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authorization token required', status: 401, user: null }
  }

  const token = authHeader.substring(7)
  let decoded: any
  try {
    decoded = jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return { error: 'Invalid or expired token', status: 401, user: null }
  }

  const user = await db.user.findUnique({
    where: { id: decoded.userId }
  })

  if (!user || !user.isActive || user.role !== 'ADMIN') {
    return { error: 'Admin access required', status: 403, user: null }
  }

  return { error: null, status: 200, user }
}

const contentSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  type: z.enum(['page', 'post', 'announcement', 'faq']).default('page'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
})

// GET all content or by type/status
export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}
    if (type) where.type = type
    if (status) where.status = status

    const [contents, total] = await Promise.all([
      db.content.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.content.count({ where })
    ])

    return NextResponse.json({
      contents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error: any) {
    console.error('Content fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

// POST create content
export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json()
    const validatedData = contentSchema.parse(body)

    // Check if slug exists
    const existing = await db.content.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Content with this slug already exists' },
        { status: 409 }
      )
    }

    const content = await db.content.create({
      data: {
        ...validatedData,
        authorId: auth.user!.id,
        publishedAt: validatedData.status === 'published' ? new Date() : null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Content created successfully',
      content
    })
  } catch (error: any) {
    console.error('Content creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    )
  }
}

// PUT update content
export async function PUT(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      )
    }

    const validatedData = contentSchema.partial().parse(updateData)

    const content = await db.content.update({
      where: { id },
      data: {
        ...validatedData,
        publishedAt: validatedData.status === 'published' 
          ? (await db.content.findUnique({ where: { id } }))?.publishedAt || new Date()
          : validatedData.status === 'draft' ? null : undefined
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Content updated successfully',
      content
    })
  } catch (error: any) {
    console.error('Content update error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}

// DELETE content
export async function DELETE(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      )
    }

    await db.content.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Content deleted successfully' })
  } catch (error: any) {
    console.error('Content delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    )
  }
}
