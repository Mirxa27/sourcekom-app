import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = {
      thumbnail: ['image/jpeg', 'image/png', 'image/webp'],
      file: ['application/pdf', 'application/zip', 'application/x-zip-compressed', 'text/plain', 'application/javascript', 'text/html', 'text/css'],
      preview: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4']
    }

    if (type && allowedTypes[type as keyof typeof allowedTypes]) {
      const allowedMimes = allowedTypes[type as keyof typeof allowedTypes]
      if (!allowedMimes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type for ${type}. Allowed types: ${allowedMimes.join(', ')}` },
          { status: 400 }
        )
      }
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB' },
        { status: 400 }
      )
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Create type-specific subdirectory
    const typeDir = join(uploadDir, type || 'files')
    if (!existsSync(typeDir)) {
      await mkdir(typeDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const filename = `${timestamp}_${randomString}.${fileExtension}`
    const filepath = join(typeDir, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Return the URL
    const url = `/uploads/${type}/${filename}`

    return NextResponse.json({
      message: 'File uploaded successfully',
      url,
      filename: file.name,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}