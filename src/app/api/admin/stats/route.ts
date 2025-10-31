import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }

    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const totalUsers = await db.user.count()
    const totalResources = await db.resource.count()
    const totalPurchases = await db.purchase.count()
    const totalRevenue = await db.purchase.aggregate({
      _sum: {
        amount: true,
      },
    })

    return NextResponse.json({
      stats: {
        totalUsers,
        totalResources,
        totalPurchases,
        totalRevenue: totalRevenue._sum.amount || 0,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
