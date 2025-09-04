# Chat persistence

This backend adds minimal chat persistence via Prisma.

Models:
- ChatConversation: id, userId, title, timestamps
- ChatMessage: id, conversationId, role ('user'|'assistant'), text, source (DIARY|NOTE), mode (WIDE|STRICT), meta, createdAt

Migrate:
- Ensure DATABASE_URL is set
- Run: npm run prisma:generate && npm run prisma:migrate

API (all require auth):
- POST /api/chat/sessions { title? } -> create session
- GET  /api/chat/sessions -> list my sessions
- GET  /api/chat/sessions/:id/messages -> list messages
- POST /api/chat/sessions/:id/messages { role, text, source?, mode?, meta? } -> append message
- POST /api/chat/sessions/:id/ask { question, source: 'diary'|'note', mode: 'wide'|'strict' } -> runs search+selector and persists user+assistant messages

Optional SQL (if not using Prisma): scripts/sql/create_chat_tables.sql
