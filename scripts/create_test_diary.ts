import { PrismaClient } from '../src/generated/prisma';
import dotenv from 'dotenv';
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function createTestDiary() {
  try {
    // Create a test diary entry
    const testDiary = await prisma.diary.create({
      data: {
        id: uuidv4(),
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        content: 'اليوم كان يوماً رائعاً! ذهبت إلى الحديقة ولعبت مع الأطفال. الطقس كان جميلاً والشمس ساطعة.',
        location: JSON.stringify({ lat: 24.7136, lng: 46.6753 }),
        emotion: 'happy',
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    console.log('✅ Test diary created:', testDiary.id);
    console.log('📝 Content:', testDiary.content);
    
    // Now trigger the diary endpoint to create a background job
    console.log('🚀 This should automatically create a background job for keyword normalization');
    
  } catch (error) {
    console.error('❌ Error creating test diary:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestDiary();
