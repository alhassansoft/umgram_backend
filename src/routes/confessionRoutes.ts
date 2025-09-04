import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { addMessage, ask, createSession, getMessages, listSessions, replyAll, getConfessionExtraction, rebuildConfessionExtraction } from "../controllers/confessionController";

const confessionRoutes = Router();

// Sessions (reusing chatConversation model)
confessionRoutes.post("/sessions", requireAuth, createSession);
confessionRoutes.get("/sessions", requireAuth, listSessions);
confessionRoutes.get("/sessions/:id/messages", requireAuth, getMessages);
confessionRoutes.post("/sessions/:id/messages", requireAuth, addMessage);
confessionRoutes.post("/sessions/:id/ask", requireAuth, ask);
confessionRoutes.post("/sessions/:id/replyAll", requireAuth, replyAll);
// Extractions (entity graph) for confession session
confessionRoutes.get("/sessions/:id/extraction", requireAuth, getConfessionExtraction);
confessionRoutes.post("/sessions/:id/extraction/rebuild", requireAuth, rebuildConfessionExtraction);

export default confessionRoutes;
