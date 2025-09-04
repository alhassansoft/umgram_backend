import { Router } from "express";
import { startChallenge, nextClue, checkGuess, createSessionToken, verifySessionToken } from "../services/challengeGame";

function getChallengeModelInfo() {
  const model = process.env.CHALLENGE_MODEL
    || process.env.OPENAI_FINETUNED_CHALLENGE_MODEL
    || process.env.LLM_MODEL
    || process.env.OPENAI_CHAT_MODEL
    || "gpt-4o-mini";
  const fineTuned = typeof model === "string" && model.startsWith("ft:");
  return { model, fineTuned };
}

const router = Router();

// Start a new challenge (optional topic)
router.post("/api/challenge/start", async (req, res) => {
  try {
    const topic = typeof req.body?.topic === "string" ? req.body.topic : undefined;
    const out = await startChallenge(topic);
    const token = createSessionToken({ secret: out.secret, topic });
  const svcModel = (out as any)?.modelUsed;
  const info = svcModel ? { model: svcModel, fineTuned: svcModel.startsWith("ft:") } : getChallengeModelInfo();
  res.json({ ok: true, token, clue: out.first_clue, engine: info.fineTuned ? "fine-tuned" : "prompt", model: info.model });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: String(e?.message || e) });
  }
});

// Get next clue
router.post("/api/challenge/clue", async (req, res) => {
  try {
    const token = String(req.body?.token || "");
    const previous: string[] = Array.isArray(req.body?.previous) ? req.body.previous : [];
    const lang: string | undefined = typeof req.body?.language === "string" ? req.body.language : undefined;
    const verified = verifySessionToken(token);
    if (!verified) return res.status(401).json({ ok: false, error: "invalid token" });
    const out = await nextClue(verified.secret, previous, lang);
  const svcModel = (out as any)?.modelUsed;
  const info = svcModel ? { model: svcModel, fineTuned: svcModel.startsWith("ft:") } : getChallengeModelInfo();
  res.json({ ok: true, clue: out.next_clue, engine: info.fineTuned ? "fine-tuned" : "prompt", model: info.model });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: String(e?.message || e) });
  }
});

// Submit a guess
router.post("/api/challenge/guess", async (req, res) => {
  try {
    const token = String(req.body?.token || "");
    const guess = String(req.body?.guess || "");
    const verified = verifySessionToken(token);
    if (!verified) return res.status(401).json({ ok: false, error: "invalid token" });
    const out = await checkGuess(verified.secret, guess);
  const svcModel = (out as any)?.modelUsed;
  const info = svcModel ? { model: svcModel, fineTuned: svcModel.startsWith("ft:") } : getChallengeModelInfo();
  res.json({ ok: true, verdict: out.verdict, feedback: out.feedback, engine: info.fineTuned ? "fine-tuned" : "prompt", model: info.model });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: String(e?.message || e) });
  }
});

export default router;
