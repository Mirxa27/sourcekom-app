/**
 * Digital Products Seeder
 * Populates the database with enhanced digital product categories and products
 */

import { db } from '@/lib/db'

const digitalProductCategories = [
  {
    name: 'Resource Management Templates',
    slug: 'resource-management-templates',
    description: 'Advanced templates for resource optimization, cost reduction, and ROI analysis',
    icon: '📊',
    color: '#10b981',
    isActive: true
  },
  {
    name: 'Saudi Business Documentation',
    slug: 'saudi-business-documentation',
    description: 'Specialized documentation for Saudi market entry, compliance, and business operations',
    icon: '🇸🇦',
    color: '#006c35',
    isActive: true
  },
  {
    name: 'Digital Asset Collections',
    slug: 'digital-asset-collections',
    description: 'High-quality business templates, forms, and marketing materials with Saudi context',
    icon: '🎨',
    color: '#8b5cf6',
    isActive: true
  },
  {
    name: 'Consulting Toolkits',
    slug: 'consulting-toolkits',
    description: 'Professional service delivery templates and client management tools',
    icon: '🎯',
    color: '#f59e0b',
    isActive: true
  },
  {
    name: 'Developer Resources',
    slug: 'developer-resources',
    description: 'API documentation and integration guides for third-party services',
    icon: '🔧',
    color: '#3b82f6',
    isActive: true
  },
  {
    name: 'Business Guides & Training',
    slug: 'business-guides-training',
    description: 'Comprehensive guides for Saudi business success and professional development',
    icon: '📚',
    color: '#ef4444',
    isActive: true
  }
]

