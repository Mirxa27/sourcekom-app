import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    // Create categories if they don't exist
    const categories = await Promise.all([
      db.category.upsert({
        where: { slug: 'office-space' },
        update: {},
        create: {
          name: 'Office Space',
          slug: 'office-space',
          description: 'Commercial office spaces, co-working spaces, and meeting rooms available for sharing',
          icon: 'Building',
          color: 'blue'
        }
      }),
      db.category.upsert({
        where: { slug: 'equipment' },
        update: {},
        create: {
          name: 'Equipment',
          slug: 'equipment',
          description: 'Industrial equipment, machinery, tools, and specialized devices available for rent or sharing',
          icon: 'Truck',
          color: 'orange'
        }
      }),
      db.category.upsert({
        where: { slug: 'personnel' },
        update: {},
        create: {
          name: 'Personnel',
          slug: 'personnel',
          description: 'Skilled professionals, consultants, and temporary staff available for project-based work',
          icon: 'Users',
          color: 'purple'
        }
      }),
      db.category.upsert({
        where: { slug: 'storage' },
        update: {},
        create: {
          name: 'Storage',
          slug: 'storage',
          description: 'Warehouse space, storage facilities, and inventory management solutions',
          icon: 'Building',
          color: 'green'
        }
      }),
      db.category.upsert({
        where: { slug: 'vehicles' },
        update: {},
        create: {
          name: 'Vehicles',
          slug: 'vehicles',
          description: 'Commercial vehicles, delivery trucks, and transportation equipment',
          icon: 'Truck',
          color: 'red'
        }
      }),
      db.category.upsert({
        where: { slug: 'legal-services' },
        update: {},
        create: {
          name: 'Legal Services',
          slug: 'legal-services',
          description: 'Legal consultation, contract review, and compliance services',
          icon: 'FileText',
          color: 'indigo'
        }
      })
    ])

    // Create sample users if they don't exist
    const creatorPassword = await bcrypt.hash('password123', 12)
    const userPassword = await bcrypt.hash('password123', 12)

    const creator = await db.user.upsert({
      where: { email: 'creator@sourcekom.com' },
      update: {},
      create: {
        email: 'creator@sourcekom.com',
        name: 'John Creator',
        password: creatorPassword,
        role: 'CREATOR'
      }
    })

    const regularUser = await db.user.upsert({
      where: { email: 'user@sourcekom.com' },
      update: {},
      create: {
        email: 'user@sourcekom.com',
        name: 'Jane User',
        password: userPassword,
        role: 'USER'
      }
    })

    // Create sample resources if they don't exist
    const resources = await Promise.all([
      db.resource.upsert({
        where: { slug: 'modern-office-space-downtown' },
        update: {},
        create: {
          title: 'Modern Office Space - Downtown Riyadh',
          description: 'Premium office space in downtown Riyadh with modern amenities, perfect for startups and small businesses. Includes meeting rooms, high-speed internet, and 24/7 access.',
          slug: 'modern-office-space-downtown',
          content: 'Fully furnished office space with 10 workstations, 2 private meeting rooms, kitchen facilities, and secure parking. Available for monthly rental with flexible terms.',
          price: 5000,
          isFree: false,
          isPublished: true,
          isFeatured: true,
          thumbnail: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Office+Space',
          tags: JSON.stringify(['office', 'meeting-rooms', 'downtown', 'furnished']),
          authorId: creator.id,
          categoryId: categories[0].id
        }
      }),
      db.resource.upsert({
        where: { slug: 'industrial-warehouse-equipment' },
        update: {},
        create: {
          title: 'Industrial Warehouse Equipment Package',
          description: 'Complete set of industrial equipment including forklifts, pallet jacks, and storage solutions. Ideal for short-term projects or seasonal demand.',
          slug: 'industrial-warehouse-equipment',
          content: 'Package includes: 2 electric forklifts, 4 pallet jacks, 20 storage racks, safety equipment, and operator training available.',
          price: 3500,
          isFree: false,
          isPublished: true,
          isFeatured: true,
          thumbnail: 'https://via.placeholder.com/400x300/A855F7/FFFFFF?text=Warehouse+Equipment',
          tags: JSON.stringify(['warehouse', 'forklift', 'storage', 'industrial']),
          authorId: creator.id,
          categoryId: categories[1].id
        }
      }),
      db.resource.upsert({
        where: { slug: 'business-consultation-package' },
        update: {},
        create: {
          title: 'Business Strategy Consultation Package',
          description: 'Expert business consultation services including market analysis, strategic planning, and growth optimization. Perfect for businesses looking to expand in Saudi market.',
          slug: 'business-consultation-package',
          content: 'Package includes: 20 hours of consultation, market analysis report, strategic planning session, and 3 months follow-up support.',
          price: 0,
          isFree: true,
          isPublished: true,
          isFeatured: true,
          thumbnail: 'https://via.placeholder.com/400x300/EAB308/FFFFFF?text=Business+Consultation',
          tags: JSON.stringify(['consultation', 'strategy', 'market-analysis', 'free']),
          authorId: creator.id,
          categoryId: categories[5].id
        }
      }),
      db.resource.upsert({
        where: { slug: 'delivery-vans-fleet' },
        update: {},
        create: {
          title: 'Delivery Vans Fleet - Weekly Rental',
          description: 'Modern delivery vans available for weekly rental. Perfect for businesses needing additional delivery capacity during peak seasons or special projects.',
          slug: 'delivery-vans-fleet',
          content: 'Fleet includes 3 modern delivery vans with GPS tracking, refrigeration options available, insurance included, and 24/7 roadside assistance.',
          price: 2800,
          isFree: false,
          isPublished: true,
          isFeatured: true,
          thumbnail: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Delivery+Vans',
          tags: JSON.stringify(['delivery', 'transportation', 'fleet', 'rental']),
          authorId: creator.id,
          categoryId: categories[4].id
        }
      })
    ])

    // Create some reviews if they don't exist
    await Promise.all([
      db.review.upsert({
        where: { userId_resourceId: { userId: regularUser.id, resourceId: resources[0].id } },
        update: {},
        create: {
          rating: 5,
          comment: 'Excellent office space! Perfect for our startup team.',
          userId: regularUser.id,
          resourceId: resources[0].id
        }
      }),
      db.review.upsert({
        where: { userId_resourceId: { userId: regularUser.id, resourceId: resources[1].id } },
        update: {},
        create: {
          rating: 4,
          comment: 'Great equipment, well-maintained and reliable.',
          userId: regularUser.id,
          resourceId: resources[1].id
        }
      }),
      db.review.upsert({
        where: { userId_resourceId: { userId: regularUser.id, resourceId: resources[2].id } },
        update: {},
        create: {
          rating: 5,
          comment: 'Invaluable business consultation, helped us grow significantly!',
          userId: regularUser.id,
          resourceId: resources[2].id
        }
      })
    ])

    // Create sample purchases
    await Promise.all([
      db.purchase.upsert({
        where: { userId_resourceId: { userId: regularUser.id, resourceId: resources[0].id } },
        update: {},
        create: {
          amount: resources[0].price,
          currency: 'SAR',
          paymentMethod: 'credit_card',
          paymentStatus: 'COMPLETED',
          paymentId: 'pay_demo_001',
          userId: regularUser.id,
          resourceId: resources[0].id
        }
      }),
      db.purchase.upsert({
        where: { userId_resourceId: { userId: regularUser.id, resourceId: resources[2].id } },
        update: {},
        create: {
          amount: 0,
          currency: 'SAR',
          paymentMethod: 'free',
          paymentStatus: 'COMPLETED',
          paymentId: 'free_demo_001',
          userId: regularUser.id,
          resourceId: resources[2].id
        }
      })
    ])

    return NextResponse.json({
      message: 'Database seeded successfully',
      categories: categories.length,
      resources: resources.length,
      users: 2,
      purchases: 2
    })
  } catch (error) {
    console.error('Failed to seed database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}