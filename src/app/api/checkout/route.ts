import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      price: z.number(),
    })
  ),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    address: z.string(),
  }),
  paymentId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    const body = await request.json()
    const validation = checkoutSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { items, customer, paymentId } = validation.data

    const totalPrice = items.reduce((total, item) => total + item.price, 0)

    // For now, we'll just create a purchase record for each item
    const purchases = await Promise.all(
      items.map((item) =>
        db.purchase.create({
          data: {
            amount: item.price,
            paymentMethod: 'myfatoorah',
            paymentStatus: 'COMPLETED',
            userId: decoded.userId,
            resourceId: item.id,
            paymentId,
          },
        })
      )
    )

    return NextResponse.json({ orderId: purchases[0].id })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process checkout' }, { status: 500 })
  }
}
