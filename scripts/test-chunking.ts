// Test script for text chunking functionality
import { chunkText, shouldChunkText, estimateTokenCount } from '../src/services/textChunker';
import { normalizeKeywordsChunked } from '../src/services/keywordNormalizerChunked';

// Test text samples
const shortText = "ذهبت إلى المدرسة اليوم وحللت واجب الفيزياء";

const mediumText = `
اليوم كان يوماً مثيراً في الجامعة. بدأت اليوم بحضور محاضرة الفيزياء الكمية مع الدكتور أحمد، وكان الموضوع معقداً جداً حول مبدأ عدم اليقين لهايزنبرغ. حاولت أن أفهم المعادلات الرياضية، لكنني واجهت صعوبة في ربط المفاهيم النظرية بالتطبيقات العملية.

بعد المحاضرة، ذهبت إلى المكتبة مع زميلتي سارة لحل واجبات الكيمياء العضوية. كانت المسائل تتعلق بتفاعلات الألكين والألكان، وقضينا ساعتين في محاولة فهم آلية التفاعل. في النهاية، استطعنا حل معظم المسائل بمساعدة كتاب مرجعي إضافي.

في المساء، حضرت اجتماع النادي العلمي حيث ناقشنا مشروع البحث الجماعي حول الطاقة المتجددة. اقترحت دراسة كفاءة الألواح الشمسية في المناخ الصحراوي، وحصلت الفكرة على إعجاب الأعضاء. قررنا أن نبدأ بجمع البيانات الأولية الأسبوع القادم.
`;

