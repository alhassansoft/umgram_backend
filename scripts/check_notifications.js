#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function checkLatestNotifications() {
  const prisma = new PrismaClient();
  
  try {
    // Get the latest 5 notifications
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    
    console.log('Latest notifications:');
    console.log('='.repeat(60));
    
    notifications.forEach((notif, index) => {
      console.log(`${index + 1}. Type: ${notif.type}`);
      console.log(`   Message: ${notif.message}`);
      console.log(`   Created: ${notif.createdAt}`);
      console.log(`   User ID: ${notif.userId}`);
      console.log('-'.repeat(50));
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkLatestNotifications();
