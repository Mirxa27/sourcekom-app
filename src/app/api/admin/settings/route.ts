import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Encryption helper
function encrypt(text: string): string {
  const algorithm = 'aes-256-cbc'
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key-change-in-production', 'salt', 32)
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

function decrypt(encryptedText: string): string {
  const algorithm = 'aes-256-cbc'
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key-change-in-production', 'salt', 32)
  const parts = encryptedText.split(':')
  const iv = Buffer.from(parts[0], 'hex')
  const encrypted = parts[1]
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

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

// Schema for setting
const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  category: z.string().default('general'),
  description: z.string().optional(),
  isEncrypted: z.boolean().default(false)
})

// GET all settings or by category
export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where: any = {}
    if (category) {
      where.category = category
    }

    const settings = await db.setting.findMany({
      where,
      orderBy: { category: 'asc' }
    })

    // Decrypt encrypted values
    const decryptedSettings = settings.map(setting => ({
      ...setting,
      value: setting.isEncrypted ? decrypt(setting.value) : setting.value
    }))

    return NextResponse.json({ settings: decryptedSettings })
  } catch (error: any) {
    console.error('Settings fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// POST create or update setting
export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json()
    const validatedData = settingSchema.parse(body)

    // Encrypt value if needed
    const valueToStore = validatedData.isEncrypted 
      ? encrypt(validatedData.value) 
      : validatedData.value

    // Upsert setting
    const setting = await db.setting.upsert({
      where: { key: validatedData.key },
      update: {
        value: valueToStore,
        category: validatedData.category,
        description: validatedData.description,
        isEncrypted: validatedData.isEncrypted,
        updatedBy: auth.user!.id,
        updatedAt: new Date()
      },
      create: {
        key: validatedData.key,
        value: valueToStore,
        category: validatedData.category,
        description: validatedData.description,
        isEncrypted: validatedData.isEncrypted,
        updatedBy: auth.user!.id
      }
    })

    return NextResponse.json({
      message: 'Setting saved successfully',
      setting: {
        ...setting,
        value: setting.isEncrypted ? decrypt(setting.value) : setting.value
      }
    })
  } catch (error: any) {
    console.error('Settings save error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to save setting' },
      { status: 500 }
    )
  }
}

// DELETE setting
export async function DELETE(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: 'Setting key is required' },
        { status: 400 }
      )
    }

    await db.setting.delete({
      where: { key }
    })

    return NextResponse.json({ message: 'Setting deleted successfully' })
  } catch (error: any) {
    console.error('Settings delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete setting' },
      { status: 500 }
    )
  }
}
