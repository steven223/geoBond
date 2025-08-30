// Message validation and sanitization utilities

const sanitizeMessage = (content) => {
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  // Remove excessive whitespace and trim
  return content.trim().replace(/\s+/g, ' ');
};

const validateMessage = (content, messageType = 'text') => {
  const errors = [];
  
  if (!content || content.trim().length === 0) {
    errors.push('Message content cannot be empty');
  }
  
  if (content.length > 1000) {
    errors.push('Message content cannot exceed 1000 characters');
  }
  
  const validTypes = ['text', 'image', 'location', 'system'];
  if (!validTypes.includes(messageType)) {
    errors.push('Invalid message type');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const formatMessageForClient = (message) => {
  return {
    _id: message._id,
    conversationId: message.conversationId,
    sender: {
      _id: message.sender._id,
      fullName: message.sender.fullName,
      email: message.sender.email
    },
    content: message.content,
    messageType: message.messageType,
    status: message.status,
    readBy: message.readBy,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
    editedAt: message.editedAt,
    isDeleted: message.isDeleted,
    replyTo: message.replyTo
  };
};

const getConversationName = (conversation, currentUserId) => {
  if (conversation.type === 'group') {
    return conversation.name;
  }
  
  // For direct messages, return the other participant's name
  const otherParticipant = conversation.participants.find(
    p => p._id.toString() !== currentUserId.toString()
  );
  
  return otherParticipant ? otherParticipant.fullName : 'Unknown User';
};

module.exports = {
  sanitizeMessage,
  validateMessage,
  formatMessageForClient,
  getConversationName
};