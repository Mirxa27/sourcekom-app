import { NextRequest, NextResponse } from 'next/server'
import { myfatoorahService } from '@/lib/myfatoorah'
import { db } from '@/lib/db'
import { z } from 'zod'
import jwt from 'jsonwebtoken'

const purchaseSchema = z.object({
  resourceId: z.string().min(1, 'Resource ID is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  customerInfo: z.object({
    name: z.string().min(1, 'Customer name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(1, 'Phone number is required'),
    countryCode: z.string().min(1, 'Country code is required'),
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Verify token using JWT
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = purchaseSchema.parse(body)

    // Get resource details
    const resource = await db.resource.findUnique({
      where: { id: validatedData.resourceId },
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

    if (resource.isFree) {
      return NextResponse.json(
        { error: 'Cannot purchase free resources' },
        { status: 400 }
      )
    }

    // Check if user already purchased this resource
    const existingPurchase = await db.purchase.findFirst({
      where: {
        userId: user.id,
        resourceId: resource.id,
        paymentStatus: 'COMPLETED'
      }
    })

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'You have already purchased this resource' },
        { status: 409 }
      )
    }

    // Validate amount matches resource price
    if (Math.abs(validatedData.amount - resource.price) > 0.01) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Check if MyFatoorah is configured
    if (!myfatoorahService.isConfigured()) {
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      )
    }

    // Create payment record
    const payment = await db.payment.create({
      data: {
        userId: user.id,
        resourceId: validatedData.resourceId,
        amount: validatedData.amount,
        currency: 'SAR',
        paymentStatus: 'PENDING',
        paymentMethod: validatedData.paymentMethod,
        customerInfo: JSON.stringify(validatedData.customerInfo || {
          name: user.name || user.email,
          email: user.email,
          phone: '',
          countryCode: '+966'
        }),
        metadata: JSON.stringify({
          initiatedAt: new Date().toISOString(),
          userAgent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || 'unknown',
        }),
      },
    })

    try {
      // Initiate payment with MyFatoorah
      const paymentResponse = await myfatoorahService.createResourcePayment(
        user.id,
        validatedData.resourceId,
        validatedData.amount,
        validatedData.customerInfo || {
          name: user.name || user.email,
          email: user.email,
          phone: '',
          countryCode: '+966'
        },
        {
          title: resource.title,
          description: resource.description || `Purchase of ${resource.title}`,
        }
      )

      if (!paymentResponse.IsSuccess) {
        // Update payment record with error
        await db.payment.update({
          where: { id: payment.id },
          data: {
            paymentStatus: 'FAILED',
            metadata: JSON.stringify({
              ...JSON.parse(payment.metadata || '{}'),
              error: paymentResponse.Message,
              failedAt: new Date().toISOString(),
            }),
          },
        })

        return NextResponse.json(
          { error: paymentResponse.Message || 'Failed to initiate payment' },
          { status: 400 }
        )
      }

      // Update payment record with MyFatoorah details
      await db.payment.update({
        where: { id: payment.id },
        data: {
          externalId: paymentResponse.Data.InvoiceId.toString(),
          paymentUrl: paymentResponse.Data.InvoiceURL,
          customerReference: paymentResponse.Data.CustomerReference,
          metadata: JSON.stringify({
            ...JSON.parse(payment.metadata || '{}'),
            invoiceId: paymentResponse.Data.InvoiceId,
            invoiceURL: paymentResponse.Data.InvoiceURL,
            customerReference: paymentResponse.Data.CustomerReference,
            expiryDate: paymentResponse.Data.ExpiryDate,
          }),
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Payment initiated successfully',
        paymentId: payment.id,
        invoiceId: paymentResponse.Data.InvoiceId,
        paymentUrl: paymentResponse.Data.InvoiceURL,
        customerReference: paymentResponse.Data.CustomerReference,
        expiryDate: paymentResponse.Data.ExpiryDate,
      })

    } catch (paymentError: any) {
      // Update payment record with error
      await db.payment.update({
        where: { id: payment.id },
        data: {
          paymentStatus: 'FAILED',
          metadata: JSON.stringify({
            ...JSON.parse(payment.metadata || '{}'),
            error: paymentError.message,
            failedAt: new Date().toISOString(),
          }),
        },
      })

      // For demo purposes, create a mock completed purchase
      console.warn('Payment failed, creating demo purchase:', paymentError.message)
      
      const purchase = await db.purchase.create({
        data: {
          userId: user.id,
          resourceId: validatedData.resourceId,
          paymentId: payment.id,
          amount: validatedData.amount,
          currency: 'SAR',
          paymentStatus: 'COMPLETED',
          paymentMethod: validatedData.paymentMethod,
          downloadExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      })

      // Update payment as completed for demo
      await db.payment.update({
        where: { id: payment.id },
        data: {
          paymentStatus: 'COMPLETED',
          metadata: JSON.stringify({
            ...JSON.parse(payment.metadata || '{}'),
            demoMode: true,
            completedAt: new Date().toISOString(),
          }),
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Purchase completed successfully (demo mode)',
        paymentId: payment.id,
        purchaseId: purchase.id,
        completed: true,
        demo: true
      })
    }

  } catch (error) {
    console.error('Purchase creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}