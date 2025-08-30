const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authenticateJWT');
const { chatMessageLimiter, conversationLimiter, apiLimiter } = require('../middlewares/rateLimiter');
const chatController = require('../controllers/chatController');

// Get or create conversation
router.post('/conversation', authenticateJWT, conversationLimiter, chatController.getOrCreateConversation);

// Get user's conversations
router.get('/conversations', authenticateJWT, apiLimiter, chatController.getConversations);

// Get messages in a conversation
router.get('/conversation/:conversationId/messages', authenticateJWT, apiLimiter, chatController.getMessages);

// Send a message
router.post('/message', authenticateJWT, chatMessageLimiter, chatController.sendMessage);

// Mark messages as read
router.put('/conversation/:conversationId/read', authenticateJWT, apiLimiter, chatController.markAsRead);

// Delete a message
router.delete('/message/:messageId', authenticateJWT, apiLimiter, chatController.deleteMessage);

// Get unread message count
router.get('/unread-count', authenticateJWT, apiLimiter, chatController.getUnreadCount);

module.exports = router;