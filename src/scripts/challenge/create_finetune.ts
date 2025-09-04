import OpenAI from "openai";
import path from "path";
import fs from "fs";

async function main() {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_AI || "";
  if (!apiKey) throw new Error("OPENAI_API_KEY is required");
  const client = new OpenAI({ apiKey });

  // Upload training file
  const filePath = path.resolve(process.cwd(), "data/challenge/training.jsonl");
  if (!fs.existsSync(filePath)) throw new Error("training.jsonl not found; run prepare_training.ts first");

  console.log("Uploading training file:", filePath);
  const up = await client.files.create({ file: fs.createReadStream(filePath) as any, purpose: "fine-tune" });
  console.log("Uploaded file id:", up.id);

  // Create fine-tune job
  const baseModel = process.env.CHALLENGE_BASE_MODEL || process.env.LLM_MODEL || process.env.OPENAI_CHAT_MODEL || "gpt-4.1-mini-2025-04-14";
  const suffix = process.env.CHALLENGE_FT_SUFFIX || "challenge-game";
  const job = await client.fineTuning.jobs.create({
    model: baseModel,
    training_file: up.id,
    suffix,
  } as any);

  console.log("Fine-tune job created:", job.id);
  console.log("Monitor with: openai api fine_tunes.follow -i", job.id);
}

main().catch((e) => { console.error(e); process.exit(1); });
