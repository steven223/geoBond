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
    }).populate('fromUserId', 'email', 'fullName');

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
      .populate('toUserId', 'email fullName email fullName gender location');

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
    }).populate('fromUserId', 'email', 'fullName')
      .populate('toUserId', 'email', 'fullName')
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