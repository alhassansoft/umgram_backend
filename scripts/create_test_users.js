const { PrismaClient } = require('../src/generated/prisma/index.js');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    console.log('🔄 Creating test users...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@local' },
      update: {
        role: 'admin',
        password: adminPassword
      },
      create: {
        username: 'admin_test',
        email: 'admin@local',
        password: adminPassword,
        role: 'admin',
        profileImage: null
      }
    });

    // Create regular user
    const userPassword = await bcrypt.hash('password123', 10);
    const regularUser = await prisma.user.upsert({
      where: { email: 'user@local' },
      update: {
        role: 'user',
        password: userPassword
      },
      create: {
        username: 'user_test',
        email: 'user@local',
        password: userPassword,
        role: 'user',
        profileImage: null
      }
    });

    console.log('✅ Test users created successfully!');
    console.log('👑 Admin user:', {
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role
    });
    console.log('👤 Regular user:', {
      username: regularUser.username,
      email: regularUser.email,
      role: regularUser.role
    });

    console.log('\n📋 Test Credentials:');
    console.log('Admin - Email: admin@local, Password: admin123');
    console.log('User - Email: user@local, Password: password123');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
