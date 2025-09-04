import fs from "fs";
import path from "path";

/*
This script builds a JSONL file for Chat fine-tuning.
Each line is an object with a top-level `messages` array: [{role, content}, ...].
Assistant content is strict JSON (as a string) to teach structured outputs.
*/

type Example = {
  topic: string;
  secret: string;
  first_clue: string;
  extra_clues?: string[];
  guesses?: { guess: string; verdict: "correct" | "incorrect" | "close"; feedback: string }[];
};

const EXAMPLES: Example[] = [
  {
    topic: "كرة قدم",
    secret: "كأس العالم",
    first_clue: "بطولة عالمية تقام كل أربع سنوات وتجمع منتخبات دولية",
    extra_clues: ["الجائزة الأهم في هذه الرياضة", "تنظمها جهة دولية معروفة"],
    guesses: [
      { guess: "دوري أبطال أوروبا", verdict: "incorrect", feedback: "بطولة أندية سنوية وليست منتخبات" },
      { guess: "مونديال", verdict: "correct", feedback: "هو نفسه الكأس المشار إليه" },
    ],
  },
  {
    topic: "أفلام",
    secret: "سيد الخواتم",
    first_clue: "سلسلة خيالية ملحمية مبنية على روايات شهيرة",
    extra_clues: ["تدور حول خاتم قادر على السيطرة", "أحداثها في أرض خيالية تُدعى ميدل-إيرث"],
    guesses: [
      { guess: "هاري بوتر", verdict: "incorrect", feedback: "سلسلة سحرية مختلفة لا تتمحور حول خاتم" },
      { guess: "Lord of the Rings", verdict: "correct", feedback: "تخمين صحيح" },
    ],
  },
];

const OUT_DIR = path.resolve(process.cwd(), "data/challenge");
fs.mkdirSync(OUT_DIR, { recursive: true });
const OUT_FILE = path.join(OUT_DIR, "training.jsonl");

const SYSTEM = "You are a game master for a 'Guess What I Mean' game. Keep secrets hidden, give short high-signal clues, and judge guesses strictly.";

function line(obj: any) {
  return JSON.stringify(obj) + "\n";
}

const fd = fs.createWriteStream(OUT_FILE, { encoding: "utf8" });

for (const ex of EXAMPLES) {
  // Start sample
  fd.write(
    line({
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: `Pick a secret about topic: "${ex.topic}" and return {secret, first_clue}` },
        { role: "assistant", content: JSON.stringify({ secret: ex.secret, first_clue: ex.first_clue }) },
      ],
    })
  );
  // Extra clues
  for (const c of ex.extra_clues ?? []) {
    fd.write(
      line({
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Secret: "${ex.secret}". Previous clues: ["${ex.first_clue}"] Return {next_clue}` },
          { role: "assistant", content: JSON.stringify({ next_clue: c }) },
        ],
      })
    );
  }
  // Guesses
  for (const g of ex.guesses ?? []) {
    fd.write(
      line({
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Secret: "${ex.secret}" Guess: "${g.guess}" Return {verdict, feedback}` },
          { role: "assistant", content: JSON.stringify({ verdict: g.verdict, feedback: g.feedback }) },
        ],
      })
    );
  }
}

fd.end();
console.log("Wrote:", OUT_FILE);
