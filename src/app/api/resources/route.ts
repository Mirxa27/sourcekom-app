import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  fileUrl: z.string().min(1, 'File URL is required'),
  previewUrl: z.string().optional(),
  thumbnail: z.string().optional(),
  productType: z.string().optional(),
  licenseType: z.string().optional(),
  activationLimit: z.number().optional(),
  fileSize: z.number().optional(),
  fileFormat: z.string().optional()
})

// GET resources with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'newest'
    const search = searchParams.get('search') || ''
    const isFree = searchParams.get('isFree')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause
    const where: any = {
      isPublished: true
    }

    if (category && category !== 'all') {
      where.categoryId = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (isFree === 'true') {
      where.isFree = true
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    // Build order by clause
    let orderBy: any = {}
    switch (sort) {
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'price_low':
        orderBy = { price: 'asc' }
        break
      case 'price_high':
        orderBy = { price: 'desc' }
        break
      case 'popular':
        orderBy = { downloadCount: 'desc' }
        break
      default:
        orderBy = [
          { isFeatured: 'desc' },
          { downloadCount: 'desc' },
          { createdAt: 'desc' }
        ]
    }

    const [resources, total] = await Promise.all([
      db.resource.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          _count: {
            select: {
              reviews: true,
              purchases: true
            }
          }
        }
      }),
      db.resource.count({ where })
    ])

    return NextResponse.json({
      resources,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
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
    
    // Log the incoming data for debugging
    console.log('Received resource data:', JSON.stringify(body, null, 2))
    
    const validation = resourceSchema.safeParse(body)

    if (!validation.success) {
      console.error('Validation failed:', validation.error.issues)
      return NextResponse.json(
        { 
          error: 'Invalid input',
          details: validation.error.issues,
          received: body
        },
        { status: 400 }
      )
    }

    const {
      title,
      description,
      price,
      fileUrl,
      previewUrl,
      thumbnail,
      productType,
      licenseType,
      activationLimit,
      fileSize,
      fileFormat
    } = validation.data

    // Get or create default category
    let defaultCategory = await db.category.findFirst();
    
    if (!defaultCategory) {
      defaultCategory = await db.category.create({
        data: {
          name: 'General',
          slug: 'general',
          description: 'General resources',
          isActive: true
        }
      });
    }

    const newResource = await db.resource.create({
      data: {
        title,
        description,
        price,
        fileUrl,
        previewUrl: previewUrl || null,
        thumbnail: thumbnail || null,
        productType: (productType as any) || 'DIGITAL_PRODUCT',
        licenseType: (licenseType as any) || 'STANDARD',
        fileSize: fileSize || null,
        fileFormat: fileFormat || null,
        authorId: decoded.userId,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categoryId: defaultCategory.id,
        isPublished: false // Set to false by default for review
      },
    })

    return NextResponse.json({
      success: true,
      resource: newResource,
      message: 'Resource created successfully. License keys will be generated upon purchase.'
    })
  } catch (error) {
    console.error('Resource creation error:', error)
    return NextResponse.json({
      error: 'Failed to create resource',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
