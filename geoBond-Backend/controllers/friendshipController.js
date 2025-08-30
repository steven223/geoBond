const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');
const UserLocation = require('../models/UserLocation');

// 1. Search for users by email
exports.searchUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const currentUserId = req.user._id;

    if (!search) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }

    const users = await User.find({
      email: { $regex: search, $options: 'i' },
      _id: { $ne: currentUserId } // Exclude current user
    }).select('email fullName');

    res.json({
      status: 'success',
      data: users
    });
  } catch (err) {
    console.error('Search users error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// 2. Send friend request
exports.sendFriendRequest = async (req, res) => {
  try {
    const { toUserId } = req.body;
    const fromUserId = req.user._id;
    console.log("This is fromUserId", fromUserId);
    // Check if user exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({
        status: 'error',
        message: 'Friend request already exists'
      });
    }

    // Create friend request
    const friendRequest = await FriendRequest.create({
      fromUserId,
      toUserId,
      status: 'pending'
    });

    res.status(201).json({
      status: 'success',
      message: 'Friend request sent successfully',
      data: friendRequest
    });
  } catch (err) {
    console.error('Send friend request error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// 3. Get incoming friend requests
exports.getIncomingRequests = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const requests = await FriendRequest.find({
      toUserId: currentUserId,
      status: 'pending'
    }).populate('fromUserId', 'email fullName');

    res.json({
      status: 'success',
      data: requests
    });
  } catch (err) {
    console.error('Get incoming requests error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// 4. Get outgoing friend requests
exports.getOutgoingRequests = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const requests = await FriendRequest.find({
      fromUserId: currentUserId,
      status: 'pending'
    }).populate('toUserId', 'email fullName');

    res.json({
      status: 'success',
      data: requests
    });
  } catch (err) {
    console.error('Get outgoing requests error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// 5. Accept friend request
exports.acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const currentUserId = req.user._id;

    const friendRequest = await FriendRequest.findOne({
      _id: requestId,
      toUserId: currentUserId,
      status: 'pending'
    });

    if (!friendRequest) {
      return res.status(404).json({
        status: 'error',
        message: 'Friend request not found'
      });
    }

    friendRequest.status = 'accepted';
    friendRequest.updatedAt = new Date();
    await friendRequest.save();

    res.json({
      status: 'success',
      message: 'Friend request accepted',
      data: friendRequest
    });
  } catch (err) {
    console.error('Accept friend request error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// 6. Reject friend request
exports.rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const currentUserId = req.user._id;

    const friendRequest = await FriendRequest.findOne({
      _id: requestId,
      toUserId: currentUserId,
      status: 'pending'
    });

    if (!friendRequest) {
      return res.status(404).json({
        status: 'error',
        message: 'Friend request not found'
      });
    }

    friendRequest.status = 'rejected';
    friendRequest.updatedAt = new Date();
    await friendRequest.save();

    res.json({
      status: 'success',
      message: 'Friend request rejected',
      data: friendRequest
    });
  } catch (err) {
    console.error('Reject friend request error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// 7. Get friends list
exports.getFriends = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    // Get accepted friend requests where current user is either sender or receiver
    const acceptedRequests = await FriendRequest.find({
      $or: [
        { fromUserId: currentUserId },
        { toUserId: currentUserId }
      ],
      status: 'accepted'
    }).populate('fromUserId', 'email fullName gender location')
      .populate('toUserId', 'email fullName gender location');

    // Extract friend information
    const friends = acceptedRequests.map(request => {
      const friend = request.fromUserId._id.equals(currentUserId)
        ? request.toUserId
        : request.fromUserId;

      return {
        _id: friend._id,
        email: friend.email,
        fullName: friend.fullName,
        requestId: request._id,
        gender: friend.gender,
        location: friend.location,
      };
    });

    res.json({
      status: 'success',
      data: friends
    });
  } catch (err) {
    console.error('Get friends error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// 8. Get friend's location history
exports.getFriendLocationHistory = async (req, res) => {
  try {
    const { friendId } = req.params;
    const currentUserId = req.user._id;

    // Verify friendship exists
    const friendship = await FriendRequest.findOne({
      $or: [
        { fromUserId: currentUserId, toUserId: friendId },
        { fromUserId: friendId, toUserId: currentUserId }
      ],
      status: 'accepted'
    });

    if (!friendship) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only view location history of your friends'
      });
    }

    // Get location history
    const locationHistory = await UserLocation.find({
      userId: friendId
    }).sort({ timestamp: -1 }).limit(50); // Last 50 locations

    res.json({
      status: 'success',
      data: locationHistory
    });
  } catch (err) {
    console.error('Get friend location history error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// 9. Get request history
exports.getRequestHistory = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const requests = await FriendRequest.find({
      $or: [
        { fromUserId: currentUserId },
        { toUserId: currentUserId }
      ]
    }).populate('fromUserId', 'email fullName')
      .populate('toUserId', 'email fullName')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: requests
    });
  } catch (err) {
    console.error('Get request history error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// 10. Get friend request counts
exports.getRequestCounts = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const [incomingCount, outgoingCount] = await Promise.all([
      FriendRequest.countDocuments({
        toUserId: currentUserId,
        status: 'pending'
      }),
      FriendRequest.countDocuments({
        fromUserId: currentUserId,
        status: 'pending'
      })
    ]);

    res.json({
      status: 'success',
      data: {
        incoming: incomingCount,
        outgoing: outgoingCount,
        total: incomingCount + outgoingCount
      }
    });
  } catch (err) {
    console.error('Get request counts error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// 11. Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const [friendsCount, locationsCount, acceptedRequestsCount] = await Promise.all([
      // Count accepted friends
      FriendRequest.countDocuments({
        $or: [
          { fromUserId: currentUserId },
          { toUserId: currentUserId }
        ],
        status: 'accepted'
      }),
      // Count user's location history
      UserLocation.countDocuments({ userId: currentUserId }),
      // Count total accepted requests (sent + received)
      FriendRequest.countDocuments({
        $or: [
          { fromUserId: currentUserId },
          { toUserId: currentUserId }
        ],
        status: 'accepted'
      })
    ]);

    res.json({
      status: 'success',
      data: {
        friends: friendsCount,
        locations: locationsCount,
        shared: acceptedRequestsCount
      }
    });
  } catch (err) {
    console.error('Get user stats error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// 12. Get recent activities
exports.getRecentActivities = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    // Get recent friend requests (both sent and received)
    const recentRequests = await FriendRequest.find({
      $or: [
        { fromUserId: currentUserId },
        { toUserId: currentUserId }
      ]
    })
      .populate('fromUserId', 'fullName email')
      .populate('toUserId', 'fullName email')
      .sort({ updatedAt: -1 })
      .limit(limit);

    // Transform to activity format
    const activities = recentRequests.map(request => {
      const isIncoming = request.toUserId._id.equals(currentUserId);
      const otherUser = isIncoming ? request.fromUserId : request.toUserId;

      let type, message;

      if (request.status === 'pending') {
        if (isIncoming) {
          type = 'friend_request';
          message = 'sent you a friend request';
        } else {
          type = 'friend_request';
          message = 'received your friend request';
        }
      } else if (request.status === 'accepted') {
        type = 'friend_accepted';
        message = isIncoming ? 'accepted your friend request' : 'you accepted their friend request';
      }

      return {
        id: request._id,
        type,
        userName: otherUser.fullName,
        userId: otherUser._id,
        message,
        timestamp: request.updatedAt
      };
    });

    res.json({
      status: 'success',
      data: activities
    });
  } catch (err) {
    console.error('Get recent activities error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// 13. Get friends with online status (mock for now)
exports.getFriendsWithStatus = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Get accepted friend requests
    const acceptedRequests = await FriendRequest.find({
      $or: [
        { fromUserId: currentUserId },
        { toUserId: currentUserId }
      ],
      status: 'accepted'
    }).populate('fromUserId', 'fullName email location lastKnownLocation')
      .populate('toUserId', 'fullName email location lastKnownLocation');

    // Extract friend information with mock status
    const friends = acceptedRequests.map(request => {
      const friend = request.fromUserId._id.equals(currentUserId)
        ? request.toUserId
        : request.fromUserId;

      // Mock online status based on last known location timestamp
      const lastLocationTime = friend.lastKnownLocation?.timestamp;
      const now = new Date();
      const timeDiff = lastLocationTime ? (now - new Date(lastLocationTime)) / (1000 * 60) : null; // minutes

      let status = 'offline';
      if (timeDiff && timeDiff < 5) status = 'online';
      else if (timeDiff && timeDiff < 30) status = 'away';

      return {
        id: friend._id,
        name: friend.fullName,
        email: friend.email,
        status,
        location: friend.location?.city || 'Location not set',
        lastSeen: timeDiff ? `${Math.floor(timeDiff)} minutes ago` : 'Long time ago'
      };
    });

    res.json({
      status: 'success',
      data: friends
    });
  } catch (err) {
    console.error('Get friends with status error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// 14. Check friendship status with a specific user
exports.checkFriendshipStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Check if user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check for existing friendship (accepted request)
    const friendship = await FriendRequest.findOne({
      $or: [
        { fromUserId: currentUserId, toUserId: userId },
        { fromUserId: userId, toUserId: currentUserId }
      ],
      status: 'accepted'
    });

    if (friendship) {
      return res.json({
        status: 'success',
        data: {
          isFriend: true,
          hasPendingRequest: false,
          requestDirection: null,
          requestId: null
        }
      });
    }

    // Check for pending request
    const pendingRequest = await FriendRequest.findOne({
      $or: [
        { fromUserId: currentUserId, toUserId: userId },
        { fromUserId: userId, toUserId: currentUserId }
      ],
      status: 'pending'
    });

    if (pendingRequest) {
      const requestDirection = pendingRequest.fromUserId.equals(currentUserId) ? 'sent' : 'received';
      return res.json({
        status: 'success',
        data: {
          isFriend: false,
          hasPendingRequest: true,
          requestDirection,
          requestId: pendingRequest._id
        }
      });
    }

    // No relationship exists
    res.json({
      status: 'success',
      data: {
        isFriend: false,
        hasPendingRequest: false,
        requestDirection: null,
        requestId: null
      }
    });
  } catch (err) {
    console.error('Check friendship status error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
}; 