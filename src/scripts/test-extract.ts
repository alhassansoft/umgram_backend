import { extractKeywords } from "../../src/services/keywordExtractor";

(async () => {
  const text = "أبحث عن شخص أنهى لعبة ريزدنت إيفل ١ أو Resident Evil 1";
  const out = await extractKeywords(text);
  console.log(JSON.stringify(out, null, 2));
})();
