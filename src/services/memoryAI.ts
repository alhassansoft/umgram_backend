import OpenAI from "openai";

export type MemoryAIAction =
  | { type: "create_table"; tableName: string; columns: string[]; items?: Record<string, string>[] }
  | { type: "add_rows"; tableName?: string; rows: Record<string, string>[] }
  | { type: "add_columns"; tableName?: string; columns: string[] }
  | { type: "rename_table"; tableName?: string; newName: string }
  | { type: "rename_column"; tableName?: string; oldName: string; newName: string };

export type MemoryAIPlan = {
  reasoning?: string;
  actions: MemoryAIAction[];
};

const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_AI || "";
if (!apiKey) console.warn("[memoryAI] OPENAI_API_KEY missing");
const openai = new OpenAI({ apiKey });

const FALLBACK_MODEL = "gpt-4o-mini";
const MODEL = process.env.LLM_MODEL || process.env.OPENAI_CHAT_MODEL || "gpt-5-preview";

export async function planMemoryActions(prompt: string, context?: {
  userLocale?: string;
  currentTable?: { name: string; columns: string[]; sampleRows?: Record<string, string>[] } | null;
  existingTables?: { name: string; columns: string[] }[];
}): Promise<MemoryAIPlan> {
  const sys = `You are an assistant that plans structured actions for a user's personal memory tables.
Return STRICT JSON only matching this TypeScript type (no prose):
{
  "reasoning"?: string,
  "actions": Array<
    | { "type": "create_table", "tableName": string, "columns": string[], "items"?: Array<Record<string,string>> }
    | { "type": "add_rows", "tableName"?: string, "rows": Array<Record<string,string>> }
    | { "type": "add_columns", "tableName"?: string, "columns": string[] }
    | { "type": "rename_table", "tableName"?: string, "newName": string }
    | { "type": "rename_column", "tableName"?: string, "oldName": string, "newName": string }
  >
}

Rules:
- Use Arabic names if user prompt is Arabic.
- Prefer referencing the current table by leaving tableName undefined when the intent clearly targets the active table context.
- When adding rows, keys in each row object MUST be column names.
- Never include empty rows. Each row must contain at least one non-empty value (after trimming). Remove rows that are entirely empty.
- Keep actions minimal and deterministic. If the user says "add 3 items", produce add_rows with exactly 3 rows.
- If the user asks to create a new table with a name, include create_table first, then add_rows with that same tableName.
- If columns needed are not present, add an add_columns action first for missing columns.
`;

  const ctx = {
    userLocale: context?.userLocale || "ar",
    currentTable: context?.currentTable || null,
    existingTables: context?.existingTables || [],
  };

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: sys },
    {
      role: "user",
      content: JSON.stringify({
        prompt,
        context: ctx,
      }),
    },
  ];

  let resp;
  try {
    resp = await openai.chat.completions.create({
      model: MODEL || FALLBACK_MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" } as any,
      messages,
    });
  } catch (e: any) {
    const msg = String(e?.message || e);
    const code = e?.code || e?.status;
    // Fallback when the configured model is not found/authorized
    if (msg.includes("does not exist") || msg.includes("model_not_found") || code === 404) {
      resp = await openai.chat.completions.create({
        model: FALLBACK_MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" } as any,
        messages,
      });
    } else {
      throw e;
    }
  }

  const content = resp.choices?.[0]?.message?.content || "{}";
  let parsed: MemoryAIPlan | null = null;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    console.warn("[memoryAI] JSON parse failed, falling back to empty actions", e);
  }
  if (!parsed || !Array.isArray(parsed.actions)) return { reasoning: "no_actions", actions: [] };
  return parsed;
}
