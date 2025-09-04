// Runs periodically to extract entities/actions from chat messages and store into entity_extractions as content_type='chat'
import { pool } from "../db";
import { extractKeywords, DEFAULT_LLM_MODEL } from "../services/keywordExtractor";
import { saveExtraction } from "../services/extractions";

// Process up to N conversations per run; mark processed to avoid duplication
const BATCH_LIMIT = Number(process.env.CHAT_EXTRACT_BATCH_LIMIT ?? 50);

async function listUnprocessedConversations(limit: number) {
  // For the new direct chat schema: pick conversations with no chat-type extraction yet
  const q = `
    SELECT dc.id::text AS id
    FROM direct_conversations dc
    LEFT JOIN entity_extractions e ON e.content_type = 'chat' AND e.content_id = dc.id::text
    WHERE e.id IS NULL
    ORDER BY dc.updated_at DESC
    LIMIT $1
  `;
  const { rows } = await pool.query(q, [limit]);
  return rows as { id: string }[] as any;
}

async function getConversationText(convId: string): Promise<{ text: string; userId: string | null }> {
  const sql = `
    SELECT m.text, m.created_at
    FROM direct_messages m
    WHERE m.conversation_id = $1
    ORDER BY m.created_at ASC
  `;
  const { rows } = await pool.query(sql, [convId]);
  const texts = rows.map(r => (r.text || '').toString().trim()).filter(Boolean);
  const full = texts.join("\n\n");
  // direct_conversations have no owner; keep null so extraction is tied to the conversation only
  return { text: full, userId: null };
}

export async function runChatExtractionOnce() {
  const candidates = await listUnprocessedConversations(BATCH_LIMIT);
  for (const c of candidates) {
    const { text, userId } = await getConversationText((c as any).id);
    if (!text.trim()) {
      // Still mark as processed with empty payload to avoid retry loops
      await saveExtraction({
        contentType: 'chat',
        contentId: (c as any).id,
        userId: userId ?? null,
        payload: { text: '', entities: [], clauses: [], relations: [], affirmed_actions: [], negated_actions: [] },
        model: DEFAULT_LLM_MODEL,
        promptVersion: 'v1',
        inputTextForHash: '',
      });
      continue;
    }

    const payload = await extractKeywords(text, { model: DEFAULT_LLM_MODEL, temperature: 0 });
    await saveExtraction({
      contentType: 'chat',
      contentId: (c as any).id,
      userId: userId ?? null,
      payload,
      model: DEFAULT_LLM_MODEL,
      promptVersion: 'v1',
      inputTextForHash: text,
    });
  }
}

// Simple scheduler: run daily
export function scheduleChatExtraction() {
  const hours = Number(process.env.CHAT_EXTRACT_INTERVAL_HOURS ?? 24);
  const intervalMs = Math.max(1, hours) * 60 * 60 * 1000;
  // Run at startup, then at interval
  runChatExtractionOnce().catch((e) => console.warn('[chatExtraction] first run failed:', e?.message || e));
  setInterval(() => {
    runChatExtractionOnce().catch((e) => console.warn('[chatExtraction] run failed:', e?.message || e));
  }, intervalMs);
}
