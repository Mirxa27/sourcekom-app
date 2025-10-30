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

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().default(true)
})

// GET all categories
export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: {
            resources: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ categories })
  } catch (error: any) {
    console.error('Categories fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST create category
export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json()
    const validatedData = categorySchema.parse(body)

    // Generate slug if not provided
    const slug = validatedData.slug || validatedData.name.toLowerCase().replace(/\s+/g, '-')

    // Check if slug exists
    const existing = await db.category.findUnique({
      where: { slug }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 409 }
      )
    }

    const category = await db.category.create({
      data: {
        ...validatedData,
        slug
      }
    })

    return NextResponse.json({
      message: 'Category created successfully',
      category
    })
  } catch (error: any) {
    console.error('Category creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

// PUT update category
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
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    const validatedData = categorySchema.partial().parse(updateData)

    const category = await db.category.update({
      where: { id },
      data: validatedData
    })

    return NextResponse.json({
      message: 'Category updated successfully',
      category
    })
  } catch (error: any) {
    console.error('Category update error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE category
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
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    // Check if category has resources
    const resourceCount = await db.resource.count({
      where: { categoryId: id }
    })

    if (resourceCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${resourceCount} resources. Please reassign or delete resources first.` },
        { status: 409 }
      )
    }

    await db.category.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error: any) {
    console.error('Category delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
