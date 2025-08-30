const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');
const { sanitizeMessage, validateMessage, getConversationName } = require('../utils/messageUtils');

// Get or create conversation between two users
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    const currentUserId = req.user._id;

    // Verify friendship exists
    const friendship = await FriendRequest.findOne({
      $or: [
        { fromUserId: currentUserId, toUserId: participantId },
        { fromUserId: participantId, toUserId: currentUserId }
      ],
      status: 'accepted'
    });

    if (!friendship) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only chat with your friends'
      });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      type: 'direct',
      participants: { $all: [currentUserId, participantId] }
    }).populate('participants', 'fullName email')
      .populate('lastMessage');

    // Create new conversation if doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUserId, participantId],
        type: 'direct',
        createdBy: currentUserId
      });

      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'fullName email')
        .populate('lastMessage');
    }

    res.json({
      status: 'success',
      data: conversation
    });
  } catch (err) {
    console.error('Get or create conversation error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};
// Get user's conversations
exports.getConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const conversations = await Conversation.find({
      participants: currentUserId,
      isActive: true
    })
      .populate('participants', 'fullName email')
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'sender',
          select: 'fullName'
        }
      })
      .sort({ lastActivity: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      status: 'success',
      data: conversations,
      pagination: {
        page,
        limit,
        total: conversations.length
      }
    });
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Get messages in a conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Verify user is part of conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: currentUserId
    });

    if (!conversation) {
      return res.status(404).json({
        status: 'error',
        message: 'Conversation not found'
      });
    }

    const messages = await Message.find({
      conversationId,
      isDeleted: false
    })
      .populate('sender', 'fullName email')
      .populate('replyTo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      status: 'success',
      data: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page,
        limit,
        total: messages.length
      }
    });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content, messageType = 'text', replyTo } = req.body;
    const currentUserId = req.user._id;

    // Validate and sanitize message content
    const sanitizedContent = sanitizeMessage(content);
    const validation = validateMessage(sanitizedContent, messageType);
    
    if (!validation.isValid) {
      return res.status(400).json({
        status: 'error',
        message: validation.errors[0]
      });
    }

    // Verify user is part of conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: currentUserId
    });

    if (!conversation) {
      return res.status(404).json({
        status: 'error',
        message: 'Conversation not found'
      });
    }

    // Create message
    const message = await Message.create({
      conversationId,
      sender: currentUserId,
      content: sanitizedContent,
      messageType,
      replyTo: replyTo || null
    });

    // Update conversation's last activity and last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastActivity: new Date()
    });

    // Populate message for response
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'fullName email')
      .populate('replyTo');

    res.status(201).json({
      status: 'success',
      data: populatedMessage
    });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.user._id;

    // Verify user is part of conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: currentUserId
    });

    if (!conversation) {
      return res.status(404).json({
        status: 'error',
        message: 'Conversation not found'
      });
    }

    // Mark all unread messages as read
    await Message.updateMany(
      {
        conversationId,
        sender: { $ne: currentUserId },
        'readBy.user': { $ne: currentUserId }
      },
      {
        $push: {
          readBy: {
            user: currentUserId,
            readAt: new Date()
          }
        },
        status: 'read'
      }
    );

    res.json({
      status: 'success',
      message: 'Messages marked as read'
    });
  } catch (err) {
    console.error('Mark as read error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const currentUserId = req.user._id;

    const message = await Message.findOne({
      _id: messageId,
      sender: currentUserId
    });

    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found or unauthorized'
      });
    }

    message.isDeleted = true;
    message.content = 'This message was deleted';
    await message.save();

    res.json({
      status: 'success',
      message: 'Message deleted successfully'
    });
  } catch (err) {
    console.error('Delete message error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const unreadCount = await Message.countDocuments({
      sender: { $ne: currentUserId },
      'readBy.user': { $ne: currentUserId }
    });

    res.json({
      status: 'success',
      data: { unreadCount }
    });
  } catch (err) {
    console.error('Get unread count error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};