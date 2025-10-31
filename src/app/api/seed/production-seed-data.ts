/**
 * Production Seed Data
 * Creates essential production-ready data for the Saudi Arabian resource management platform
 */

import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function seedProductionData() {
  try {
    console.log('🌱 Starting production data seeding...')

    // Create production categories for Saudi market
    const productionCategories = [
      {
        name: 'Office Spaces',
        slug: 'office-spaces',
        description: 'Commercial office spaces and co-working facilities across Saudi Arabia',
        icon: '🏢',
        color: '#3b82f6'
      },
      {
        name: 'Industrial Equipment',
        slug: 'industrial-equipment',
        description: 'Heavy machinery, tools, and industrial equipment for Saudi businesses',
        icon: '🔧',
        color: '#f59e0b'
      },
      {
        name: 'Personnel Services',
        slug: 'personnel-services',
        description: 'Skilled professionals and temporary staff for Saudi projects',
        icon: '👥',
        color: '#8b5cf6'
      },
      {
        name: 'Storage Facilities',
        slug: 'storage-facilities',
        description: 'Warehousing and storage solutions across Saudi cities',
        icon: '📦',
        color: '#10b981'
      },
      {
        name: 'Transportation',
        slug: 'transportation',
        description: 'Commercial vehicles and transportation services in Saudi Arabia',
        icon: '🚚',
        color: '#ef4444'
      },
      {
        name: 'Legal Services',
        slug: 'legal-services',
        description: 'Legal consultation and compliance services for Saudi market',
        icon: '⚖️',
        color: '#6366f1'
      }
    ]

    // Create categories
    const categories = await Promise.all(
      productionCategories.map(async (category) => {
        return await db.category.upsert({
          where: { slug: category.slug },
          update: { isActive: true },
          create: {
            ...category,
            isActive: true
          }
        })
      })
    )

    // Create admin user for production
    const adminPassword = await bcrypt.hash('Admin@2024!#', 12)
    const adminUser = await db.user.upsert({
      where: { email: 'admin@sourcekom.com' },
      update: { isActive: true },
      create: {
        email: 'admin@sourcekom.com',
        name: 'System Administrator',
        password: adminPassword,
        role: 'ADMIN',
        isActive: true,
        emailVerified: new Date()
      }
    })

    // Create sample creator user
    const creatorPassword = await bcrypt.hash('Creator@2024!#', 12)
    const creatorUser = await db.user.upsert({
      where: { email: 'creator@sourcekom.com' },
      update: { isActive: true },
      create: {
        email: 'creator@sourcekom.com',
        name: 'Content Creator',
        password: creatorPassword,
        role: 'CREATOR',
        isActive: true,
        emailVerified: new Date()
      }
    })

    // Create production-ready sample resources
    const productionResources = [
      {
        title: 'Premium Office Space - Riyadh Business District',
        description: 'Modern office space in Riyadh with Saudi business amenities and prayer facilities',
        slug: 'premium-office-space-riyadh',
        content: 'Premium office space located in Riyadh business district. Features include modern furniture, high-speed internet, meeting rooms, prayer facilities, and 24/7 security. Perfect for Saudi businesses and international companies operating in the Kingdom.',
        price: 15000,
        originalPrice: 18000,
        isFree: false,
        isPublished: true,
        isFeatured: true,
        fileUrl: '/documents/office-space-specs.pdf',
        thumbnail: 'https://images.unsplash.com/photo-1497366754045-4f5f8f7d9db9?w=800',
        tags: JSON.stringify(['office', 'riyadh', 'premium', 'prayer-facilities', 'business-district']),
        productType: 'PHYSICAL_RESOURCE',
        pricingTier: 'PROFESSIONAL',
        licenseType: 'COMMERCIAL',
        difficulty: 'Beginner',
        duration: 'Monthly rental',
        requirements: 'Business registration, Saudi address verification',
        features: JSON.stringify([
          'Modern office furniture',
          'High-speed internet',
          'Prayer facilities',
          '24/7 security',
          'Meeting rooms',
          'Parking spaces',
          'Kitchen facilities',
          'Saudi business address'
        ]),
        authorId: creatorUser.id,
        categoryId: categories[0].id
      },
      {
        title: 'Industrial Equipment Package - Saudi Standards',
        description: 'Complete industrial equipment package compliant with Saudi standards and regulations',
        slug: 'industrial-equipment-saudi-standards',
        content: 'Comprehensive industrial equipment package designed for Saudi market compliance. Includes all necessary certifications and safety standards required by Saudi authorities. Equipment is maintained to highest standards with local support available.',
        price: 25000,
        originalPrice: 30000,
        isFree: false,
        isPublished: true,
        isFeatured: true,
        fileUrl: '/documents/equipment-specifications.pdf',
        thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
        tags: JSON.stringify(['industrial', 'saudi-standards', 'equipment', 'certified']),
        productType: 'PHYSICAL_RESOURCE',
        pricingTier: 'ENTERPRISE',
        licenseType: 'COMMERCIAL',
        difficulty: 'Advanced',
        duration: 'Monthly rental',
        requirements: 'Saudi business license, operator certification',
        features: JSON.stringify([
          'SASO certified equipment',
          'Local technical support',
          'Safety compliance',
          'Maintenance included',
          'Operator training',
          'Delivery service',
          'Insurance coverage'
        ]),
        authorId: creatorUser.id,
        categoryId: categories[1].id
      },
      {
        title: 'Saudi Business Consultation Package',
        description: 'Expert consultation for Saudi market entry and business development',
        slug: 'saudi-business-consultation',
        content: 'Professional business consultation services specifically designed for Saudi market. Includes regulatory guidance, market analysis, business setup assistance, and ongoing support for successful Saudi business operations.',
        price: 0,
        isFree: true,
        isPublished: true,
        isFeatured: true,
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        tags: JSON.stringify(['consultation', 'saudi-market', 'business-setup', 'free']),
        productType: 'GUIDE',
        pricingTier: 'BASIC',
        licenseType: 'STANDARD',
        difficulty: 'Beginner',
        duration: 'Initial consultation',
        requirements: 'Valid business inquiry',
        features: JSON.stringify([
          'Saudi market analysis',
          'Regulatory guidance',
          'Business setup support',
          'Cultural business insights',
          'Contact networks',
          'Ongoing support'
        ]),
        authorId: creatorUser.id,
        categoryId: categories[5].id
      }
    ]

    // Create resources
    const resources = await Promise.all(
      productionResources.map(async (resource) => {
        return await db.resource.upsert({
          where: { slug: resource.slug },
          update: { isPublished: true },
          create: resource
        })
      })
    )

    // Create system settings
    const systemSettings = [
      {
        key: 'app_name',
        value: '"SourceKom Saudi Resource Platform"',
        category: 'general',
        description: 'Application name for the Saudi resource platform'
      },
      {
        key: 'default_currency',
        value: '"SAR"',
        category: 'general',
        description: 'Default currency for Saudi market'
      },
      {
        key: 'timezone',
        value: '"Asia/Riyadh"',
        category: 'general',
        description: 'Default timezone for Saudi Arabia'
      },
      {
        key: 'working_days',
        value: '["Sunday","Monday","Tuesday","Wednesday","Thursday"]',
        category: 'general',
        description: 'Saudi working days (Sunday-Thursday)'
      },
      {
        key: 'myfatoorah_api_key',
        value: '""',
        category: 'payment',
        description: 'MyFatoorah API key for Saudi payment processing'
      },
      {
        key: 'contact_email',
        value: '"info@sourcekom.com"',
        category: 'general',
        description: 'Primary contact email for Saudi operations'
      },
      {
        key: 'support_phone',
        value: '"+966500000000"',
        category: 'general',
        description: 'Saudi support phone number'
      }
    ]

    // Create settings
    await Promise.all(
      systemSettings.map(async (setting) => {
        return await db.setting.upsert({
          where: { key: setting.key },
          update: {},
          create: setting
        })
      })
    )

    // Create welcome notification
    await db.notification.upsert({
      where: { 
        title: 'Welcome to SourceKom Saudi Platform' 
      },
      update: {},
      create: {
        title: 'Welcome to SourceKom Saudi Platform',
        message: 'Welcome to the premier resource management platform for Saudi Arabia. Explore our wide range of resources and services tailored for the Saudi market.',
        type: 'info',
        isGlobal: true,
        actionUrl: '/browse',
        actionText: 'Browse Resources'
      }
    })

    console.log('✅ Production data seeding completed successfully!')
    
    return {
      success: true,
      message: 'Production data seeded successfully',
      summary: {
        categories: categories.length,
        users: 2,
        resources: resources.length,
        settings: systemSettings.length
      }
    }

  } catch (error) {
    console.error('❌ Error seeding production data:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export default seedProductionData