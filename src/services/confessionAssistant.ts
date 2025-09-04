import OpenAI from "openai";
import { DEFAULT_LLM_MODEL, FALLBACK_LLM_MODEL } from "./keywordExtractor";

const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_AI || "";
const openai = new OpenAI({ apiKey });

export type ConfessionHistoryItem = { role: "user" | "assistant"; content: string };

export function buildConfessionMessages(history: ConfessionHistoryItem[]) {
  return [
    {
      role: "system" as const,
      content:
        "أنت مساعد ودود ومتفهّم للفضفضة. ادعم المستخدم بنبرة لطيفة، قدّم نصائح عملية عند اللزوم، واطرح أسئلة متابعة قصيرة للمساعدة. تجنّب الأحكام، واحفظ الخصوصية. إذا كان هناك خطر على السلامة، اقترح طلب مساعدة مختصة.",
    },
    ...history,
  ];
}

export async function generateConfessionReply(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  temperature = 0.3
): Promise<string> {
  let content = "";
  try {
    const completion = await openai.chat.completions.create({
      model: DEFAULT_LLM_MODEL,
      temperature,
      messages,
    });
    content = completion.choices?.[0]?.message?.content || "";
  } catch (e) {
    try {
      const completion = await openai.chat.completions.create({
        model: FALLBACK_LLM_MODEL,
        temperature,
        messages,
      });
      content = completion.choices?.[0]?.message?.content || "";
    } catch {
      content = "عذراً، تعذّر توليد رد الآن.";
    }
  }
  return content;
}
