import "dotenv/config";                 // ⬅️ حمّل .env أولًا
import { es } from "../lib/es";

async function run() {
  // تأكد أن القيم موجودة
  if (!process.env.ES_NODE || !process.env.ES_USERNAME || !process.env.ES_PASSWORD) {
    throw new Error("ES_NODE/ES_USERNAME/ES_PASSWORD are missing");
  }

  await es.indices.putMapping({
    index: "umgram_posts",
    properties: {
      entities:   { type: "keyword" },
      actions:    { type: "keyword" },
      attributes: { type: "keyword" },
      inquiry_ar: { type: "text", analyzer: "arabic", search_analyzer: "arabic" },
    },
  });

  console.log("Mapping updated");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