const digitalProducts = [
  {
    title: 'Resource Utilization Tracker',
    description: 'Advanced resource monitoring and optimization tool with Saudi business calendar integration',
    slug: 'resource-utilization-tracker',
    content: `# Resource Utilization Tracker

Advanced resource monitoring tool designed specifically for Saudi businesses. Track, analyze, and optimize your resource allocation with real-time insights.

## Features
- Real-time utilization tracking
- Cost optimization recommendations  
- ROI analysis and reporting
- Saudi working hours integration
- Export to Excel/CSV
- Automated alerts and notifications

## Saudi Business Context
- Integrated with Saudi business calendar (Saturday-Thursday work week)
- Accounts for Saudi holidays and prayer times
- SAR currency support
- Saudization compliance tracking`,
    price: 299,
    originalPrice: 399,
    isFree: false,
    isPublished: true,
    isFeatured: true,
    fileUrl: '/products/templates/resource-utilization-tracker.js',
    fileFormat: 'JS',
    difficulty: 'Intermediate',
    duration: '2-4 hours setup',
    requirements: 'Node.js 14+, Modern browser, Spreadsheet software',
    productType: 'SOFTWARE',
    pricingTier: 'PROFESSIONAL',
    licenseType: 'COMMERCIAL',
    version: '2.1.0',
    fileSize: 256000,
    demoUrl: '/demo/resource-utilization-tracker',
    supportLevel: 'PREMIUM',
    features: JSON.stringify([
      'Real-time dashboard',
      'Automated reporting',
      'Saudi calendar integration',
      'Mobile responsive',
      'Multi-language support (English/Arabic)',
      'API access included'
    ]),
    categoryId: 'resource-management-templates'
  },
  {
    title: 'Cost Optimization Calculator',
    description: 'Comprehensive financial analysis tool for identifying cost reduction opportunities and optimizing resource allocation',
    slug: 'cost-optimization-calculator',
    content: `# Cost Optimization Calculator

Advanced financial analysis tool specifically designed for Saudi businesses. Identify cost reduction opportunities and optimize your resource allocation.

## Features
- Personnel cost analysis with Saudization tracking
- Facility optimization recommendations
- Technology ROI assessment
- VAT and tax optimization
- Scenario modeling and projections
- Saudi market benchmarks

## Saudi-Specific Features
- Saudization compliance analysis
- VAT optimization (15% rate)
- Minimum wage compliance checking
- Saudi market rate comparisons
- Labor law compliance tracking`,
    price: 399,
    originalPrice: 599,
    isFree: false,
    isPublished: true,
    isFeatured: true,
    fileUrl: '/products/templates/cost-optimization-calculator.js',
    fileFormat: 'JS',
    difficulty: 'Intermediate',
    duration: '3-5 hours setup',
    requirements: 'Node.js 14+, Excel or equivalent, Financial data access',
    productType: 'SOFTWARE',
    pricingTier: 'PROFESSIONAL',
    licenseType: 'COMMERCIAL',
    version: '1.5.0',
    fileSize: 324000,
    demoUrl: '/demo/cost-optimization-calculator',
    supportLevel: 'PREMIUM',
    features: JSON.stringify([
      'Saudization analysis',
      'VAT optimization tools',
      'Saudi market benchmarks',
      'Export capabilities',
      'Multi-scenario modeling',
      'Interactive dashboards'
    ]),
    categoryId: 'resource-management-templates'
  },
  {
    title: 'Saudi Company Registration Checklist',
    description: 'Complete 27-step guide for business registration in Saudi Arabia with 2024 Vision 2030 updates',
    slug: 'saudi-company-registration-checklist',
    content: `# Saudi Company Registration Checklist

Comprehensive 27-step guide covering all requirements for company registration in Saudi Arabia, including recent Vision 2030 updates.

## What's Included
- Complete step-by-step registration process
- Document preparation checklists
- Government contact information
- Timeline estimates and critical path
- Common pitfalls to avoid
- Post-registration compliance requirements

## Updated for 2024
- Vision 2030 initiative alignment
- Digital transformation updates
- New MISA procedures
- Updated fee structures
- Recent regulatory changes

## Sections Covered
1. Pre-Registration Requirements
2. Document Preparation
3. Office and Location Setup
4. Government Approvals
5. Employment and Saudization
6. Banking and Finance
7. Post-Registration Compliance`,
    price: 299,
    originalPrice: null,
    isFree: false,
    isPublished: true,
    isFeatured: false,
    fileUrl: '/products/saudi-business/company-registration-checklist.md',
    fileFormat: 'MD',
    difficulty: 'Beginner',
    duration: '30-60 minutes read',
    requirements: 'PDF reader, Email for document storage',
    productType: 'GUIDE',
    pricingTier: 'BASIC',
    licenseType: 'STANDARD',
    version: '3.2.0',
    fileSize: 145000,
    demoUrl: null,
    supportLevel: 'STANDARD',
    features: JSON.stringify([
      '27 comprehensive steps',
      'Government contact directory',
      'Timeline planning tools',
      'Document templates',
      'Compliance checklists',
      'Regular updates included'
    ]),
    categoryId: 'saudi-business-documentation'
  },
  {
    title: 'Saudi Business Website Template',
    description: 'Professional responsive website template with Arabic/English support and Saudi cultural design elements',
    slug: 'saudi-business-website-template',
    content: `# Saudi Business Website Template

Professional website template specifically designed for Saudi businesses with full Arabic/English support and cultural design elements.

## Features
- Fully responsive design
- Arabic/English language support
- RTL layout optimization
- Saudi cultural design elements
- SEO optimized for Saudi market
- Mobile-first approach
- Contact forms integration
- Social media integration

## Design Elements
- Saudi color scheme (green, white, gold)
- Cultural patterns and motifs
- Arabic typography support
- Prayer time integration
- Saudi business hours display
- Holiday awareness

## Pages Included
- Homepage with hero section
- About Us page
- Services/Products showcase
- Contact page with forms
- Blog/News section
- Gallery portfolio
- Team page`,
    price: 599,
    originalPrice: 799,
    isFree: false,
    isPublished: true,
    isFeatured: true,
    fileUrl: '/products/digital-assets/saudi-business-website-template.html',
    fileFormat: 'HTML',
    difficulty: 'Beginner',
    duration: '1-2 hours customization',
    requirements: 'Web hosting, Basic HTML knowledge',
    productType: 'TEMPLATE',
    pricingTier: 'PROFESSIONAL',
    licenseType: 'COMMERCIAL',
    version: '1.0.0',
    fileSize: 1850000,
    demoUrl: '/demo/saudi-business-website',
    supportLevel: 'PREMIUM',
    features: JSON.stringify([
      'Arabic/English support',
      'Mobile responsive',
      'SEO optimized',
      'Contact forms',
      'Social media integration',
      'Cultural design elements'
    ]),
    categoryId: 'digital-asset-collections'
  },
  {
    title: 'Service Delivery Templates',
    description: 'Professional consulting service delivery framework with Saudi business context and project management tools',
    slug: 'service-delivery-templates',
    content: `# Service Delivery Templates

Comprehensive consulting service delivery framework designed specifically for Saudi businesses with project management tools and templates.

## Templates Included
- Project initiation templates
- Client onboarding workflows
- Progress reporting formats
- Deliverable templates
- Quality assurance checklists
- Closure processes

## Saudi Business Context
- Saudi business calendar integration
- Risk management for Saudi market
- Cultural communication guidelines
- Government approval workflows
- Local compliance tracking

## Project Management Features
- Timeline planning with Saudi holidays
- Resource allocation templates
- Budget tracking in SAR
- Stakeholder management
- Quality assurance processes
- Client communication plans`,
    price: 499,
    originalPrice: 699,
    isFree: false,
    isPublished: true,
    isFeatured: false,
    fileUrl: '/products/consulting/service-delivery-templates.js',
    fileFormat: 'JS',
    difficulty: 'Intermediate',
    duration: '2-3 hours setup',
    requirements: 'Project management experience, Basic JavaScript',
    productType: 'TEMPLATE',
    pricingTier: 'PROFESSIONAL',
    licenseType: 'COMMERCIAL',
    version: '2.0.0',
    fileSize: 512000,
    demoUrl: '/demo/service-delivery-templates',
    supportLevel: 'PREMIUM',
    features: JSON.stringify([
      'Saudi business calendar',
      'Risk management tools',
      'Quality templates',
      'Client workflows',
      'Project tracking',
      'Multi-language support'
    ]),
    categoryId: 'consulting-toolkits'
  },
  {
    title: 'API Documentation Template',
    description: 'Professional API documentation framework with Saudi business compliance and developer integration guides',
    slug: 'api-documentation-template',
    content: `# API Documentation Template

Comprehensive API documentation framework designed for Saudi market applications with developer integration guides and compliance requirements.

## Documentation Sections
- API overview and getting started
- Authentication and security
- Complete endpoint documentation
- Data models and schemas
- Error handling and troubleshooting
- Rate limiting and performance
- SDKs and libraries
- Testing and sandbox environment

## Saudi-Specific Features
- Saudi business hours optimization
- Arabic language support guidelines
- Data compliance requirements
- Rate limiting for Saudi context
- Local support documentation
- Cultural considerations

## Developer Resources
- Code examples in multiple languages
- Postman collections
- OpenAPI specifications
- Interactive API explorer
- Sample applications
- Integration guides`,
    price: 499,
    originalPrice: null,
    isFree: false,
    isPublished: true,
    isFeatured: false,
    fileUrl: '/products/integrations/api-documentation-template.md',
    fileFormat: 'MD',
    difficulty: 'Advanced',
    duration: '4-6 hours implementation',
    requirements: 'API development experience, Documentation tools',
    productType: 'DOCUMENTATION',
    pricingTier: 'PROFESSIONAL',
    licenseType: 'COMMERCIAL',
    version: '1.2.0',
    fileSize: 298000,
    demoUrl: null,
    supportLevel: 'STANDARD',
    features: JSON.stringify([
      'Complete API docs template',
      'Saudi compliance guidelines',
      'Multi-language examples',
      'Interactive templates',
      'Code samples',
      'Best practices guide'
    ]),
    categoryId: 'developer-resources'
  }
]

