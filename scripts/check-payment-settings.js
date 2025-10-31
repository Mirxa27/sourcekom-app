const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSettings() {
  try {
    const settings = await prisma.paymentSettings.findFirst();
    console.log('Payment settings:', JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSettings();

