const LocationShare = require('../models/LocationShare');

const checkFreeLimit = async (req, res, next) => {
  const user = req.user; // This is set by JWT auth middleware

  if (user.isPaidUser) {
    return next(); // No restrictions
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Daily requests sent
    const requestCountToday = await LocationShare.countDocuments({
      fromUserId: user._id,
      createdAt: { $gte: today }
    });

    if (requestCountToday >= 3) {
      return res.status(403).json({
        message: 'Free user limit: Max 3 requests per day reached.'
      });
    }

    // 2. Total accepted friends
    const friendCount = await LocationShare.countDocuments({
      $or: [
        { fromUserId: user._id, status: 'accepted' },
        { toUserId: user._id, status: 'accepted' }
      ]
    });

    if (friendCount >= 3) {
      return res.status(403).json({
        message: 'Free user limit: Max 3 accepted friends reached.'
      });
    }

    next();
  } catch (err) {
    console.error('❌ Error in checkFreeLimit middleware:', err);
    res.status(500).json({ message: 'Server error during limit check.' });
  }
};

module.exports = checkFreeLimit;
