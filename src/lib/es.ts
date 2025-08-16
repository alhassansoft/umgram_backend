// src/lib/es.ts
import { Client, errors } from "@elastic/elasticsearch";
import type { ClientOptions } from "@elastic/elasticsearch";

const NODE = process.env.ELASTIC_NODE || process.env.ES_NODE || "https://31d616015b66.ngrok-free.app";
const USER = process.env.ELASTIC_USER || process.env.ES_USERNAME;
const PASS = process.env.ELASTIC_PASS || process.env.ES_PASSWORD;

const options: ClientOptions = {
  node: NODE,
  sniffOnStart: false,
  sniffInterval: false,
  maxRetries: 5,
  requestTimeout: 30_000
};

// Only add `auth` if we have a username (don’t set `undefined`)
if (USER) {
  options.auth = { username: USER, password: PASS ?? "" } as { username: string; password: string };
}

export const es = new Client(options);

export const POSTS_INDEX = process.env.ES_POSTS_INDEX || "umgram_posts";

// GET-based existence check (avoid HEAD which ngrok can block)
async function indexExists(index: string) {
  try {
    await es.indices.get({ index });
    return true;
  } catch (e: any) {
    if (e instanceof errors.ResponseError && e.meta?.statusCode === 404) return false;
    throw e;
  }
}

export async function ensurePostsIndex() {
  // ngrok-friendly connectivity check
  await es.info();

  if (await indexExists(POSTS_INDEX)) {
    console.log(`Index "${POSTS_INDEX}" exists.`);
    return;
  }

  await es.indices.create({
    index: POSTS_INDEX,
    mappings: {
      properties: {
        title: {
          type: "text",
          fields: {
            ar: { type: "text", analyzer: "arabic" },
            en: { type: "text", analyzer: "english" },
            s:  { type: "search_as_you_type" }
          }
        },
        body: {
          type: "text",
          fields: {
            ar: { type: "text", analyzer: "arabic" },
            en: { type: "text", analyzer: "english" }
          }
        },
        authorId:  { type: "integer" },
        createdAt: { type: "date" }
      }
    }
  });

  console.log(`Created index "${POSTS_INDEX}".`);
}
