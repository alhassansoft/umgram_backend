import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getMessages, listMyConversations, openConversation, sendMessage } from '../controllers/directChatController';

const directChatRoutes = Router();

// Open or create a conversation with a peer
directChatRoutes.post('/open', requireAuth, openConversation);
// List my conversations
directChatRoutes.get('/conversations', requireAuth, listMyConversations);
// Get messages in a conversation
directChatRoutes.get('/conversations/:id/messages', requireAuth, getMessages);
// Send a message to a conversation
directChatRoutes.post('/conversations/:id/messages', requireAuth, sendMessage);

export default directChatRoutes;