const longText = `
اليوم الأحد كان يوماً استثنائياً بكل معنى الكلمة، مليئاً بالأحداث والتجارب المتنوعة التي أثرت في نفسي تأثيراً عميقاً. استيقظت في الساعة السادسة صباحاً على صوت المطر الخفيف الذي بدأ ينهمر على نوافذ غرفتي، وكان هذا الصوت بمثابة موسيقى هادئة تبعث في النفس السكينة والطمأنينة. نهضت من فراشي وأنا أشعر بنشاط غير عادي، ربما بسبب النوم العميق الذي نعمت به في الليلة السابقة.

بدأت يومي بأداء صلاة الفجر في المسجد القريب من المنزل، حيث التقيت بالجد محمد الذي يحرص دائماً على أداء الصلاة في وقتها. تحدثنا بعد الصلاة عن أهمية الاستيقاظ المبكر وكيف أن هذا الوقت من اليوم هو الأكثر بركة وإنتاجية. نصحني بقراءة سورة الكهف كاملة كل جمعة، وأن أجعل من القرآن الكريم رفيقاً دائماً في حياتي اليومية.

عدت إلى المنزل وتناولت إفطاراً خفيفاً يتكون من الشاي الأحمر مع البسكويت والعسل الطبيعي الذي اشتراه والدي من المزرعة المحلية. أثناء تناول الإفطار، راجعت جدولي اليومي وخططت للمهام التي يجب إنجازها. كان لدي امتحان في مادة الكيمياء العضوية يوم الثلاثاء، لذا قررت أن أخصص معظم اليوم لمراجعة المنهج والتحضير للامتحان.

في الساعة الثامنة، بدأت بمراجعة الفصل الأول من كتاب الكيمياء العضوية، والذي يتناول تصنيف المركبات العضوية وخصائصها الأساسية. واجهت صعوبة في فهم بعض المفاهيم المعقدة مثل الرنين في الجزيئات العضوية والاستقرار النسبي للكربوكاتيونات. قررت أن أبحث عن مصادر إضافية على الإنترنت لمساعدتي في فهم هذه المفاهيم بشكل أفضل.

وجدت موقعاً إلكترونياً مفيداً يحتوي على شروحات مبسطة ومقاطع فيديو توضيحية. قضيت ساعة كاملة في مشاهدة هذه المقاطع وتدوين الملاحظات المهمة. بعد ذلك، حاولت حل بعض المسائل التطبيقية من الكتاب، وكانت النتائج مشجعة حيث تمكنت من حل 8 مسائل من أصل 10 بشكل صحيح.

في الساعة الحادية عشرة، اتصلت بزميلي كريم لنناقش بعض النقاط الغامضة في المنهج. كريم طالب متفوق في الكيمياء ولديه فهم عميق للمادة. شرح لي مفهوم الحموضة والقاعدية في المركبات العضوية بطريقة مبسطة وعملية، مما ساعدني كثيراً في تعزيز فهمي للموضوع. اتفقنا على أن نلتقي غداً في المكتبة لمراجعة جماعية قبل الامتحان.

بعد انتهاء المكالمة، قررت أن آخذ استراحة قصيرة وأتناول وجبة خفيفة. أعدت لنفسي ساندويش بالجبن والطماطم مع كوب من العصير الطبيعي. أثناء تناول الطعام، تصفحت الأخبار على هاتفي المحمول وقرأت عن آخر التطورات في مجال الطاقة المتجددة، وهو موضوع أهتم به كثيراً ويرتبط بتخصصي الأكاديمي.

في الساعة الثانية بعد الظهر، عاودت المراجعة ولكن هذه المرة ركزت على الفصل الثاني المتعلق بالتفاعلات الكيميائية وآلياتها. هذا الفصل يحتوي على معلومات كثيفة ومعقدة، خاصة فيما يتعلق بأنواع التفاعلات المختلفة مثل تفاعلات الإضافة والحذف والاستبدال. رسمت مخططات توضيحية لمساعدتي في حفظ وفهم هذه التفاعلات، وهي طريقة تعلم أجدها فعالة جداً.

في الساعة الرابعة، قررت أن أخرج من المنزل لتغيير الأجواء والحصول على هواء نقي. ذهبت إلى الحديقة العامة القريبة ومارست رياضة المشي لمدة نصف ساعة. كان الطقس جميلاً والمطر قد توقف، مما جعل الهواء منعشاً ومليئاً بروائح الأرض الرطبة والنباتات الخضراء. التقيت بعمي سعد الذي كان يمارس رياضة الجري، وتحدثنا عن أهمية الرياضة في حياة الطالب وكيف أنها تساعد على تحسين التركيز والذاكرة.

عدت إلى المنزل في الساعة الخامسة وقررت أن أواصل المراجعة ولكن بطريقة مختلفة. بدلاً من القراءة السلبية، قررت أن أقوم بتلخيص كل فصل في نقاط محددة وواضحة. هذه الطريقة تساعدني على تثبيت المعلومات في الذاكرة طويلة المدى وتسهل عملية المراجعة اللاحقة. قضيت ساعتين في إعداد هذه الملخصات، وشعرت بالرضا عن النتيجة النهائية.

في المساء، بعد تناول وجبة العشاء مع العائلة، جلست مع والدي وتحدثنا عن خططي المستقبلية وطموحاتي المهنية. والدي رجل حكيم ولديه خبرة واسعة في الحياة، وهو دائماً ما يقدم لي النصائح القيمة والتوجيهات السليمة. نصحني بأن أركز على تطوير مهاراتي العملية بجانب التحصيل الأكاديمي، وأن أبحث عن فرص التدريب والتطوع في مجال تخصصي.

قبل النوم، قضيت بعض الوقت في قراءة كتاب "عادات الأشخاص الأكثر فعالية" لستيفن كوفي، وهو كتاب أنصح به كل طالب لأنه يحتوي على مبادئ عملية لتطوير الذات وتحسين الإنتاجية. قرأت فصلاً كاملاً عن إدارة الوقت وترتيب الأولويات، وهي مهارات أعتبرها ضرورية لنجاح أي طالب جامعي.

انتهى هذا اليوم الطويل والمثمر بشعور بالرضا والإنجاز. تمكنت من مراجعة قدر كبير من المنهج، وتعلمت أشياء جديدة، وقضيت وقتاً مفيداً مع الأهل والأصدقاء. أشعر بالثقة في قدرتي على النجاح في امتحان الغد، وأتطلع إلى بداية أسبوع جديد مليء بالتحديات والفرص.
`;

