import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { addMessage, ask, createSession, getMessages, listSessions } from "../controllers/chatController";

const chatRoutes = Router();

// Sessions
chatRoutes.post("/sessions", requireAuth, createSession);
chatRoutes.get("/sessions", requireAuth, listSessions);

// Messages
chatRoutes.get("/sessions/:id/messages", requireAuth, getMessages);
chatRoutes.post("/sessions/:id/messages", requireAuth, addMessage);

// Ask (search + answer + persist)
chatRoutes.post("/sessions/:id/ask", requireAuth, ask);

export default chatRoutes;
