const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authenticateJWT');
const friendshipController = require('../controllers/friendshipController');

// Search for users by email
router.get('/searchFriends', authenticateJWT, friendshipController.searchUsers);

// Send friend request
router.post('/request', authenticateJWT, friendshipController.sendFriendRequest);

// Get incoming friend requests
router.get('/requests/incoming', authenticateJWT, friendshipController.getIncomingRequests);

// Get outgoing friend requests
router.get('/requests/outgoing', authenticateJWT, friendshipController.getOutgoingRequests);

// Accept friend request
router.put('/request/:requestId/accept', authenticateJWT, friendshipController.acceptFriendRequest);

// Reject friend request
router.put('/request/:requestId/reject', authenticateJWT, friendshipController.rejectFriendRequest);

// Get friends list
router.get('/friends', authenticateJWT, friendshipController.getFriends);

// Get friend's location history
router.get('/friend/:friendId/location-history', authenticateJWT, friendshipController.getFriendLocationHistory);

// Get request history
router.get('/requests/history', authenticateJWT, friendshipController.getRequestHistory);

// Get friend request counts
router.get('/requests/count', authenticateJWT, friendshipController.getRequestCounts);

// Get user statistics
router.get('/stats', authenticateJWT, friendshipController.getUserStats);

// Get recent activities
router.get('/activities/recent', authenticateJWT, friendshipController.getRecentActivities);

// Get friends with online status
router.get('/friends/status', authenticateJWT, friendshipController.getFriendsWithStatus);

// Check friendship status with a specific user
router.get('/status/:userId', authenticateJWT, friendshipController.checkFriendshipStatus);

module.exports = router; 