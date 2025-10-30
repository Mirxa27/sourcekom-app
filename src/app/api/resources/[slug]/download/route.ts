import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Verify token
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Find resource by slug
    const resource = await db.resource.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    if (!resource.isPublished) {
      return NextResponse.json(
        { error: 'Resource not available' },
        { status: 404 }
      )
    }

    // Check if user can download
    const canDownload = resource.isFree || 
                       resource.authorId === decoded.userId || 
                       await hasPurchasedResource(decoded.userId, resource.id)

    if (!canDownload) {
      return NextResponse.json(
        { error: 'You must purchase this resource to download it' },
        { status: 403 }
      )
    }

    // Increment download count
    await db.resource.update({
      where: { id: resource.id },
      data: { downloadCount: { increment: 1 } }
    })

    // Return download URLs
    const downloadUrls: string[] = []
    if (resource.fileUrl) downloadUrls.push(resource.fileUrl)
    if (resource.fileUrl2) downloadUrls.push(resource.fileUrl2)
    if (resource.fileUrl3) downloadUrls.push(resource.fileUrl3)

    if (downloadUrls.length === 0 && resource.content) {
      // For text-based resources, return content as downloadable file
      return NextResponse.json({
        downloadUrl: null,
        content: resource.content,
        filename: `${resource.slug}.txt`,
        message: 'Content ready for download'
      })
    }

    return NextResponse.json({
      downloadUrls,
      message: 'Download links generated successfully'
    })

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function hasPurchasedResource(userId: string, resourceId: string): Promise<boolean> {
  try {
    const purchase = await db.purchase.findFirst({
      where: {
        userId,
        resourceId,
        paymentStatus: 'COMPLETED'
      }
    })
    
    return !!purchase
  } catch (error) {
    console.error('Error checking purchase status:', error)
    return false
  }
}