export async function seedDigitalProducts() {
  try {
    console.log('Starting digital products seeding...')

    // Seed categories first
    for (const categoryData of digitalProductCategories) {
      const existingCategory = await db.category.findUnique({
        where: { slug: categoryData.slug }
      })

      if (!existingCategory) {
        await db.category.create({
          data: categoryData
        })
        console.log(`Created category: ${categoryData.name}`)
      } else {
        console.log(`Category already exists: ${categoryData.name}`)
      }
    }

    // Get category IDs
    const categories = await db.category.findMany({
      where: {
        slug: {
          in: digitalProductCategories.map(c => c.slug)
        }
      }
    })

    const categoryMap = categories.reduce((acc, category) => {
      acc[category.slug] = category.id
      return acc
    }, {} as Record<string, string>)

    // Get or create admin user for products
    let adminUser = await db.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      adminUser = await db.user.create({
        data: {
          email: 'admin@sourcekom.com',
          name: 'SourceKom Admin',
          password: '$2b$10$examplehashedpassword', // In production, use proper hashing
          role: 'ADMIN',
          isActive: true
        }
      })
      console.log('Created admin user for products')
    }

    // Seed products
    for (const productData of digitalProducts) {
      const existingProduct = await db.resource.findUnique({
        where: { slug: productData.slug }
      })

      if (!existingProduct) {
        await db.resource.create({
          data: {
            ...productData,
            authorId: adminUser.id,
            categoryId: categoryMap[productData.categoryId]
          }
        })
        console.log(`Created product: ${productData.title}`)
      } else {
        console.log(`Product already exists: ${productData.title}`)
      }
    }

    console.log('Digital products seeding completed successfully!')
    return { success: true, message: 'Digital products seeded successfully' }

  } catch (error) {
    console.error('Error seeding digital products:', error)
    return { success: false, error: error.message }
  }
}

// Export for use in API route
export default seedDigitalProducts