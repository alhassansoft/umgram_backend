// Simple test for chunking functionality
import { chunkText, shouldChunkText } from '../src/services/textChunker';

const longArabicText = `
هذا نص طويل جداً يحتوي على كثير من التفاصيل والأحداث المتنوعة. 
استيقظت صباح اليوم في الساعة السادسة وتناولت إفطاراً خفيفاً يتكون من الشاي والبسكويت.
ثم ذهبت إلى الجامعة وحضرت محاضرة الفيزياء مع الدكتور أحمد.
كان الموضوع معقداً وصعباً جداً ولكنني حاولت أن أفهم قدر الإمكان.

بعد المحاضرة ذهبت إلى المكتبة مع زميلتي سارة وقضينا ساعتين في حل واجبات الكيمياء.
المسائل كانت صعبة وتحتاج إلى تركيز عالي وفهم عميق للمفاهيم الأساسية.
في النهاية تمكنا من حل معظم المسائل بمساعدة الكتب المرجعية.

في المساء حضرت اجتماع النادي العلمي ناقشنا فيه مشروع البحث الجماعي.
اقترحت دراسة موضوع الطاقة المتجددة وخاصة الطاقة الشمسية في المناطق الصحراوية.
الفكرة حصلت على إعجاب الأعضاء وقررنا البدء في جمع البيانات الأسبوع القادم.

عدت إلى المنزل في الساعة الثامنة مساءً وتناولت العشاء مع العائلة.
تحدثنا عن أحداث اليوم وخططنا للأسبوع القادم والمهام المطلوبة.
بعد العشاء قضيت بعض الوقت في مراجعة الدروس وحل التمارين.

قبل النوم قرأت فصلاً من كتاب التطوير الذاتي وكتبت هذه المذكرة في اليومية.
أشعر بالرضا عن هذا اليوم المثمر وأتطلع لأسبوع جديد مليء بالإنجازات.
الحمد لله على كل النعم والتوفيق في الدراسة والحياة بشكل عام.
`;

console.log("Testing text chunking functionality...\n");

console.log(`Original text length: ${longArabicText.length} characters`);
console.log(`Should chunk this text: ${shouldChunkText(longArabicText)}\n`);

const chunks = chunkText(longArabicText, {
  maxChars: 500,
  overlap: 50,
  preserveSentences: true
});

console.log(`Text was split into ${chunks.length} chunks:\n`);

chunks.forEach((chunk, index) => {
  console.log(`--- Chunk ${index + 1} ---`);
  console.log(`Length: ${chunk.text.length} characters`);
  console.log(`Range: ${chunk.start}-${chunk.end}`);
  console.log(`Complete: ${chunk.isComplete}`);
  console.log(`Preview: ${chunk.text.substring(0, 100)}...`);
  console.log();
});

console.log("✅ Chunking test completed successfully!");
