// Script to test CONSENT_REQUEST notification creation
const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function createTestNotification() {
  try {
    // Use the admin2 user we created earlier
    const adminUser = await prisma.user.findFirst({
      where: { username: 'admin2' }
    });

    if (!adminUser) {
      console.log('Admin2 user not found. Please run seed_admin2.js first.');
      return;
    }

    // Create a test CONSENT_REQUEST notification
    const notification = await prisma.notification.create({
      data: {
        userId: adminUser.id,
        type: 'CONSENT_REQUEST',
        requestId: 'test-request-123',
        message: 'هناك من يريد الإطلاع على يوميتك ضمن نتائج البحث، هل ترغب بالسماح بذلك؟',
        title: 'طلب موافقة على البحث',
        read: false
      }
    });

    console.log('Test CONSENT_REQUEST notification created:', notification);
    console.log('Admin2 user ID:', adminUser.id);
    console.log('You can now test the frontend notification system.');

  } catch (error) {
    console.error('Error creating test notification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestNotification();
