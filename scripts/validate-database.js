/**
 * Database Validation Script
 * Validates all migrated tables, relationships, and data integrity
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function validateDatabase() {
  const validationResults = {
    tables: {},
    relationships: {},
    dataIntegrity: {},
    performance: {},
    summary: { passed: 0, failed: 0, total: 0 }
  };

  try {
    console.log('🔍 Starting database validation...');

    // 1. Validate table structures
    console.log('\n📊 Validating table structures...');
    
    const tableValidations = [
      {
        name: 'users',
        query: () => prisma.user.count(),
        expectedCount: { min: 2 }
      },
      {
        name: 'categories',
        query: () => prisma.category.count(),
        expectedCount: { min: 6 }
      },
      {
        name: 'resources',
        query: () => prisma.resource.count(),
        expectedCount: { min: 3 }
      },
      {
        name: 'settings',
        query: () => prisma.setting.count(),
        expectedCount: { min: 7 }
      },
      {
        name: 'notifications',
        query: () => prisma.notification.count(),
        expectedCount: { min: 1 }
      },
      {
        name: 'purchases',
        query: () => prisma.purchase.count(),
        expectedCount: { min: 0 }
      },
      {
        name: 'payments',
        query: () => prisma.payment.count(),
        expectedCount: { min: 0 }
      },
      {
        name: 'reviews',
        query: () => prisma.review.count(),
        expectedCount: { min: 0 }
      }
    ];

    for (const table of tableValidations) {
      try {
        const count = await table.query();
        const passed = count >= table.expectedCount.min;
        
        validationResults.tables[table.name] = {
          passed,
          count,
          expected: table.expectedCount,
          status: passed ? '✅' : '❌'
        };
        
        console.log(`${passed ? '✅' : '❌'} ${table.name}: ${count} records (expected: >=${table.expectedCount.min})`);
        
        if (passed) validationResults.summary.passed++;
        else validationResults.summary.failed++;
        validationResults.summary.total++;
      } catch (error) {
        validationResults.tables[table.name] = {
          passed: false,
          error: error.message,
          status: '❌'
        };
        console.log(`❌ ${table.name}: Error - ${error.message}`);
        validationResults.summary.failed++;
        validationResults.summary.total++;
      }
    }

    // 2. Validate relationships
    console.log('\n🔗 Validating relationships...');
    
    const relationshipValidations = [
      {
        name: 'Resource-Category',
        query: async () => {
          const resources = await prisma.resource.findMany({ include: { category: true } });
          return resources.filter(r => r.category).length;
        },
        expected: { min: 3 }
      },
      {
        name: 'Resource-Author',
        query: async () => {
          const resources = await prisma.resource.findMany({ include: { author: true } });
          return resources.filter(r => r.author).length;
        },
        expected: { min: 3 }
      },
      {
        name: 'Published Resources',
        query: async () => {
          const published = await prisma.resource.count({
            where: { isPublished: true }
          });
          return published;
        },
        expected: { min: 3 }
      }
    ];

    for (const rel of relationshipValidations) {
      try {
        const count = await rel.query();
        const passed = count >= rel.expected.min;
        
        validationResults.relationships[rel.name] = {
          passed,
          count,
          expected: rel.expected,
          status: passed ? '✅' : '❌'
        };
        
        console.log(`${passed ? '✅' : '❌'} ${rel.name}: ${count} valid relationships (expected: >=${rel.expected.min})`);
        
        if (passed) validationResults.summary.passed++;
        else validationResults.summary.failed++;
        validationResults.summary.total++;
      } catch (error) {
        validationResults.relationships[rel.name] = {
          passed: false,
          error: error.message,
          status: '❌'
        };
        console.log(`❌ ${rel.name}: Error - ${error.message}`);
        validationResults.summary.failed++;
        validationResults.summary.total++;
      }
    }

    // 3. Validate Saudi-specific data
    console.log('\n🇸🇦 Validating Saudi market data...');
    
    const saudiValidations = [
      {
        name: 'Saudi Categories',
        query: async () => {
          const categories = await prisma.category.findMany({
            where: {
              OR: [
                { slug: 'office-spaces' },
                { slug: 'industrial-equipment' },
                { slug: 'legal-services' }
              ]
            }
          });
          return categories.length;
        },
        expected: { min: 3 }
      },
      {
        name: 'Saudi Resources',
        query: async () => {
          const resources = await prisma.resource.findMany({
            where: {
              OR: [
                { slug: 'premium-office-space-riyadh' },
                { slug: 'industrial-equipment-saudi-standards' },
                { slug: 'saudi-business-consultation' }
              ]
            }
          });
          return resources.length;
        },
        expected: { min: 3 }
      },
      {
        name: 'Saudi Settings',
        query: async () => {
          const settings = await prisma.setting.findMany({
            where: {
              OR: [
                { key: 'default_currency' },
                { key: 'timezone' },
                { key: 'working_days' }
              ]
            }
          });
          return settings.length;
        },
        expected: { min: 3 }
      }
    ];

    for (const saudi of saudiValidations) {
      try {
        const count = await saudi.query();
        const passed = count >= saudi.expected.min;
        
        validationResults.dataIntegrity[saudi.name] = {
          passed,
          count,
          expected: saudi.expected,
          status: passed ? '✅' : '❌'
        };
        
        console.log(`${passed ? '✅' : '❌'} ${saudi.name}: ${count} items (expected: >=${saudi.expected.min})`);
        
        if (passed) validationResults.summary.passed++;
        else validationResults.summary.failed++;
        validationResults.summary.total++;
      } catch (error) {
        validationResults.dataIntegrity[saudi.name] = {
          passed: false,
          error: error.message,
          status: '❌'
        };
        console.log(`❌ ${saudi.name}: Error - ${error.message}`);
        validationResults.summary.failed++;
        validationResults.summary.total++;
      }
    }

    // 4. Performance validation
    console.log('\n⚡ Validating performance indexes...');
    
    const performanceTests = [
      {
        name: 'Resource Query Performance',
        query: async () => {
          const start = Date.now();
          await prisma.resource.findMany({
            where: { isPublished: true },
            include: { category: true, author: true },
            take: 10
          });
          return Date.now() - start;
        },
        expected: { maxMs: 500 }
      },
      {
        name: 'User Query Performance',
        query: async () => {
          const start = Date.now();
          await prisma.user.findMany({
            where: { isActive: true },
            take: 10
          });
          return Date.now() - start;
        },
        expected: { maxMs: 200 }
      },
      {
        name: 'Category Query Performance',
        query: async () => {
          const start = Date.now();
          await prisma.category.findMany({
            where: { isActive: true },
            include: { _count: { select: { resources: true } } }
          });
          return Date.now() - start;
        },
        expected: { maxMs: 300 }
      }
    ];

    for (const perf of performanceTests) {
      try {
        const duration = await perf.query();
        const passed = duration <= perf.expected.maxMs;
        
        validationResults.performance[perf.name] = {
          passed,
          duration,
          expected: perf.expected,
          status: passed ? '✅' : '❌'
        };
        
        console.log(`${passed ? '✅' : '❌'} ${perf.name}: ${duration}ms (expected: <=${perf.expected.maxMs}ms)`);
        
        if (passed) validationResults.summary.passed++;
        else validationResults.summary.failed++;
        validationResults.summary.total++;
      } catch (error) {
        validationResults.performance[perf.name] = {
          passed: false,
          error: error.message,
          status: '❌'
        };
        console.log(`❌ ${perf.name}: Error - ${error.message}`);
        validationResults.summary.failed++;
        validationResults.summary.total++;
      }
    }

    // 5. Generate summary
    console.log('\n📋 Validation Summary:');
    console.log(`✅ Passed: ${validationResults.summary.passed}`);
    console.log(`❌ Failed: ${validationResults.summary.failed}`);
    console.log(`📊 Total: ${validationResults.summary.total}`);
    
    const successRate = (validationResults.summary.passed / validationResults.summary.total * 100).toFixed(1);
    console.log(`🎯 Success Rate: ${successRate}%`);

    if (validationResults.summary.failed === 0) {
      console.log('\n🎉 All validations passed! Database is ready for production.');
    } else {
      console.log('\n⚠️ Some validations failed. Please review the issues above.');
    }

    return validationResults;

  } catch (error) {
    console.error('❌ Database validation failed:', error);
    return {
      success: false,
      error: error.message
    };
  } finally {
    await prisma.$disconnect();
  }
}

validateDatabase()
  .then(results => {
    console.log('\n🏁 Database validation completed.');
    process.exit(results.summary?.failed === 0 ? 0 : 1);
  })
  .catch(error => {
    console.error('Validation script failed:', error);
    process.exit(1);
  });