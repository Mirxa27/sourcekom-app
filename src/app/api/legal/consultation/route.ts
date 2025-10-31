import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { parseJsonSafe, respondZodError } from '@/lib/validation'
import { emailService } from '@/lib/email'

const consultationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  company: z.string().max(200, 'Company name too long').optional(),
  serviceType: z.enum(['corporate', 'contract', 'compliance', 'strategy', 'other']),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  preferredTime: z.string().min(1, 'Preferred time is required'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long')
})

export async function POST(request: NextRequest) {
  try {
    const parsed = await parseJsonSafe(request)
    if (!parsed.ok) return parsed.error
    const validatedData = consultationSchema.parse(parsed.data)

    // Validate date is not in the past
    const preferredDate = new Date(validatedData.preferredDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (preferredDate < today) {
      return NextResponse.json(
        { error: 'Preferred date cannot be in the past' },
        { status: 400 }
      )
    }

    // Check for duplicate consultation requests
    const existingRequest = await db.contactInquiry.findFirst({
      where: {
        email: validatedData.email.toLowerCase(),
        type: 'legal_consultation',
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You have already submitted a consultation request in the last 24 hours' },
        { status: 429 }
      )
    }

    // Create contact inquiry
    const inquiry = await db.contactInquiry.create({
      data: {
        name: validatedData.name.trim(),
        email: validatedData.email.toLowerCase().trim(),
        company: validatedData.company?.trim() || null,
        message: `${validatedData.message}\n\nConsultation Details:\nService Type: ${validatedData.serviceType}\nPreferred Date: ${validatedData.preferredDate}\nPreferred Time: ${validatedData.preferredTime}\nPhone: ${validatedData.phone}`,
        type: 'legal_consultation',
        status: 'PENDING'
      }
    })

    // Send confirmation email
    try {
      await emailService.sendConsultationConfirmation(
        validatedData.email,
        validatedData.name,
        validatedData.serviceType,
        validatedData.preferredDate,
        validatedData.preferredTime
      )
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Consultation request submitted successfully. We will contact you within 24 hours.',
      inquiry: {
        id: inquiry.id,
        status: inquiry.status,
        createdAt: inquiry.createdAt
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Consultation booking error:', error)

    const zodResp = respondZodError(error)
    if (zodResp) return zodResp

    return NextResponse.json(
      { error: 'Failed to submit consultation request' },
      { status: 500 }
    )
  }
}

