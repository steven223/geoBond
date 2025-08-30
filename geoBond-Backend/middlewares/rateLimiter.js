const rateLimit = require('express-rate-limit');

// Rate limiter for chat messages
const chatMessageLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each user to 30 messages per minute
  message: {
    status: 'error',
    message: 'Too many messages sent. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? req.user._id.toString() : 'anonymous';
  }
});

// Rate limiter for conversation creation
const conversationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each user to 10 conversation creations per 5 minutes
  message: {
    status: 'error',
    message: 'Too many conversation requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? req.user._id.toString() : 'anonymous';
  }
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each user to 100 requests per 15 minutes
  message: {
    status: 'error',
    message: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? req.user._id.toString() : 'anonymous';
  }
});

module.exports = {
  chatMessageLimiter,
  conversationLimiter,
  apiLimiter
};