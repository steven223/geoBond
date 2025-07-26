const LocationShare = require("../models/LocationShare");
const User = require("../models/User");
const FriendList = require("../models/FriendList");
const UserLocation = require("../models/UserLocation");

exports.sendLocationRequest = async (req, res) => {
  try {
    const { toUserId } = req.body;
    const newRequest = await LocationShare.create({
      fromUserId: req.user._id,
      toUserId,
      status: "pending"
    });
    res.status(201).json(newRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending request" });
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;
    const request = await LocationShare.findById(requestId);
    if (!request || request.toUserId.toString() !== req.user._id) {
      return res.status(404).json({ message: "Request not found or unauthorized" });
    }

    request.status = action;
    await request.save();
    res.json({ message: `Request ${action}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating request" });
  }
};

exports.getUserLocationHistory = async (req, res) => {
  const { friendId } = req.params;
  const userId = req.user._id;

  try {
    const currentUser = await User.findById(userId);

    if (!currentUser) return res.status(404).json({ message: "User not found" });

    // Get friend locations
    let limit = currentUser.isPaidUser ? 100 : 3;

    const history = await UserLocation.find({ userId: friendId })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({ history });
  } catch (err) {
    console.error("❌ Error getting history:", err);
    res.status(500).json({ message: "Failed to get location history" });
  }
};

exports.getMyFriends = async (req, res) => {
  const userId = req.user._id;

  try {
    const friends = await FriendList.find({ userId }).populate("friendId", "fullName profileImageUrl email");
    res.json(friends.map(f => f.friendId));
  } catch (err) {
    console.error("❌ Error getting friends:", err);
    res.status(500).json({ message: "Failed to fetch friends" });
  }
};

exports.addFriend = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user._id;

  try {
    // Prevent self-friendship
    if (userId.toString() === friendId) {
      return res.status(400).json({ message: "Cannot add yourself as friend" });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    // Free user limit: max 3 friends
    if (!currentUser.isPaidUser) {
      const friendCount = await FriendList.countDocuments({ userId });
      if (friendCount >= 3) {
        return res.status(403).json({ message: "Free users can add up to 3 friends only" });
      }
    }

    // Check for duplicate
    const alreadyExists = await FriendList.findOne({ userId, friendId });
    if (alreadyExists) {
      return res.status(409).json({ message: "Friend already added" });
    }

    const friendList = await FriendList.create({ userId, friendId });

    res.status(201).json({ message: "Friend added", friendList });
  } catch (err) {
    console.error("❌ Error adding friend:", err);
    res.status(500).json({ message: "Failed to add friend" });
  }
};

exports.removeFriend = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user._id;

  try {
    const currentUser = await User.findById(userId);

    if (!currentUser) return res.status(404).json({ message: "User not found" });

    await FriendList.deleteOne({ userId, friendId });
    res.json({ message: "Friend removed" });
  } catch (err) {
    console.error("❌ Error removing friend:", err);
    res.status(500).json({ message: "Failed to remove friend" });
  }
};

exports.acceptRequest = async (req, res) => {
  const { requestId } = req.body;
  const userId = req.user._id;

  try {
    const request = await LocationShare.findById(requestId);

    if (!request || request.toUserId.toString() !== userId) {
      return res.status(404).json({ message: "Request not found or unauthorized" });
    }

    request.status = "accepted";
    await request.save();
    res.json({ message: "Request accepted" });
  } catch (err) {
    console.error("❌ Error accepting request:", err);
    res.status(500).json({ message: "Failed to accept request" });
  }
};