async function testChunking() {
  console.log("=== Testing Text Chunking ===\n");

  // Test token estimation
  console.log("Token estimation tests:");
  console.log(`Short text (${shortText.length} chars): ~${estimateTokenCount(shortText)} tokens`);
  console.log(`Medium text (${mediumText.length} chars): ~${estimateTokenCount(mediumText)} tokens`);
  console.log(`Long text (${longText.length} chars): ~${estimateTokenCount(longText)} tokens\n`);

  // Test shouldChunkText
  console.log("Should chunk tests:");
  console.log(`Short text should chunk: ${shouldChunkText(shortText)}`);
  console.log(`Medium text should chunk: ${shouldChunkText(mediumText)}`);
  console.log(`Long text should chunk: ${shouldChunkText(longText)}\n`);

  // Test chunking function
  console.log("=== Chunking Results ===");
  
  const shortChunks = chunkText(shortText);
  console.log(`\nShort text chunks: ${shortChunks.length}`);
  shortChunks.forEach((chunk, i) => {
    console.log(`  Chunk ${i + 1}: "${chunk.text.substring(0, 50)}..." (${chunk.text.length} chars)`);
  });

  const mediumChunks = chunkText(mediumText);
  console.log(`\nMedium text chunks: ${mediumChunks.length}`);
  mediumChunks.forEach((chunk, i) => {
    console.log(`  Chunk ${i + 1}: "${chunk.text.substring(0, 50)}..." (${chunk.text.length} chars)`);
  });

  const longChunks = chunkText(longText, { maxChars: 2000, overlap: 150 });
  console.log(`\nLong text chunks: ${longChunks.length}`);
  longChunks.forEach((chunk, i) => {
    console.log(`  Chunk ${i + 1}: "${chunk.text.substring(0, 50)}..." (${chunk.text.length} chars, complete: ${chunk.isComplete})`);
  });
}

async function testChunkedNormalization() {
  console.log("\n=== Testing Chunked Normalization ===\n");

  try {
    console.log("Testing short text (should use regular normalizer):");
    const startTime1 = Date.now();
    const result1 = await normalizeKeywordsChunked(shortText, {
      maxTokensPerChunk: 1500,
      mergeStrategy: 'intelligent'
    });
    const time1 = Date.now() - startTime1;
    console.log(`  Processed in ${time1}ms`);
    console.log(`  Entities found: ${result1.entities?.length || 0}`);
    console.log(`  Clauses found: ${result1.clauses?.length || 0}`);
    console.log(`  Actions found: ${result1.affirmed_actions?.length || 0} affirmed, ${result1.negated_actions?.length || 0} negated\n`);

    console.log("Testing long text (should use chunked normalizer):");
    const startTime2 = Date.now();
    const result2 = await normalizeKeywordsChunked(longText, {
      maxTokensPerChunk: 1500,
      mergeStrategy: 'intelligent'
    });
    const time2 = Date.now() - startTime2;
    console.log(`  Processed in ${time2}ms`);
    console.log(`  Entities found: ${result2.entities?.length || 0}`);
    console.log(`  Clauses found: ${result2.clauses?.length || 0}`);
    console.log(`  Actions found: ${result2.affirmed_actions?.length || 0} affirmed, ${result2.negated_actions?.length || 0} negated`);
    console.log(`  En simple entities: ${result2.en_simple?.entities?.length || 0}`);
    console.log(`  En simple actions: ${result2.en_simple?.actions?.length || 0}\n`);

    // Test simple merge strategy
    console.log("Testing simple merge strategy:");
    const startTime3 = Date.now();
    const result3 = await normalizeKeywordsChunked(longText, {
      maxTokensPerChunk: 1500,
      mergeStrategy: 'simple'
    });
    const time3 = Date.now() - startTime3;
    console.log(`  Processed in ${time3}ms`);
    console.log(`  Entities found: ${result3.entities?.length || 0}`);
    console.log(`  Clauses found: ${result3.clauses?.length || 0}`);

  } catch (error) {
    console.error("Error during chunked normalization test:", error);
  }
}

// Run tests
if (require.main === module) {
  testChunking()
    .then(() => testChunkedNormalization())
    .then(() => {
      console.log("\n=== All tests completed ===");
      process.exit(0);
    })
    .catch(error => {
      console.error("Test failed:", error);
      process.exit(1);
    });
}

export { testChunking, testChunkedNormalization };
